export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center font-bold">
                K
              </div>
              <span className="font-bold">KinoPro</span>
            </div>
            <p className="text-gray-400 text-sm">
              Лучший сервис для просмотра фильмов и сериалов онлайн
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Главная</a></li>
              <li><a href="/films" className="hover:text-white transition-colors">Фильмы</a></li>
              <li><a href="/tv" className="hover:text-white transition-colors">Сериалы</a></li>
              <li><a href="/favorites" className="hover:text-white transition-colors">Избранное</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Поддержка</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Контакты</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Оставить отзыв</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Справка</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4">Правовая информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
             <li><a href="/terms" className="hover:text-white transition-colors">Условия использования</a></li>
             <li><a href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</a></li>
              <li><a href="/advertising" className="hover:text-white transition-colors">Рекламодателям</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 KinoPro</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
