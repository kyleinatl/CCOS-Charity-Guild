'use client';

export default function SponsorPage() {
  const sponsorLogos = [
    { name: 'Diane Johnson', image: '/diane-johnson.png' },
    { name: 'Aesthetic Center', image: '/aesthetic-center.png' },
    { name: 'Kayc Carper', image: '/kayc-carper.avif' },
    { name: 'MIBAB', image: '/mibab.png' },
    { name: 'Mighty Dog', image: '/mighty-dog.png' },
    { name: 'Grapes and Grains', image: '/grapes-and-grains.png' },
    { name: 'Champions Community Foundation', image: '/partners/champions-community-foundation.jpg' },
    { name: 'Shine the Light', image: '/partners/shine-the-light.jpg' },
    { name: '1 Cure', image: '/partners/one-cure.jpg' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-sky-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
                  Country Club of the South
                </h1>
                <p className="text-sm text-blue-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <a
              href="/"
              className="text-blue-700 hover:text-sky-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-blue-50"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Page Title */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-4">
            Become a Sponsor
          </h2>
          <p className="text-blue-700 text-sm sm:text-base max-w-3xl mx-auto">
            Business sponsors cover operating expenses so donations from patrons and members go directly to the chosen charities.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6 overflow-hidden">
          <img
            src="/sponsorship/sponsorship-hero.jpg"
            alt="Sponsorship presentation"
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Introduction Text */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100 mb-8">
          <p className="text-lg text-blue-800 leading-relaxed mb-6">
            Business Sponsors serve a vital role in the success of the Country Club of the South Charity Guild as the funds raised from Sponsors cover <span className="font-bold">ALL operating expenses</span> (printing, postage, accounting, insurance, software subscription fees, etc.) so that all donations raised from our Patrons and Members will go to the direct benefit of the chosen charities.
          </p>
          <p className="text-lg text-blue-800 leading-relaxed mb-6">
            For more information on becoming a Sponsor, please contact <span className="font-semibold">Kayc Carper 404-626-1143</span>.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100 mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">This year&apos;s sponsors will have expanded promotional opportunities through:</h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 text-xl">•</span>
              <span className="text-lg text-blue-800">Exciting membership events in April, November and next January</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 text-xl">•</span>
              <span className="text-lg text-blue-800">Monthly electronic and print communications</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 text-xl">•</span>
              <span className="text-lg text-blue-800">Continuous website presence</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-3 text-xl">•</span>
              <span className="text-lg text-blue-800">Customized promotions to unique set of high-worth individuals</span>
            </li>
          </ul>
          <p className="text-lg text-blue-800 font-semibold mb-8">
            The sooner you sponsor, the more promotional time you will receive!
          </p>
          <p className="text-lg text-blue-800 mb-6">
            To participate in this year&apos;s program as a sponsor, please review our sponsorship level presentation to select a sponsorship level.
          </p>
          <p className="text-lg text-blue-800 mb-8">
            We look forward to learning about your sponsorship interest and working together for an impactful 2026.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/files/sponsorship-overview-2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-600 to-sky-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
            >
              Review the Sponsorship Presentation
            </a>
            <a
              href="#sponsorship-levels"
              className="inline-block bg-gradient-to-r from-[#e5c366] to-[#d4b356] text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-[#d4b356] hover:to-[#c4a346] transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
            >
              Click here to Sponsor.
            </a>
          </div>
        </div>

        {/* Current Sponsors */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100 mb-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Current Sponsors & Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {sponsorLogos.map((sponsor) => (
              <div
                key={sponsor.name}
                className="bg-white rounded-xl shadow-sm border border-blue-100 p-5 flex items-center justify-center"
              >
                <img
                  src={sponsor.image}
                  alt={`${sponsor.name} logo`}
                  className="w-full h-auto object-contain max-h-28"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Sponsorship Levels */}
        <div id="sponsorship-levels" className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-blue-100">
          <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">Sponsorship Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#e5c366] to-[#d4b356] rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Presenting Sponsor</h4>
              <p className="text-3xl font-bold text-white">$5,000+</p>
            </div>
            <div className="bg-gradient-to-br from-[#e5c366] to-[#e5c366] rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Gold Sponsor</h4>
              <p className="text-3xl font-bold text-white">$5,000</p>
            </div>
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Silver Sponsor</h4>
              <p className="text-3xl font-bold text-white">$2,500</p>
            </div>
            <div className="bg-gradient-to-br from-[#c4a346] to-[#b39336] rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Bronze Sponsor</h4>
              <p className="text-3xl font-bold text-white">$1,000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
