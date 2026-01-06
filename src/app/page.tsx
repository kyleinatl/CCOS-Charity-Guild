'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [otherMenuOpen, setOtherMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
        setOtherMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100 animate-fadeIn">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 min-w-0">
              <img 
                src="/logo.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-8 sm:h-10 lg:h-12 w-auto flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent truncate">
                  Country Club of the South
                </h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-green-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0" ref={menuRef}>
              <a
                href="/donate"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-base font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Join/Donate
              </a>
              <a
                href="/sponsor"
                className="hidden sm:inline-block bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-base font-medium hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Sponsor
              </a>
              
              {/* Hamburger Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-green-50 transition-colors flex-shrink-0"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-green-700"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-4 sm:right-6 lg:right-8 top-20 sm:top-24 bg-white rounded-xl shadow-2xl border border-green-100 py-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
              <a
                href="/"
                className="block px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '/')}
              >
                Home
              </a>
              <a
                href="#how-we-operate"
                className="block px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '#how-we-operate')}
              >
                How We Operate
              </a>
              <a
                href="#our-impact"
                className="block px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '#our-impact')}
              >
                Our Impact
              </a>
              <a
                href="/donate"
                className="block px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Become a Member
              </a>
              
              {/* Other submenu */}
              <div className="relative">
                <button
                  onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                  className="w-full text-left px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium flex items-center justify-between"
                >
                  Other
                  <svg
                    className={`w-4 h-4 transition-transform ${otherMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {otherMenuOpen && (
                  <div className="bg-green-50/50">
                    <a
                      href="#heart-to-heart"
                      className="block px-8 py-2 text-green-600 hover:bg-green-100 transition-colors"
                      onClick={(e) => handleNavigation(e, '#heart-to-heart')}
                    >
                      Heart to Heart
                    </a>
                    <a
                      href="#gallery"
                      className="block px-8 py-2 text-green-600 hover:bg-green-100 transition-colors"
                      onClick={(e) => handleNavigation(e, '#gallery')}
                    >
                      Gallery
                    </a>
                    <a
                      href="/sponsor"
                      className="block px-8 py-2 text-green-600 hover:bg-green-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Become a Sponsor
                    </a>
                    <a
                      href="/donor-list"
                      className="block px-8 py-2 text-green-600 hover:bg-green-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Donor List
                    </a>
                  </div>
                )}
              </div>
              
              <a
                href="/contact"
                className="block px-6 py-3 text-green-700 hover:bg-green-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-green-200 mb-6 sm:mb-8">
            <span className="text-green-700 font-semibold text-xs sm:text-sm">🏆 100% Volunteer-Based • Supporting Atlanta Non-Profits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
            <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 bg-clip-text text-transparent">
              Country Club of the South
            </span>
            <span className="block text-2xl sm:text-3xl md:text-4xl text-amber-600 font-light mt-2">Charity Guild</span>
          </h2>
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-2">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-800 mb-4 sm:mb-6">Our Mission</h3>
            <p className="text-base sm:text-lg lg:text-xl text-green-700 leading-relaxed mb-6 sm:mb-8">
              The mission of the Country Club of the South Charity Guild is to support Atlanta area non-profits. 
              Our 100% volunteer-based group is dedicated to raising funds and awarding grants to improve the 
              quality of life for those in our community facing hardship.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <a
              href="/donate"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
            >
              Join/Donate
            </a>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 sm:mt-16 px-4">
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-amber-700/30">
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-green-700 text-sm sm:text-base font-semibold mb-2">Year Established</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">1988</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-green-700 text-sm sm:text-base font-semibold mb-2">Charities Funded</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">86</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-green-700 text-sm sm:text-base font-semibold mb-2">Money Donated</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">$6 Million</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-green-700 text-sm sm:text-base font-semibold mb-2">Number of Paid Employees</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Sponsors Section */}
          <div className="mt-12 sm:mt-16 px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Our Sponsors
              </h3>
              <p className="text-green-700 mt-3 text-base sm:text-lg">
                Thank you to our generous business sponsors who make our work possible
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/diane-johnson.png" 
                  alt="Diane Johnson Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/aesthetic-center.png" 
                  alt="Aesthetic Center Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/kayc-carper.avif" 
                  alt="Kayc Carper Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/mibab.png" 
                  alt="MIBAB Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/mighty-dog.png" 
                  alt="Mighty Dog Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-green-100 flex items-center justify-center">
                <img 
                  src="/grapes-and-grains.png" 
                  alt="Grapes and Grains Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
            </div>
          </div>
        </div>

        {/* How We Operate Section */}
        <section id="how-we-operate" className="mb-12 sm:mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-green-100">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                How We Operate
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-green-700 max-w-4xl mx-auto leading-relaxed px-2">
                Charities submit grant applications annually in November. Using a well-established vetting process, 
                members vote on which of these charities will be the focus of our fundraising the following year. 
                Voting for the large and small grants typically occurs in January.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-green-800 mb-2">November</h4>
                <p className="text-green-600">Charities submit their grant applications for consideration</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-green-800 mb-2">Vetting Process</h4>
                <p className="text-green-600">Well-established process to evaluate and select worthy causes</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-green-800 mb-2">January</h4>
                <p className="text-green-600">Members vote on large and small grant recipients</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section id="get-involved" className="mb-20">
          <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 rounded-3xl p-12 shadow-2xl text-white">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-6">Get Involved</h3>
              <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
                CCOS Charity Guild welcomes all volunteers who wish to impact our community by sharing their 
                skills, talents and energy. Opportunities are varied and any amount of time and effort will make a difference.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-14 h-14 bg-amber-400 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4">Board Support</h4>
                <p className="text-green-100">
                  Volunteer your time to assist our Board with fundraising and membership events. 
                  Help organize galas, coordinate volunteers, and support our administrative efforts.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-14 h-14 bg-yellow-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-4">Hands-On Service</h4>
                <p className="text-green-100">
                  Choose to do hands-on work with our current grant recipients. Get directly involved 
                  with the charities we support and see your impact firsthand.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-green-100">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
            About Us
          </h3>
          <p className="text-xl text-green-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            The Country Club of the South Charity Guild represents the philanthropic heart of our distinguished 
            community. Since our establishment, we have maintained a steadfast commitment to supporting Atlanta 
            area non-profits through our 100% volunteer-based approach to fundraising and grant distribution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Volunteer-Based</h4>
              <p className="text-green-600">Every member contributes their time and talent to our mission</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Atlanta Focus</h4>
              <p className="text-green-600">Dedicated to supporting local non-profits in our community</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Quality Impact</h4>
              <p className="text-green-600">Improving quality of life for those facing hardship</p>
            </div>
          </div>
        </div>

        {/* Heart to Heart Section */}
        <section id="heart-to-heart" className="mb-12 sm:mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-green-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
                Heart to Heart
              </h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-base sm:text-lg text-green-700 leading-relaxed mb-6">
                  Do you know someone who has experienced illness, surgery, or death within their family? 
                  The Charity Guild is here to help! Heart to Heart was established to bring sunshine to 
                  those in need within our community.
                </p>
                <p className="text-base sm:text-lg text-green-700 leading-relaxed mb-8">
                  Click the link below to contact our Heart to Heart program volunteer, Andee Blauser, for more information.
                </p>
                <a
                  href="mailto:heart-to-heart@charityguild.org"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  heart-to-heart@charityguild.org
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="mb-12 sm:mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              Gallery
            </h3>
            <p className="text-green-700 text-base sm:text-lg">
              Moments from our fundraising events and community impact
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder images - will be replaced with actual photos */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-green-100">
                <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-900 text-green-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
                </svg>
              </div>
              <h4 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Country Club of the South
              </h4>
            </div>
            <p className="text-green-300 mb-4">Charity Guild • Established 1988</p>
            <p className="text-green-400">&copy; 2025 Country Club of the South Charity Guild. All rights reserved.</p>
            <p className="text-green-500 text-sm mt-2">Proudly serving the Atlanta community for over three decades</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
