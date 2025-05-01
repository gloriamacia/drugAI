import { FC } from "react";
import { Link } from "react-router-dom";

export const PricingSection: FC = () => (
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-primary">
    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
      Pricing Plans
    </h2>

    <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
      {/* Free Plan */}
      <div className="border border-gray-200 rounded-xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Free</h3>
        <p className="text-gray-600 mb-6">
          Perfect for getting started with AI predictions.
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <span className="mr-2 font-medium">Monthly quota:</span>
            <span className="text-gray-900">100 predictions</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-medium">Concurrency:</span>
            <span className="text-gray-900">1 job at a time</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-medium">Support:</span>
            <span className="text-gray-900">Community forum</span>
          </div>
        </div>
        <div className="mt-auto">
          <span className="text-4xl font-extrabold text-gray-900">$0</span>
          <span className="text-base text-gray-600"> / month</span>
          <button
            className="mt-6 w-full bg-gray-200 text-gray-800 font-medium py-2 rounded-lg hover:bg-gray-300 transition-colors"
            disabled
          >
            Try Free
          </button>
        </div>
      </div>

      {/* Pro Plan */}
      <div className="border-2 border-primary rounded-xl p-6 flex flex-col h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Pro</h3>
        <p className="text-gray-600 mb-6">
          For power users who need higher throughput.
        </p>
        <div className="mb-6 space-y-2">
          <div className="flex items-center">
            <span className="mr-2 font-medium">Monthly quota:</span>
            <span className="text-gray-900">10,000 predictions</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-medium">Concurrency:</span>
            <span className="text-gray-900">Up to 10 jobs concurrently</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-medium">Support:</span>
            <span className="text-gray-900">Community forum & Email</span>
          </div>
        </div>
        <div className="mt-auto">
          <span className="text-4xl font-extrabold text-gray-900">$29</span>
          <span className="text-base text-gray-600"> / month</span>
          <Link
            to="/subscribe"
            className="mt-6 block w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-primary transition-colors text-center"
          >
            Subscribe
          </Link>
        </div>
      </div>
    </div>
  </section>
);
