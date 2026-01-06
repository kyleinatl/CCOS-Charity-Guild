export default function DonatePage() {
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 text-green-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <a
                href="/"
                className="text-green-700 hover:text-emerald-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
            Become a Member, Patron
          </h2>
        </div>

        {/* Introduction Text */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <p className="text-lg text-green-800 leading-relaxed mb-6">
            Renew or become a member of the Charity Guild. Become a Patron. Thank you for donating 
            to the Country Club of the South Charity Guild. Our grant recipients greatly appreciate 
            the generosity our organization has shown them over the past three decades.
          </p>
          <p className="text-lg text-green-800 leading-relaxed">
            <span className="font-semibold">100% of all donations to the Charity Guild go to our grant recipients.</span> This is made 
            possible by the generous support of business sponsors that provide us with the funding needed 
            to operate the Guild and host fundraising and/or educational events.
          </p>
        </div>

        {/* Patron Levels Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-200">
                  <th className="text-left py-4 px-4 text-green-900 font-bold text-lg">Diamond Patron</th>
                  <th className="text-left py-4 px-4 text-green-900 font-bold text-lg">Platinum Patron</th>
                  <th className="text-left py-4 px-4 text-green-900 font-bold text-lg">Gold Patron</th>
                  <th className="text-left py-4 px-4 text-green-900 font-bold text-lg">Silver Patron</th>
                  <th className="text-left py-4 px-4 text-green-900 font-bold text-lg">Hope</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 px-4 text-green-800 font-semibold text-lg">$10,000+</td>
                  <td className="py-4 px-4 text-green-800 font-semibold text-lg">$5,000</td>
                  <td className="py-4 px-4 text-green-800 font-semibold text-lg">$1,000</td>
                  <td className="py-4 px-4 text-green-800 font-semibold text-lg">$500</td>
                  <td className="py-4 px-4 text-green-800 font-semibold text-lg">$100</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Privileges */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100 mb-8">
          <h3 className="text-2xl font-bold text-green-900 mb-4">Member privileges include:</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-lg text-green-800">Full participation in charity selection process</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">•</span>
              <span className="text-lg text-green-800">Invitations to Guild-sponsored events</span>
            </li>
          </ul>
          
          <h3 className="text-2xl font-bold text-green-900 mb-4 mt-8">Exclusive Patron privileges:</h3>
          <p className="text-lg text-green-800">
            All Member privileges plus tickets to the Hope Awards - the annual recognition cocktail reception
          </p>
        </div>

        {/* Online Donations Card */}
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-8 shadow-xl border border-green-200 mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">Online Donations</h3>
          <div className="bg-white/95 rounded-xl p-6 mb-4">
            <p className="text-green-800 mb-4">
              <span className="font-semibold">Note:</span> To donate, please click Donate below, enter amount and click Submit. 
              To donate a Memorial Gift, follow steps above, and on the following page, enter desired name. Thank you.
            </p>
            <a
              href="https://countryclubofthesouth.kindful.com/?campaign=1177635"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-amber-600 hover:to-yellow-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join/Donate
            </a>
          </div>
          <p className="text-white text-lg font-semibold">List of Members + Donors</p>
        </div>

        {/* Check Donations Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <h3 className="text-2xl font-bold text-green-900 mb-6">Donate from a Trust or Pay by Check</h3>
          <p className="text-lg text-green-800 mb-6">
            Please send your check and the Printable Donation Form to the following address:
          </p>
          <div className="bg-green-50 rounded-xl p-6 mb-6">
            <address className="not-italic text-green-900 text-lg leading-relaxed">
              <strong>Treasurer</strong><br />
              CCS Charity Guild<br />
              3000 Old Alabama Road<br />
              Suite 119-342<br />
              Johns Creek, GA 30022
            </address>
          </div>
          <p className="text-lg text-green-800">
            Please contact Geri Eubanks, Treasurer, with any questions.
          </p>
        </div>
      </main>
    </div>
  );
}
