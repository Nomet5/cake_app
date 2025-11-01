// app/admin/products/[id]/edit/page.js
import { getProductById } from "../../../../../lib/actions/product.actions"
import { notFound } from 'next/navigation'
import EditProductForm from "../components/edit-product-form"

export default async function EditProductPage({ params }) {
  const result = await getProductById(parseInt(params.id))

  if (result.error || !result.success) {
    notFound()
  }

  return (
    <div className="p-6 animate-fade-in">
      <EditProductForm product={result.product} />
    </div>
  )
}