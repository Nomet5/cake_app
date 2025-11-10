// app/admin/orders/create/page.jsx
'use client'

import { useRouter } from 'next/navigation'
import CreateOrderForm from '../components/create-order-form'

export default function CreateOrderPage() {
  const router = useRouter()

  const handleBack = () => {
    router.push('/admin/orders')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <CreateOrderForm onBack={handleBack} />
      </div>
    </div>
  )
}