'use client';

export default function HopeForHolidays2025Page() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-amber-50 to-blue-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium">
            <span aria-hidden="true" className="mr-2">←</span>
            Back to Home
          </a>
        </div>

        <header className="text-center mb-10">
          <p className="text-blue-700 font-semibold uppercase tracking-[0.2em] text-sm mb-3">Charity Guild Event</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-700 to-sky-600 bg-clip-text text-transparent">
            Sun T+P clsd Hope for Holidays 2025 Info
          </h1>
          <p className="mt-4 text-lg text-slate-700">Hope for Holidays 2025</p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6 order-2 lg:order-1">
            <div className="space-y-4 text-slate-800 leading-7">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-5">
                <h2 className="text-xl font-bold text-blue-900 mb-2">Tickets available at the door</h2>
                <p>Live Online Auction</p>
                <p>Tickets on Sale NOW</p>
              </div>
              <p>
                The flyer is the focal point of the live page, so the local version uses the exact event flyer and
                keeps the messaging concise and centered on the fundraiser details.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="/donate" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 transition-colors">
                  Donate
                </a>
                <a href="/contact" className="inline-flex items-center justify-center rounded-xl bg-[#e5c366] px-5 py-3 font-semibold text-white shadow-lg hover:bg-[#d4b356] transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-4 sm:p-6 order-1 lg:order-2">
            <img
              src="/events/hope-for-holidays-2025/hope-for-holidays-flyer.png"
              alt="Hope for Holidays 2025 flyer"
              className="w-full h-auto rounded-xl"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
