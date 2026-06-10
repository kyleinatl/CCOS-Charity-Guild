'use client';

export default function GardenPartyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium">
            <span aria-hidden="true" className="mr-2">←</span>
            Back to Home
          </a>
        </div>

        <header className="text-center mb-10">
          <p className="text-blue-700 font-semibold uppercase tracking-[0.2em] text-sm mb-3">Charity Guild Event</p>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
            Old-Garden Party May 2, 2025
          </h1>
          <p className="mt-4 text-lg text-slate-700">Garden Party</p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6">
            <img
              src="/events/garden-party/garden-party-flyer.png"
              alt="Garden Party flyer"
              className="w-full h-auto rounded-xl"
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-blue-100">
              <h2 className="text-2xl font-bold text-blue-900 mb-4">Tickets &amp; More info</h2>
              <p className="text-slate-700 leading-7">
                Garden Party event details and flyer.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="/donate" className="inline-flex items-center justify-center rounded-xl bg-[#e5c366] px-5 py-3 font-semibold text-white shadow-lg hover:bg-[#d4b356] transition-colors">
                Donate
              </a>
              <a href="/sponsor" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors">
                Sponsor
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
