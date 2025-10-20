import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import Categories from './components/sections/Categories'
import PopularBakers from './components/sections/PopularBakers'
import RecommendedProducts from './components/sections/RecommendedProducts'
import Footer from './components/layout/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-bakery-50">
      <Header />
      <main>
        <Hero />
        <Categories />
        <PopularBakers />
        <RecommendedProducts />
      </main>
      <Footer />
    </div>
  )
}