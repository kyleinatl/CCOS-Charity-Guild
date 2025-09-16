export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🏛️ CCOS Charity Guild
          </h1>
          <p className="text-gray-600 mb-6">
            Deployment Test - Vercel is working!
          </p>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            ✅ Next.js 15 deployment successful
          </div>
          <div className="mt-6 space-y-2 text-sm text-gray-500">
            <p>Build: {new Date().toISOString()}</p>
            <p>Environment: Production</p>
            <p>Status: Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}