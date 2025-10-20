// components/Header.tsx
'use client'
import Link from "next/link"
import Search from "./search"

export default function Header() {

  return (
    <>
     <header className="bg-bakery-white shadow-bakery-soft sticky top-0 z-50 border-b border-primary-100">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="flex items-center justify-center w-10 h-10 bg-apricot-gradient rounded-xl shadow-bakery-medium transform group-hover:scale-105 transition-transform duration-300">
                            <span className="text-bakery-white font-bold text-lg">BK</span>
                            </div>
                            <div className="hidden sm:block">
                            <h1 className="text-responsive-xl font-display font-bold text-primary-700">
                                BakeCraft
                            </h1>
                            <p className="text-responsive-sm text-primary-600 font-medium">
                                пекарни вашего города
                            </p>
                        </div>
                    </Link>
                </div>

                <Search></Search>
            </div>
        </div>
     </header>
    </>
  )
}