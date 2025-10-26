// src/app/layout.js
import './globals.css'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { FavoritesProvider } from './context/FavoritesContext'
import Toast from './components/ui/Toast'

export const metadata = {
  title: 'BakeHub - Домашняя еда от локальных пекарей',
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