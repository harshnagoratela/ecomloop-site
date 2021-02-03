import React from "react";
import useGlobalHook from "use-global-hook";
import Client from 'shopify-buy';
import _ from 'lodash';
import { isBrowser } from './utils'
import fetch from 'node-fetch';

const initialState = {
    isCartOpen: false,
    client: null,
    checkout: { lineItems: [] },
    products: [],
    giftcardExchangeProduct: {},
    giftcardProduct: {},
    pledgelingProduct: {},
    pledgelingAdded: false,
    shop: {},
    shopUrl: "https://emprezzo.myshopify.com",
    accessToken: "0c291ce7693710e4baf0db2cf74576ca",
    visibility: false,
    user: {},
    authenticated: false,
    authMessage: ""
};

const setLocalStorage = (value) => {
    if (isBrowser()) {
        window.localStorage.setItem('shopifycart', JSON.stringify(value));
    }
}

const getLocalStorage = () => {
    return ((isBrowser() && window.localStorage.getItem('shopifycart')) ? JSON.parse(window.localStorage.getItem('shopifycart')) : []);
}

const setUserToLocalStorage = (value) => {
    if (isBrowser()) {
        window.localStorage.setItem('shopifyuser', JSON.stringify(value));
    }
}

const getUserFromLocalStorage = () => {
    return ((isBrowser() && window.localStorage.getItem('shopifyuser')) ? JSON.parse(window.localStorage.getItem('shopifyuser')) : null);
}

const removeItemFromLocalStorage = (cart) => {
    if (isBrowser() && cart && cart.lineItems) {
        const newList = [];
        cart.lineItems.map((lineitem) => {
            newList.push({
                variantId: lineitem.variant.id,
                quantity: lineitem.quantity,
                customAttributes: lineitem.customAttributes
            })
        });
        setLocalStorage(newList)
    }
}

const createCustomerQuery = `mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;
const findCustomerQuery = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }`;

const actions = {
    addToCounter: (store, amount) => {
        const newCounterValue = store.state.counter + amount;
        store.setState({ counter: newCounterValue });
    },
    show: (store, change) => {
        store.setState({ visibility: change });
    },
    initializeStoreClient: (store) => {
        if (store.state.client == null) {
            const localClient = Client.buildClient({
                storefrontAccessToken: store.accessToken,
                domain: store.shopUrl
            });
            store.setState({ client: localClient });
        }
    },
    initializeCheckout: (store) => {
        store.state.client.checkout.create().then((res) => {
            store.setState({ checkout: res });

            //getting from localstorage if it exists
            const lineItemsToAdd = getLocalStorage();
            if (lineItemsToAdd) {
                const checkoutId = store.state.checkout.id
                return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(response => {
                    store.setState({ checkout: response });
                });
            }
        });
    },
    initializeProducts: (store) => {
        store.state.client.product.fetchAll().then((res) => {
            // res.map((item) => {
            //     console.log(item.id, item.title, item.id, item.variants.length, item.variants[0].id)
            // })
            store.setState({ products: res });
            //Gift card exchange
            const giftCardPlaceholder = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NjU1NDcxODM=")
            store.setState({ giftcardExchangeProduct: giftCardPlaceholder[0] });
            //emprezzo gift card
            const gcProduct = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3NzE1NzY0OTU=")
            store.setState({ giftcardProduct: gcProduct[0] });
            //pledgeling 
            const pledgeProduct = _.filter(res, (item) => item.id == "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzYxNTU3OTg4Mzk0NzE=")
            store.setState({ pledgelingProduct: pledgeProduct[0] });
        });
    },
    initializeShops: (store) => {
        store.state.client.shop.fetchInfo().then((res) => {
            store.setState({ shop: res });
        });
    },
    addVariantToCart: (store, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        const variantId = store.state.giftcardExchangeProduct.variants[0].id;
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        setLocalStorage(_.concat(getLocalStorage(), lineItemsToAdd)); //add item to localstorage
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    addGiftCardToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        setLocalStorage(_.concat(getLocalStorage(), lineItemsToAdd)); //add item to localstorage
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({ checkout: res });
        });
    },
    addPledgelingToCart: (store, variantId, quantity, customAttributes) => {
        store.setState({
            isCartOpen: true,
        });
        customAttributes = customAttributes || [];
        customAttributes.push({
            key: "uniqueID",
            value: "" + (new Date().getTime())
        })
        const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10), customAttributes }]
        const checkoutId = store.state.checkout.id
        return store.state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
            store.setState({
                checkout: res,
                pledgelingAdded: true
            });
        });
    },
    updateQuantityInCart: (store, lineItemId, quantity) => {
        const checkoutId = store.state.checkout.id
        const lineItemsToUpdate = [{ id: lineItemId, quantity: parseInt(quantity, 10) }]
        return store.state.client.checkout.updateLineItems(checkoutId, lineItemsToUpdate).then(res => {
            store.setState({ checkout: res });
        });
    },
    removeLineItemInCart: (store, lineItemId) => {
        const checkoutId = store.state.checkout.id
        const itemBeingRemoved = _.filter(store.state.checkout.lineItems, (item) => item.id == lineItemId)
        return store.state.client.checkout.removeLineItems(checkoutId, [lineItemId]).then(res => {
            removeItemFromLocalStorage(res);
            store.setState({
                checkout: res
            });
            //checking if the pledgeling item is remove then show the buy pledgeling button
            if (itemBeingRemoved[0].variant.product.id == store.state.pledgelingProduct.id) {
                store.setState({
                    pledgelingAdded: false
                });
            }
        });
    },
    handleCartOpen: (store) => {
        store.setState({ isCartOpen: true });
    },
    handleCartClose: (store) => {
        store.setState({ isCartOpen: false });
    },
    registerUser: (store, user) => {
        store.setState({ authMessage: "" });
        const params = {
            query: createCustomerQuery,
            variables: {
                input: {
                    "email": user.email,
                    "password": user.password
                }
            }
        }
        const optionsQuery = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Shopify-Storefront-Access-Token": store.state.accessToken
            },
            body: JSON.stringify(params)
        };

        fetch(store.state.shopUrl + `/api/graphql`, optionsQuery)
            .then(res => res.json())
            .then(response => {
                console.log("=============== Response from Create Customer Call ===============", response);
                console.log(JSON.stringify(response, null, 4))
                if (response.data && response.data.customerCreate) {
                    if (response.data.customerCreate.customer) {
                        const localUser = {
                            email: user.email
                        }
                        setUserToLocalStorage(localUser)
                        console.log("***** getuser", getUserFromLocalStorage())
                        store.setState({ authMessage: "User registered and Logged in Successfully", user: localUser, authenticated: (getUserFromLocalStorage() !== null) });
                    }
                    if (!!response.data.customerCreate.customerUserErrors.length) {
                        setUserToLocalStorage(null)
                        store.setState({ authMessage: response.data.customerCreate.customerUserErrors[0].message, authenticated: false });
                    }
                }
                if (response.errors) {
                    setUserToLocalStorage(null)
                    store.setState({ authMessage: response.errors[0].message, authenticated: false });
                }
            });
    },
    signinUser: (store, user) => {
        store.setState({ authMessage: "" });
        const params = {
            query: findCustomerQuery,
            variables: {
                input: {
                    "email": user.email,
                    "password": user.password
                }
            }
        }
        const optionsQuery = {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "X-Shopify-Storefront-Access-Token": store.state.accessToken
            },
            body: JSON.stringify(params)
        };

        fetch(store.state.shopUrl + `/api/graphql`, optionsQuery)
            .then(res => res.json())
            .then(response => {
                console.log("=============== Response from Find Customer Call ===============", response);
                // console.log(JSON.stringify(response, null, 4))
                if (response.data && response.data.customerAccessTokenCreate) {
                    if (response.data.customerAccessTokenCreate.customerAccessToken) {
                        const localUser = {
                            email: user.email
                        }
                        setUserToLocalStorage(localUser)
                        console.log("***** getuser", getUserFromLocalStorage())
                        store.setState({ authMessage: "Login Successful", user: localUser, authenticated: (getUserFromLocalStorage() !== null) });
                    }
                    if (!!response.data.customerAccessTokenCreate.customerUserErrors.length) {
                        setUserToLocalStorage(null)
                        store.setState({ authMessage: response.data.customerAccessTokenCreate.customerUserErrors[0].message, authenticated: false });
                    }
                }
                if (response.errors) {
                    setUserToLocalStorage(null)
                    store.setState({ authMessage: response.errors[0].message, authenticated: false });
                }
            });
    },
    signoutUser: (store) => {
        setUserToLocalStorage(null)
        store.setState({ authMessage: "Logged Out Successfully", user: {}, authenticated: false });
    }
};

const useGlobal = useGlobalHook(React, initialState, actions);
export const connect = Component => {
    return props => {
        let [state, actions] = useGlobal();
        let _props = { ...props, state, actions };
        return <Component {..._props} />;
    };
};

export default useGlobal;
