const hopeAwardsImages = [
  '3BB03035-7ADC-4C5D-BC4A-52029223CC9A_1_105_c.jpeg',
  '4DD64C75-96CB-403B-BCE7-5CF03C26CAE8_1_105_c.jpeg',
  'A5EEF7FB-266D-4470-8835-5D6B22A0855C_4_5005_c.jpeg',
  'A9DB46CC-87B4-411D-9EB3-32716E801EF7_4_5005_c.jpeg',
  'BF89B2FE-9889-49ED-BBDE-B38B26DD34DA_4_5005_c.jpeg',
  'DADC79AD-A12F-437B-9AC8-08F7C923FFE8_4_5005_c.jpeg',
  'DBA40F1C-EF73-4639-B095-AEE6D306BC07_4_5005_c.jpeg',
];

export default function HopeAwards2026Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-sky-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <a
            href="/"
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            <span aria-hidden="true" className="mr-2">←</span>
            Back to Home
          </a>
        </div>

        <header className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
            Hope Awards 2026
          </h1>
          <p className="mt-3 text-blue-700 text-base sm:text-lg">
            Event photo gallery
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {hopeAwardsImages.map((imageName) => (
            <div
              key={imageName}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100 p-2"
            >
              <img
                src={`/events/hope-awards-2026/${imageName}`}
                alt="Hope Awards 2026"
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
