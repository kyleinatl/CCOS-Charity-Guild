'use client';

import Image from 'next/image';

export default function GrantRecipientsPage() {
  const grantRecipients = [
    { name: 'Autrey Mill', logo: '/autrey-mill.avif', alt: 'Autrey Mill Logo' },
    { name: 'Home Repairs Ministries', logo: '/home-repairs-ministries.avif', alt: 'Home Repairs Ministries Logo' },
    { name: 'Thrive Community', logo: '/thrive-community.avif', alt: 'Thrive Community Logo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-8 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300 shadow-md"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4">
            Grant Recipients
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Organizations supported by the Cobb County Charity Guild through our grant program
          </p>
        </div>

        {/* Grant Recipients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {grantRecipients.map((recipient, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-green-200 hover:border-green-500 transform hover:-translate-y-2"
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
