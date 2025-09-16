export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏛️ CCOS Charity Guild
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Comprehensive Nonprofit Management System
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">✅ System Status</h3>
              <p className="text-sm text-blue-700">All systems operational</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">🚀 Deployment</h3>
              <p className="text-sm text-green-700">Live on Vercel</p>
            </div>
          </div>

          <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">🎯 Features Available:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Member Management & Onboarding</li>
              <li>• Donation Tracking & Analytics</li>
              <li>• Event Management System</li>
              <li>• Communication Workflows</li>
              <li>• Automated Processes</li>
              <li>• Real-time Dashboard</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/login"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Access Dashboard
            </a>
            <a
              href="/portal"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Member Portal
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500">
            <p>Build: {new Date().toISOString()}</p>
            <p>Powered by Next.js 15 + Supabase + Vercel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
