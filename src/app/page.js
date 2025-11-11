import Header from './components/layout/Header'
import Hero from './components/home/Hero'
import Categories from './components/home/Categories'
import PopularBakers from './components/home/PopularBakers'
import RecommendedProducts from './components/home/RecommendedProducts'
import Footer from './components/layout/Footer'

// Функция для получения данных главной страницы
async function getHomeData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/home`, {
      next: { revalidate: 60 } // Кешируем на 60 секунд
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных')
    }

    const data = await response.json()

    if (data.success) {
      return data.data
    } else {
      console.error('API Error:', data.error)
      return {
        popularBakers: [],
        newProducts: [],
        categories: []
      }
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      popularBakers: [],
      newProducts: [],
      categories: []
    }
  }
}

export default async function Home() {
  // Загружаем данные на сервере
  const homeData = await getHomeData()

  return (
    <div className="min-h-screen bg-bakery-50">
      <Header />
      <main>
        <Hero />
        <Categories categories={homeData.categories} />
        <PopularBakers bakers={homeData.popularBakers} />
        <RecommendedProducts products={homeData.newProducts} />
      </main>
      <Footer />
    </div>
  )
}