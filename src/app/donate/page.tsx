'use client';

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-sky-100">
      <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img
                src="/ccos-logo-transparent.png"
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent mb-4">
            Become a Patron or Member
          </h2>
          <p className="text-blue-700 text-sm sm:text-base max-w-3xl mx-auto">
            Renew or become a member of the Charity Guild. Become a Patron. Thank you for donating to the Country Club of the South Charity Guild.
          </p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100">
            <div className="space-y-5 text-blue-800 leading-8 text-base sm:text-lg">
              <p>
                Our grant recipients greatly appreciate the generosity our organization has shown them over the past three decades.
              </p>
              <p className="font-semibold">
                100% of all donations to the Charity Guild go to our grant recipients.
              </p>
              <p>
                This is made possible by the generous support of business sponsors that provide us with the funding needed to operate the Guild and host fundraising and/or educational events.
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Member and Patron levels</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-blue-100">
                    <div className="font-semibold text-blue-900">Diamond Patron</div>
                    <div>$10,000+</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-blue-100">
                    <div className="font-semibold text-blue-900">Platinum Patron</div>
                    <div>$5,000 - $9,999</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-blue-100">
                    <div className="font-semibold text-blue-900">Gold Patron</div>
                    <div>$1,000 - $4,999</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-blue-100">
                    <div className="font-semibold text-blue-900">Silver Patron</div>
                    <div>$500 - $999</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 shadow-sm border border-blue-100 sm:col-span-2">
                    <div className="font-semibold text-blue-900">Member</div>
                    <div>$100 - $499</div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                <h3 className="text-xl font-bold text-blue-900 mb-3">Member privileges include</h3>
                <ul className="space-y-2 text-base sm:text-lg">
                  <li>Full participation in charity selection process</li>
                  <li>Invitations to Guild-sponsored events</li>
                </ul>
                <p className="mt-4 text-base sm:text-lg">
                  All Member privileges plus tickets to the Hope Awards, the annual recognition cocktail reception.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6">
            <img
              src="/join-donate/member-level-chart.png"
              alt="Member level chart"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-200 text-white">
            <h3 className="text-2xl font-bold mb-4">Online Donations</h3>
            <div className="bg-white/95 rounded-xl p-6 text-slate-800 space-y-4">
              <p>
                Note: To donate, please click Donate below, enter amount and click Submit. To donate a Memorial Gift, follow the same steps and enter the desired name on the following page.
              </p>
              <a
                href="https://ccscharityguild-bloom.kindful.com/?campaign=1416249"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#e5c366] px-6 py-3 font-semibold text-white shadow-lg hover:bg-[#d4b356] transition-colors"
              >
                Join / Donate
              </a>
            </div>
            <p className="mt-4 text-white/95 font-semibold">List of Members + Donors</p>
            <p className="text-white/90 text-sm mt-1">The Charity Guild&apos;s fiscal year annually runs January 1 through December 31.</p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Donate from a Trust or Pay by Check</h3>
            <p className="text-blue-800 mb-5">
              Please send your check and the Printable Donation Form to the following address:
            </p>
            <div className="bg-blue-50 rounded-xl p-6 mb-5">
              <address className="not-italic text-blue-900 text-lg leading-relaxed">
                <strong>Treasurer</strong><br />
                CCS Charity Guild<br />
                3000 Old Alabama Road<br />
                Suite 119-342<br />
                Johns Creek, GA 30022<br />
                Tax ID: 58-1857318
              </address>
            </div>
            <div className="space-y-3 text-blue-800">
              <p>Printable Donation Form (optional)</p>
              <p>Please contact Beth Wren, Treasurer, with any questions.</p>
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/donor-list"
            className="inline-flex justify-center bg-gradient-to-r from-blue-600 to-sky-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-sky-700 transition-all shadow-lg hover:shadow-xl"
          >
            List of Members + Donors
          </a>
          <a
            href="/"
            className="inline-flex justify-center bg-gradient-to-r from-[#e5c366] to-[#d4b356] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#d4b356] hover:to-[#c4a346] transition-all shadow-lg hover:shadow-xl"
          >
            Back to Home
          </a>
        </div>
      </main>
    </div>
  );
}
