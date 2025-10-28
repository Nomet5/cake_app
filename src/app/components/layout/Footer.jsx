const Footer = () => {
    return (
        <footer className="bg-bakery-1150 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Лого и описание */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                        
                            <span className="text-xl font-bold font-display">ВкусноДом</span>
                        </div>
                        <p className="text-bakery-200 text-sm leading-relaxed max-w-md">
                            Платформа для заказа домашней еды и кондитерских изделий у локальных пекарей.
                            Наслаждайтесь настоящим вкусом, приготовленным с душой.
                        </p>
                    </div>

                    {/* Навигация */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 font-display">Навигация</h3>
                        <ul className="space-y-2">
                            <li><a href="/catalog" className="text-bakery-200 hover:text-white transition-colors text-sm">Каталог</a></li>
                            <li><a href="/bakers" className="text-bakery-200 hover:text-white transition-colors text-sm">Пекари</a></li>
                            <li><a href="/about" className="text-bakery-200 hover:text-white transition-colors text-sm">О нас</a></li>
                            <li><a href="/contacts" className="text-bakery-200 hover:text-white transition-colors text-sm">Контакты</a></li>
                        </ul>
                    </div>

                    {/* Помощь */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 font-display">Помощь</h3>
                        <ul className="space-y-2">
                            <li><a href="/delivery" className="text-bakery-200 hover:text-white transition-colors text-sm">Доставка</a></li>
                            <li><a href="/payment" className="text-bakery-200 hover:text-white transition-colors text-sm">Оплата</a></li>
                            <li><a href="/faq" className="text-bakery-200 hover:text-white transition-colors text-sm">FAQ</a></li>
                            <li><a href="/support" className="text-bakery-200 hover:text-white transition-colors text-sm">Поддержка</a></li>
                        </ul>
                    </div>

                </div>

                {/* Нижняя часть */}
                <div className="border-t border-bakery-1000 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="text-bakery-300 text-sm mb-4 md:mb-0">
                        © 2025 ВкусноДом. Все права защищены.
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-bakery-300 hover:text-white transition-colors text-sm">Политика конфиденциальности</a>
                        <a href="#" className="text-bakery-300 hover:text-white transition-colors text-sm">Условия использования</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer