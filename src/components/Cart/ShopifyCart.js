import React from 'react'
import Client from 'shopify-buy';

const getStoreClient = () => {
    const client = Client.buildClient({
        storefrontAccessToken: 'df2587edeb636a70f1fcdbcf4ff2a8ed',
        domain: 'ecomloop-com.myshopify.com'
    });
    return client;
}

//productID  "10651656584"

export const addItemToCart = (item) => {
    const client = getStoreClient();
    console.log("Cart Client = ", client)

    //Create checkout
    /*
    client.checkout.create().then((checkout) => {
        console.log(checkout);
    });
    */

    //Fetch product (to be added to cart) by id
    /*
    client.product.fetchAll().then((products) => {
        console.log("products", products);
        products.map((product) => {
            console.log("product.handle", product.handle);
        })
    });
    */

    // Adding Line Item to the cart
    /*
    const checkoutId = 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0SW1hZ2UvMTgyMTc3ODc1OTI='; // ID of an existing checkout
    const lineItemsToAdd = [
        {
            variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8yOTEwNjAyMjc5Mg==',
            quantity: 5,
            customAttributes: [{ key: "MyKey", value: "MyValue" }]
        }
    ];
    // Add an item to the checkout
    client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
        console.log(checkout.lineItems); // Array with one additional line item
    });
    */
}