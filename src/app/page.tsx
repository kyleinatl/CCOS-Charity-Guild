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

  const featuredEvents = [
    {
      title: 'Hope Awards 2026',
      dateLocation: '2026 Event Gallery',
      description: 'View highlights from the Hope Awards 2026 event.',
      image: '/events/hope-awards-2026/3BB03035-7ADC-4C5D-BC4A-52029223CC9A_1_105_c.jpeg',
      href: '/events/hope-awards-2026',
    },
    {
      title: 'Hope for the Holidays',
      dateLocation: 'Seasonal Fundraiser',
      description: 'Community celebration and fundraising event details coming soon.',
      image: null,
      href: null,
    },
    {
      title: 'Spring Member Social',
      dateLocation: 'Member Engagement Event',
      description: 'An evening to connect, celebrate impact, and support local charities.',
      image: null,
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-sky-100 animate-fadeIn">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 lg:py-6">
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 min-w-0">
              <img 
                src="/ccos-logo-transparent.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-10 sm:h-12 lg:h-16 w-auto flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-xs sm:text-base lg:text-xl xl:text-2xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent truncate">
                  Country Club of the South
                </h1>
                <p className="text-[10px] sm:text-xs lg:text-sm text-blue-600 font-medium">Charity Guild</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
              <a
                href="/donate"
                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-base font-medium hover:from-blue-700 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Join/Donate
              </a>
              <a
                href="/sponsor"
                className="bg-[#e5c366] text-white px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs lg:text-base font-medium hover:bg-[#d4b356] transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Sponsor
              </a>
              
              {/* Hamburger Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6 text-blue-700"
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
                    <path d="M12 4v16M4 12h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div ref={menuRef} className="absolute right-4 sm:right-6 lg:right-8 top-20 sm:top-24 bg-white rounded-xl shadow-2xl border border-blue-100 py-2 min-w-[200px] max-h-[calc(100vh-6rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
              <a
                href="/"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '/')}
              >
                Home
              </a>
              <a
                href="#who-we-serve"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '#who-we-serve')}
              >
                Who We Serve
              </a>
              <a
                href="#how-we-operate"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '#how-we-operate')}
              >
                How We Operate
              </a>
              <a
                href="#our-impact"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={(e) => handleNavigation(e, '#our-impact')}
              >
                Our Impact
              </a>
              <a
                href="/donate"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Become a Member
              </a>
              
              {/* Member Resources - Password Protected */}
              <div className="border-t border-blue-100 mt-2 pt-2">
                <a
                  href="/auth/login"
                  className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Member Login
                </a>
                <a
                  href="/portal"
                  className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Member Portal
                </a>
                <a
                  href="/portal/resources"
                  className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium flex items-center"
                  onClick={() => setMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Member Resources
                </a>
              </div>
              
              {/* Other submenu */}
              <div className="relative border-t border-blue-100 mt-2 pt-2">
                <button
                  onClick={() => setOtherMenuOpen(!otherMenuOpen)}
                  className="w-full text-left px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium flex items-center justify-between"
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
                  <div className="bg-blue-50/50">
                    <a
                      href="#heart-to-heart"
                      className="block px-8 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={(e) => handleNavigation(e, '#heart-to-heart')}
                    >
                      Heart to Heart
                    </a>
                    <a
                      href="#gallery"
                      className="block px-8 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={(e) => handleNavigation(e, '#gallery')}
                    >
                      Gallery
                    </a>
                    <a
                      href="/sponsor"
                      className="block px-8 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Become a Sponsor
                    </a>
                    <a
                      href="/grant-recipients"
                      className="block px-8 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Grant Recipients
                    </a>
                    <a
                      href="/donor-list"
                      className="block px-8 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                      onClick={() => setMenuOpen(false)}
                    >
                      Donor List
                    </a>
                  </div>
                )}
              </div>
              
              <a
                href="/contact"
                className="block px-6 py-3 text-blue-700 hover:bg-blue-50 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-cover bg-center" style={{backgroundImage: "url('/2026-small-grant-recipients-hero.png')"}}>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-md px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-white/30 mb-6 sm:mb-8">
              <span className="text-white font-semibold text-xs sm:text-sm drop-shadow-lg">🏆 100% Volunteer-Based • Supporting Atlanta Non-Profits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8">
              <span className="text-white drop-shadow-2xl">
                Country Club of the South
              </span>
              <span className="block text-2xl sm:text-3xl md:text-4xl text-[#e5c366] font-light mt-2 drop-shadow-lg">Charity Guild</span>
            </h2>
            <div className="flex justify-center mb-8 sm:mb-10">
              <img 
                src="/ccos-logo-transparent.png" 
                alt="CCOS Logo" 
                className="h-16 sm:h-20 w-auto drop-shadow-2xl"
              />
            </div>
            <div className="max-w-4xl mx-auto mb-8 sm:mb-12 px-2">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 drop-shadow-lg">Our Mission</h3>
              <p className="text-base sm:text-lg lg:text-xl text-white/95 leading-relaxed mb-6 sm:mb-8 drop-shadow-lg">
                The mission of the Country Club of the South Charity Guild is to support Atlanta area non-profits. 
                Our 100% volunteer-based group is dedicated to raising funds and awarding grants to improve the 
                quality of life for those in our community facing hardship.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
              <a
                href="/donate"
                className="bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-sky-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
              >
                Join/Donate
              </a>
              <a
                href="/sponsor"
                className="bg-[#e5c366] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold hover:bg-[#d4b356] transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-center"
              >
                Become a Sponsor
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Below Hero */}
      <main className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
          {/* Stats Bar */}
          <div className="px-4">
            <div className="bg-gradient-to-r from-[#e5c366] via-[#d4b356] to-[#e5c366] rounded-2xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#d4b356]/30">
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-blue-700 text-sm sm:text-base font-semibold mb-2">Year Established</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">1988</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-blue-700 text-sm sm:text-base font-semibold mb-2">Charities Funded</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">86</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-blue-700 text-sm sm:text-base font-semibold mb-2">Money Donated</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">$6 Million</div>
                </div>
                <div className="p-6 sm:p-8 text-center">
                  <div className="text-blue-700 text-sm sm:text-base font-semibold mb-2">Number of Paid Employees</div>
                  <div className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold">0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Events Section */}
          <div className="mt-12 sm:mt-16 px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                Featured Events
              </h3>
              <p className="text-blue-700 mt-3 text-base sm:text-lg">
                Join us for upcoming events and fundraising opportunities
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredEvents.map((event) => {
                const cardClasses = 'bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-blue-100 hover:scale-105 duration-300 block';

                const content = (
                  <>
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-contain bg-white p-1"
                          loading="lazy"
                        />
                      ) : (
                        <svg className="w-20 h-20 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-blue-800 mb-2">{event.title}</h4>
                      <p className="text-blue-600 text-sm mb-4">{event.dateLocation}</p>
                      <p className="text-gray-600 text-sm">{event.description}</p>
                      {event.href ? (
                        <p className="mt-4 text-sm font-semibold text-blue-700">View Gallery</p>
                      ) : null}
                    </div>
                  </>
                );

                if (event.href) {
                  return (
                    <a key={event.title} href={event.href} className={cardClasses}>
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={event.title} className={cardClasses}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Who We Serve Section */}
          <div id="who-we-serve" className="mt-12 sm:mt-16 px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
                Who We Serve
              </h3>
              <p className="text-blue-700 mt-3 text-base sm:text-lg">
                Organizations we proudly support through our charitable giving
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/camp-sunshine.avif" 
                  alt="Camp Sunshine" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/wellspring-living.avif" 
                  alt="Wellspring Living" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/curing-kids-cancer.avif" 
                  alt="Curing Kids Cancer" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/canine-assistants.avif" 
                  alt="Canine Assistants" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/humane-society.avif" 
                  alt="Humane Society" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/atlanta-spectrum.avif" 
                  alt="Atlanta Spectrum" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/nfcc.avif" 
                  alt="NFCC" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
            </div>
          </div>

          {/* Our Sponsors Section */}
          <div className="mt-12 sm:mt-16 px-4">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
                Our Sponsors
              </h3>
              <p className="text-blue-700 mt-3 text-base sm:text-lg">
                Thank you to our generous business sponsors who make our work possible
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/diane-johnson.png" 
                  alt="Diane Johnson Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/aesthetic-center.png" 
                  alt="Aesthetic Center Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/kayc-carper.avif" 
                  alt="Kayc Carper Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/mibab.png" 
                  alt="MIBAB Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/mighty-dog.png" 
                  alt="Mighty Dog Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow border border-blue-100 flex items-center justify-center">
                <img 
                  src="/grapes-and-grains.png" 
                  alt="Grapes and Grains Sponsor" 
                  className="w-full h-auto object-contain max-h-32"
                />
              </div>
            </div>
          </div>

        {/* How We Operate Section */}
        <section id="how-we-operate" className="mb-12 sm:mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-blue-100">
            <div className="text-center mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                How We Operate
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-blue-700 max-w-4xl mx-auto leading-relaxed px-2">
                Charities submit grant applications annually in November. Using a well-established vetting process, 
                members vote on which of these charities will be the focus of our fundraising the following year. 
                Voting for the large and small grants typically occurs in January.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2">November</h4>
                <p className="text-blue-600">Charities submit their grant applications for consideration</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e5c366] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2">Vetting Process</h4>
                <p className="text-blue-600">Well-established process to evaluate and select worthy causes</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-blue-800 mb-2">January</h4>
                <p className="text-blue-600">Members vote on large and small grant recipients</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section id="get-involved" className="mb-20">
          <div className="bg-gradient-to-br from-blue-600 via-sky-600 to-green-700 rounded-3xl p-12 shadow-2xl text-white">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold mb-6">Get Involved</h3>
              <p className="text-xl text-green-100 max-w-4xl mx-auto leading-relaxed">
                CCOS Charity Guild welcomes all volunteers who wish to impact our community by sharing their 
                skills, talents and energy. Opportunities are varied and any amount of time and effort will make a difference.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="w-14 h-14 bg-[#e5c366] rounded-xl flex items-center justify-center mb-6 shadow-lg">
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
                <div className="w-14 h-14 bg-[#e5c366] rounded-xl flex items-center justify-center mb-6 shadow-lg">
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
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl border border-blue-100">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-6">
            About Us
          </h3>
          <p className="text-xl text-blue-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            The Country Club of the South Charity Guild represents the philanthropic heart of our distinguished 
            community. Since our establishment, we have maintained a steadfast commitment to supporting Atlanta 
            area non-profits through our 100% volunteer-based approach to fundraising and grant distribution.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-sky-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-white">100%</span>
              </div>
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Volunteer-Based</h4>
              <p className="text-blue-600">Every member contributes their time and talent to our mission</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-[#e5c366] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Atlanta Focus</h4>
              <p className="text-blue-600">Dedicated to supporting local non-profits in our community</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Quality Impact</h4>
              <p className="text-blue-600">Improving quality of life for those facing hardship</p>
            </div>
          </div>
        </div>

        {/* Heart to Heart Section */}
        <section id="heart-to-heart" className="mb-12 sm:mb-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-blue-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-6">
                Heart to Heart
              </h3>
              <div className="max-w-3xl mx-auto">
                <p className="text-base sm:text-lg text-blue-700 leading-relaxed mb-6">
                  Do you know someone who has experienced illness, surgery, or death within their family? 
                  The Charity Guild is here to help! Heart to Heart was established to bring sunshine to 
                  those in need within our community.
                </p>
                <p className="text-base sm:text-lg text-blue-700 leading-relaxed mb-8">
                  Click the link below to contact our Heart to Heart program volunteer, Andee Blauser, for more information.
                </p>
                <a
                  href="mailto:heart-to-heart@charityguild.org"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-sky-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-sky-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
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
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-4">
              Gallery
            </h3>
            <p className="text-blue-700 text-base sm:text-lg">
              Moments from our fundraising events and community impact
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Placeholder images - will be replaced with actual photos */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-blue-100">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-sky-100 flex items-center justify-center">
                  <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-3 mb-6">
              <img 
                src="/ccos-logo-transparent.png" 
                alt="CCOS Logo" 
                className="h-10 w-auto"
              />
              <h4 className="text-2xl font-bold text-[#e5c366]">
                Country Club of the South
              </h4>
            </div>
            <p className="text-blue-300 mb-4">Charity Guild • Established 1988</p>
            <p className="text-blue-400">&copy; 2025 Country Club of the South Charity Guild. All rights reserved.</p>
            <p className="text-blue-500 text-sm mt-2">Proudly serving the Atlanta community for over three decades</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
