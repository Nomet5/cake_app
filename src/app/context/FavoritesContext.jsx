// src/app/components/context/FavoritesContext.jsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState([]);

    // Загрузка избранного из localStorage при монтировании
    useEffect(() => {
        const savedFavorites = localStorage.getItem('bakehub-favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (error) {
                console.error('Error loading favorites:', error);
                setFavorites([]);
            }
        }
    }, []);

    // Сохранение в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('bakehub-favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (productId) => {
        setFavorites(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const isFavorite = (productId) => favorites.includes(productId);

    const value = {
        favorites,
        toggleFavorite,
        isFavorite,
        favoritesCount: favorites.length
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within FavoritesProvider');
    }
    return context;
};