// src/app/layout.js
import './globals.css'
import { CartProvider } from './components/context/CartContext'
import { ToastProvider } from './components/context/ToastContext'
import { FavoritesProvider } from './components/context/FavoritesContext'
import Toast from './components/common/Toast'

export const metadata = {
  title: 'ВкусноДом - Домашняя еда от локальных пекарей',
  description: 'Заказывайте домашнюю выпечку, торты и десерты у проверенных пекарей вашего города',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="font-body bg-bakery-50 text-bakery-1100 flex flex-col min-h-screen">
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider> {/* ← ДОБАВЛЕНО */}
              <div className="flex-1 flex flex-col">
                {children}
              </div>
              <Toast />
            </FavoritesProvider> {/* ← ДОБАВЛЕНО */}
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}