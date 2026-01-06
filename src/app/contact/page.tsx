'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setMenuOpen(false);
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      setMenuOpen(false);
    }
  };

  const boardMembers = [
    { title: 'Co-President', names: ['Ruchi Dave', 'Kristin Golub'] },
    { title: 'Secretary', names: ['Mary Lyn Kurish'] },
    { title: 'Treasurer', names: ['Geri Eubanks'] },
    { title: 'Co-VP Membership & Patrons', names: ['Kat Anderson', 'Nicole Vereen'] },
    { title: 'VP Communication', names: ['Megan Ross'] },
    { title: 'VPs Event Fundraising', names: ['Stacey Ramani', 'Leslie Wilks', 'Jennifer Passilla', 'Cathy Suleiman'] },
    { title: 'VPs Technology', names: ['Jennifer Gabriel', 'Kyle McGinley'] },
    { title: 'VP Sponsorship', names: ['Kayc Carper'] },
    { title: 'Co-VP Charities', names: ['Sissy Luciani', 'Marcy Hirshberg'] },
    { title: 'Co-VP Junior Charity Guild', names: ['Gol Kimbrell', 'Dee Vallee'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100 animate-fadeIn">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src="/logo.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-10 sm:h-12 w-auto"
              />
              <div>
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Country Club of the South
                </h1>
                <p className="text-xs sm:text-sm text-green-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <a
              href="/"
              className="text-green-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
            >
              Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Contact
          </h2>
        </div>

        {/* Inquiries Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <h3 className="text-2xl font-bold text-green-900 mb-4">Inquiries</h3>
          <p className="text-lg text-green-800 mb-6">
            Please contact us with any questions or comments by filling out the form below or by clicking on a Board Member's name
          </p>

          {/* Contact Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-green-900 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-green-900 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-green-900 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-green-900 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Subject"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-green-900 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Executive Board */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <h3 className="text-2xl font-bold text-green-900 mb-6">Executive Board</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {boardMembers.map((member, index) => (
              <div key={index} className="border-l-4 border-green-600 pl-4">
                <h4 className="font-semibold text-green-900 mb-2">{member.title}</h4>
                <div className="space-y-1">
                  {member.names.map((name, nameIndex) => (
                    <p key={nameIndex} className="text-green-700">
                      {name}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
