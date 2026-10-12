export default function Features() {
  const features = [
    {
      icon: 'fa-solid fa-clapperboard',
      title: 'Огромная библиотека',
      description: 'Более 100 000 фильмов и сериалов на любой вкус',
    },
    {
      icon: 'fa-solid fa-bolt',
      title: 'Высокое качество',
      description: 'Смотрите в 4K и Full HD без буферизации',
    },
    {
      icon: 'fa-solid fa-mobile-screen-button',
      title: 'Все устройства',
      description: 'Смотрите на телефоне, планшете или ТВ',
    },
    {
      icon: 'fa-solid fa-users',
      title: 'Бесплатно',
      description: '24/7',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
            Почему выбирают KinoPro?
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6"
            >
              <div className="text-4xl mb-4 text-red-500">
                <i className={feature.icon} aria-hidden="true"></i>
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}