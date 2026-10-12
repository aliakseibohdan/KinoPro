export default function PrivacyPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          <i className="fa-solid fa-lock mr-2" aria-hidden="true"></i>
          Политика конфиденциальности
        </h1>

        <div className="text-white/90 leading-relaxed space-y-4">

          <p>
            Настоящая Политика конфиденциальности описывает, как сайт KinoPro использует и защищает данные пользователей. 
            Используя сайт, вы подтверждаете согласие с данной политикой.
          </p>

          {/* 1 */}
          <h2 className="text-xl font-semibold mt-6">1. Как мы используем данные</h2>
          <p>
            Ваши данные используются исключительно для авторизации, восстановления доступа, улучшения работы сервиса 
            и защиты от злоупотреблений. Мы не продаём и не передаём ваши данные третьим лицам.
          </p>

          {/* 2 */}
          <h2 className="text-xl font-semibold mt-6">2. Хранение и защита данных</h2>
          <p>
            Мы применяем современные методы защиты: шифрование паролей (bcrypt), HTTPS, ограничение доступа к базе данных 
            и защиту от XSS/SQL‑инъекций. Ваши данные хранятся только на сервере KinoPro.
          </p>

          {/* 3 */}
          <h2 className="text-xl font-semibold mt-6">3. Cookies</h2>
          <p>
            Cookies используются для авторизации, работы фильтров и улучшения интерфейса. Они не содержат личных данных.
          </p>

          {/* 4 */}
          <h2 className="text-xl font-semibold mt-6">4. Удаление данных</h2>
          <p>
            Вы можете запросить удаление аккаунта. После удаления данные восстановить невозможно: 
            email, история просмотров и избранное будут полностью удалены.
          </p>

          {/* 5 */}
          <h2 className="text-xl font-semibold mt-6">5. Сторонние сервисы</h2>
          <p>
            KinoPro использует TMDB API для получения информации о фильмах. Личные данные пользователей не передаются 
            сторонним сервисам.
          </p>

          {/* 6 */}
          <h2 className="text-xl font-semibold mt-6">6. Изменения политики</h2>
          <p>
            Мы можем обновлять политику. Продолжая пользоваться сайтом, вы соглашаетесь с обновлениями.
          </p>

          {/* 7 */}
          <h2 className="text-xl font-semibold mt-6">7. Контакты</h2>
          <p>
            По вопросам конфиденциальности вы можете обратиться через раздел «Администрация сайта».
          </p>

          <p className="opacity-70 mt-6 text-center">
            Последнее обновление: {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
