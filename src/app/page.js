import Header from './components/layout/Header'
import Hero from './components/home/Hero'
import Categories from './components/home/Categories'
import PopularBakers from './components/home/PopularBakers'
import RecommendedProducts from './components/home/RecommendedProducts'
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