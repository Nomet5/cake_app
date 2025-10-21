import './globals.css'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import Toast from './components/ui/Toast'

export const metadata = {
  title: 'BakeHub - Домашняя еда от локальных пекарей',
  description: 'Заказывайте домашнюю выпечку, торты и десерты у проверенных пекарей вашего города',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="font-body bg-bakery-50 text-bakery-1100">
        <ToastProvider>
          <CartProvider>
            {children}
            <Toast />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  )
}