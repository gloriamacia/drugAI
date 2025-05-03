// src/components/PricingSection.tsx
import { FC } from "react";
import { Link } from "react-router-dom";
import { SubscribeButton } from "./SubscribeButton";

export const PricingSection: FC = () => (
  <section
    id="pricing"
    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12"
  >
    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 text-center">
      Pricing
    </h2>

    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Free Plan */}
      <div className="relative bg-white rounded-2xl ring-1 ring-gray-200 shadow-md p-6 flex flex-col justify-between transform-gpu transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Free</h3>
          <p className="mt-2 text-gray-600">
            Get started with basic predictions.
          </p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">100 predictions / month</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">1 job at a time</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">Community forum support</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
            $0
          </span>
          <span className="text-sm md:text-base text-gray-600">/mo</span>

          <Link
            to="/sign-in"
            className="mt-6 block w-full py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Try Free
          </Link>
        </div>
      </div>

      {/* Pro Plan */}
      <div className="relative bg-white rounded-2xl ring-2 ring-primary shadow-md p-6 flex flex-col justify-between transform-gpu transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg">
        <div className="absolute -top-3 right-3">
          <span className="bg-primary text-white text-xs font-semibold uppercase py-1 px-3 rounded-full">
            Most Popular
          </span>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800">Pro</h3>
          <p className="mt-2 text-gray-600">
            For professionals needing higher throughput.
          </p>

          <ul className="mt-6 space-y-4">
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">10,000 predictions / month</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">Up to 10 concurrent jobs</span>
            </li>
            <li className="flex items-start">
              <span className="mr-3 mt-1 text-green-500">✔️</span>
              <span className="text-gray-700">Priority email support</span>
            </li>
          </ul>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-baseline justify-center space-x-1">
            <span className="text-3xl md:text-4xl font-extrabold text-gray-900">
              $29
            </span>
            <span className="text-sm md:text-base text-gray-600">/mo</span>
          </div>

          <SubscribeButton />
        </div>
      </div>
    </div>
  </section>
);
