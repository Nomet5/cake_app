'use client'

import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])

    // Добавление товара в корзину
    const addToCart = (product, personalization = null) => {
        setCartItems(prev => {
            const existingItem = prev.find(item =>
                item.id === product.id &&
                item.personalization?.description === personalization?.description
            )

            if (existingItem) {
                return prev.map(item =>
                    item.id === product.id &&
                        item.personalization?.description === personalization?.description
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }

            return [...prev, {
                ...product,
                quantity: 1,
                personalization: personalization || null,
                personalizationPrice: personalization?.price || 0
            }]
        })
    }

    // Удаление товара из корзины
    const removeFromCart = (productId, personalizationDescription = null) => {
        setCartItems(prev =>
            prev.filter(item =>
                !(item.id === productId &&
                    item.personalization?.description === personalizationDescription)
            )
        )
    }

    // Изменение количества
    const updateQuantity = (productId, personalizationDescription, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId, personalizationDescription)
            return
        }

        setCartItems(prev =>
            prev.map(item =>
                item.id === productId &&
                    item.personalization?.description === personalizationDescription
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        )
    }

    // Очистка корзины
    const clearCart = () => {
        setCartItems([])
    }

    // Расчет общей стоимости
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price + (item.personalizationPrice || 0)) * item.quantity
        }, 0)
    }

    // Количество товаров в корзине
    const getCartItemsCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0)
    }

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}