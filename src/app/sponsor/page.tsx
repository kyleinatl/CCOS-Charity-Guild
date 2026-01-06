'use client';

import { useState } from 'react';

export default function SponsorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="CCOS Charity Guild Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                  Country Club of the South
                </h1>
                <p className="text-sm text-green-600 font-medium">Charity Guild</p>
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
            Become a Sponsor
          </h2>
        </div>

        {/* Introduction Text */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <p className="text-lg text-green-800 leading-relaxed mb-6">
            Business Sponsors serve a vital role in the success of the Country Club of the South Charity Guild 
            as the funds raised from Sponsors cover <span className="font-bold">ALL operating expenses</span> (printing, 
            postage, accounting, insurance, software subscription fees, etc.) so that all donations raised from 
            our Patrons and Members will go to the direct benefit of the chosen charities.
          </p>
          <p className="text-lg text-green-800 leading-relaxed mb-6">
            For more information on becoming a Sponsor, please contact <span className="font-semibold">Kayc Carper 404-626-1143</span>
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <h3 className="text-2xl font-bold text-green-900 mb-6">
            This year's sponsors will have expanded promotional opportunities through:
          </h3>
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">•</span>
              <span className="text-lg text-green-800">Exciting membership events in April, November and next January</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">•</span>
              <span className="text-lg text-green-800">Monthly electronic and print communications</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">•</span>
              <span className="text-lg text-green-800">Continuous website presence</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-3 text-xl">•</span>
              <span className="text-lg text-green-800">Customized promotions to unique set of high-worth individuals</span>
            </li>
          </ul>
          <p className="text-lg text-green-800 font-semibold mb-8">
            The sooner you sponsor, the more promotional time you will receive!
          </p>
          <p className="text-lg text-green-800 mb-6">
            To participate in this year's program as a sponsor, please review our sponsorship level presentation 
            to select a sponsorship level.
          </p>
          <p className="text-lg text-green-800 mb-8">
            We look forward to learning about your sponsorship interest and working together for an impactful 2026.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.charityguild.org/_files/ugd/a80fd7_48c5f30d7c134d0aaf54a650684cd90e.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
            >
              Sponsorship Overview
            </a>
            <a
              href="https://www.charityguild.org/sponsorship#:~:text=Click%20here%20to%20Sponsor,Bronze%20Sponosr%20%241%2C000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-center"
            >
              Click here to Sponsor
            </a>
          </div>
        </div>

        {/* Sponsorship Levels */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <h3 className="text-2xl font-bold text-green-900 mb-6 text-center">Sponsorship Levels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Presenting Sponsor</h4>
              <p className="text-3xl font-bold text-white">$5,000+</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Gold Sponsor</h4>
              <p className="text-3xl font-bold text-white">$5,000</p>
            </div>
            <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Silver Sponsor</h4>
              <p className="text-3xl font-bold text-white">$2,500</p>
            </div>
            <div className="bg-gradient-to-br from-amber-700 to-amber-800 rounded-xl p-6 text-center shadow-lg">
              <h4 className="text-2xl font-bold text-white mb-2">Bronze Sponsor</h4>
              <p className="text-3xl font-bold text-white">$1,000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
