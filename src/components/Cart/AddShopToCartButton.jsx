import React, { useContext } from 'react';
import { CartContext } from './CartContext'
import useGlobal from "./CartState";
import { Dialog } from "@reach/dialog";
import ShopifyAuthentication from "./ShopifyAuthentication"

const AddShopToCartButton = ({ details }) => {
    const { addProduct, cartItems } = useContext(CartContext);
    const [globalState, globalActions] = useGlobal();
    const [showDialog, setShowDialog] = React.useState(false);
    const openDialog = () => {
        setShowDialog(true);
    }
    const closeDialog = () => setShowDialog(false);

    const isInCart = shop => {
        return !!cartItems.find(item => item.id === shop.id);
    }
    const addShopToCartWrapper = () => {
        const hitToProduct = {
            id: details.emprezzoID,
            type: "shop",
            name: details.storeName,
            price: 0,
            photo: details.storeProfileImage,
            productURL: details.storeURL,
            emprezzoID: details.emprezzoID,
            shopName: details.storeName,
            description: details.description,
        }
        //Add shop to cart only if it is not already present
        if (!isInCart(hitToProduct)) addProduct(hitToProduct);
    }

    return (
        <>
            <button className="button" onClick={globalState.authenticated?addShopToCartWrapper:openDialog}>Save Shop</button>
            <Dialog isOpen={showDialog} onDismiss={closeDialog}>
                <button className="close-button" onClick={closeDialog} style={{ float: "right", cursor: "pointer" }}>
                    <span aria-hidden>X</span>
                </button>
                <ShopifyAuthentication/>
            </Dialog>
        </>
    );
}

export default AddShopToCartButton;