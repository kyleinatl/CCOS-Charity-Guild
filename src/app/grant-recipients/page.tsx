'use client';

import Image from 'next/image';

export default function GrantRecipientsPage() {
  const grantRecipients = [
    { name: 'Autrey Mill', logo: '/autrey-mill.avif', alt: 'Autrey Mill Logo' },
    { name: 'Home Repairs Ministries', logo: '/home-repairs-ministries.avif', alt: 'Home Repairs Ministries Logo' },
    { name: 'Thrive Community', logo: '/thrive-community.avif', alt: 'Thrive Community Logo' },
    { name: 'Wellspring Living', logo: '/wellspring-living.avif', alt: 'Wellspring Living Logo' },
    { name: 'Family Promise', logo: 'https://static.wixstatic.com/media/a80fd7_0a5eee0afce1481c93b47aa99fe412ed~mv2.jpg/v1/fill/w_390,h_104,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Family%20Promise.jpg', alt: 'Family Promise Logo' },
    { name: 'Angels Among Us', logo: 'https://static.wixstatic.com/media/a80fd7_b961059dafcc49a1b89384035809940c~mv2.jpg/v1/fill/w_200,h_124,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/Angels%20Among%20Us%20Logo%20Half%20Rez.jpg', alt: 'Angels Among Us Logo' },
    { name: 'Hire Heroes USA', logo: 'https://static.wixstatic.com/media/a80fd7_d97dd976bddf42189484d15c58070880~mv2.jpg/v1/fill/w_174,h_144,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/HireHeroesUSA_logo_Vert_4C.jpg', alt: 'Hire Heroes USA Logo' },
    { name: 'Children\'s Development Academy', logo: 'https://static.wixstatic.com/media/a80fd7_4dd87b9c6d3149a1a34ad0e645068c98~mv2.png/v1/fill/w_126,h_124,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ACDS%20logo%20round%202wht%20bkg.png', alt: 'Children\'s Development Academy Logo' },
    { name: 'Atlanta CASA', logo: 'https://static.wixstatic.com/media/a80fd7_63d23cb80905494bb2289af3fc0d2a3b~mv2.png/v1/fill/w_188,h_184,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/ATLANTA_v_RedBlue%20Wht%20bkg.png', alt: 'Atlanta CASA Logo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-4">
            Grant Recipients
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Organizations supported by the Country Club of the South Charity Guild through our grant program
          </p>
        </div>

        {/* Grant Recipients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {grantRecipients.map((recipient, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-blue-200 hover:border-blue-500 transform hover:-translate-y-2"
            >
              <div className="relative w-full h-40 mb-4 flex items-center justify-center">
                <Image
                  src={recipient.logo}
                  alt={recipient.alt}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-800">
                {recipient.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
