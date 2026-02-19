import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CartRecall - AI Customer Re-engagement | Mission Control',
  description: 'AI-powered customer re-engagement engine for e-commerce',
};

export default function CartRecallPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="px-3 py-1 bg-purple-600 text-sm font-medium rounded-full">P2</span>
            <span className="px-3 py-1 bg-green-600 text-sm font-medium rounded-full">In Progress</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">CartRecall</h1>
          <p className="text-xl text-gray-400">AI Customer Re-engagement Engine</p>
        </div>

        {/* Opportunity */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🎯 Opportunity</h2>
          <p className="text-gray-300">
            SMB e-commerce brands lose <span className="text-red-400 font-bold">65%+ inactive customers</span>. 
            They need an automated way to bring them back with personalized campaigns.
          </p>
        </section>

        {/* Solution */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">💡 Solution</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">📊 Purchase Analysis</h3>
              <p className="text-gray-300">Analyzes purchase patterns to identify churned/at-risk customers</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">⏰ Timing Prediction</h3>
              <p className="text-gray-300">Predicts optimal re-engagement timing for maximum conversion</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">✍️ AI Content Generation</h3>
              <p className="text-gray-300">Generates personalized email/SMS/retargeting campaigns with AI-written copy</p>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold text-purple-400 mb-2">💰 Discount Optimization</h3>
              <p className="text-gray-300">Suggests discount levels that maximize ROI</p>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔗 Integrations</h2>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-gray-700 px-6 py-3 rounded-lg">
              <span className="text-green-400 font-semibold">Shopify</span>
            </div>
            <div className="bg-gray-700 px-6 py-3 rounded-lg">
              <span className="text-blue-400 font-semibold">Klaviyo</span>
            </div>
            <div className="bg-gray-700 px-6 py-3 rounded-lg">
              <span className="text-purple-400 font-semibold">Stripe</span>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">💵 Pricing</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-3xl font-bold text-green-400">$49<span className="text-lg text-gray-400">/mo</span></p>
              <p className="text-gray-400 mt-2">Up to 500 customers</p>
            </div>
            <div className="bg-purple-900/50 border-2 border-purple-500 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-3xl font-bold text-purple-400">$99<span className="text-lg text-gray-400">/mo</span></p>
              <p className="text-gray-400 mt-2">Up to 2,500 customers</p>
              <span className="inline-block mt-2 px-3 py-1 bg-purple-600 text-xs rounded-full">Popular</span>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold text-yellow-400">$149<span className="text-lg text-gray-400">/mo</span></p>
              <p className="text-gray-400 mt-2">Unlimited customers</p>
            </div>
          </div>
        </section>

        {/* Status */}
        <section className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">📋 Status</h2>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
            <span className="text-yellow-400 font-medium">Idea Phase - Needs Validation</span>
          </div>
          <p className="text-gray-400 mt-2">
            This feature is currently in concept phase. Next steps: validate with potential customers and build MVP.
          </p>
        </section>
      </div>
    </div>
  );
}
