import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const StateContext = ({ children }) => {

    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [qty, setQty] = useState(1);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const increaseQty = () => {
        setQty((current) => current + 1);
    }

    const decreaseQty = () => {
        setQty((current) => {
            if (current - 1 < 1) return 1;
            return current - 1;
        });
    }

    const onAdd = (product, quantity) => {
        // Increase total price
        setTotalPrice(current => current + product.price * quantity);
        // Increase total quantity
        setTotalQuantities(current => current + quantity);
        // CHeck if product is already on cart
        const exist = cartItems.find(item => item.slug === product.slug);
        if (exist) {
            setCartItems(cartItems.map((item) => 
                item.slug === product.slug 
                ? {...exist, quantity: exist.quantity + quantity}
                : item
                )
            )
        } else {
            setCartItems([...cartItems, {...product, quantity: quantity}]);
        }
    }

    const onRemove = (product) => {
        // Total price
        setTotalPrice(current => current - product.price);
        // Decrease total quantity
        setTotalQuantities(current => current - 1);
        // Check if product is already on the cart
        const exist = cartItems.find(item => item.slug === product.slug);
        if (exist.quantity === 1) {
            setCartItems(cartItems.filter(item => item.slug !== product.slug));
        } else {
            setCartItems(cartItems.map(item => item.slug === product.slug ? {...exist, quantity: exist.quantity - 1} : item))
        }
    } 

    return (
        <ShopContext.Provider 
            value={{ 
                qty, 
                increaseQty, 
                decreaseQty, 
                showCart, 
                setShowCart, 
                cartItems, 
                onAdd, 
                onRemove, 
                totalQuantities,
                totalPrice,
                setQty
                }}
            >
            { children }
        </ShopContext.Provider>
    )
}

export default ShopContext;

export const useStateContext = () => useContext(ShopContext);