// components/CreateChefModal.js
'use client'

import CreateChefForm from './CreateChefForm'

export default function CreateChefModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Добавить повара</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <CreateChefForm onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  )
}