'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SearchBar = ({ autoFocus = false }) => {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e) => {
        e.preventDefault()
        if (query.trim()) {
            // Перенаправляем на страницу каталога с поисковым запросом
            router.push(`/catalog?search=${encodeURIComponent(query.trim())}`)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e)
        }
    }

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch}>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Поиск блюд или пекарей..."
                        className="w-full pl-4 pr-10 py-3 border border-bakery-200 rounded-xl focus:ring-2 focus:ring-bakery-400 focus:border-transparent transition-all bg-bakery-50 font-body text-bakery-1100 placeholder-bakery-1050"
                        autoFocus={autoFocus}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <button
                            type="submit"
                            className="p-1 text-bakery-1050 hover:text-bakery-500 transition-colors"
                        >
                            🔍
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SearchBar