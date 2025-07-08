
import React from 'react';

const Icon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex-shrink-0 ${className}`}>{children}</div>
);

const RefundPolicyPage: React.FC = () => {
  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        
        <header className="text-center mb-12">
          <div className="text-6xl text-green-500 mb-2">🌱</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Refund Policy
          </h1>
          <p className="text-md md:text-lg text-gray-600 mt-3 max-w-xl mx-auto">
            Your trust is our priority. Here’s how our refund process works, kept simple and clear.
          </p>
        </header>

        <main className="space-y-6">
          
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <Icon className="text-2xl text-green-500">📄</Icon>
              <h2 className="text-xl font-semibold text-green-600">
                1. Booking Confirmation
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              All bookings made through CashbackFarms.com are processed after confirmation of token amount or full payment via Razorpay. A confirmation email and receipt will be shared upon successful transaction.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <Icon className="text-2xl text-green-500">✅</Icon>
              <h2 className="text-xl font-semibold text-green-600">
                2. Refund Eligibility
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              We offer refunds only under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>If the plot/property selected is unavailable or already booked.</li>
              <li>If the booking is canceled by Cashback Farms due to technical or operational issues.</li>
              <li>If the buyer cancels within <strong>3 business days</strong> from the date of payment and before documentation has begun.</li>
            </ul>
            
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md flex items-center gap-4">
              <Icon className="text-2xl text-yellow-500">💡</Icon>
              <p className="text-yellow-800 text-sm sm:text-base">
                <strong>Note:</strong> The token amount is non-refundable once the documentation or legal process is initiated.
              </p>
            </div>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <Icon className="text-2xl text-green-500">🔄</Icon>
              <h2 className="text-xl font-semibold text-green-600">
                3. The Refund Process
              </h2>
            </div>
            <ol className="space-y-3 text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">1.</span>
                <span><strong>Request:</strong> Email us at <a href="mailto:support@cashbackfarms.com" className="text-green-600 hover:underline">support@cashbackfarms.com</a> or call +91 81900 19991 with your payment reference number.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">2.</span>
                <span><strong>Approval:</strong> Once approved, we will process the refund (excluding any non-refundable charges).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-green-600">3.</span>
                <span><strong>Receive:</strong> The amount will be refunded to your original mode of payment within <strong>7–10 business days</strong>.</span>
              </li>
            </ol>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center gap-4 mb-4">
              <Icon className="text-2xl text-green-500">💰</Icon>
              <h2 className="text-xl font-semibold text-green-600">
                4. Cancellation Charges
              </h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              In case of cancellations initiated by the buyer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>A <strong>5% processing fee</strong> may be deducted from the refund amount.</li>
              <li><strong>No refund</strong> is applicable once documentation is submitted or registration is initiated.</li>
            </ul>
          </section>
        </main>

        <footer className="mt-12 bg-green-600 text-white text-center p-8 sm:p-10 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold">Have Questions?</h2>
          <p className="text-green-100 mt-2">We're here to help you.</p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8">
            <a href="mailto:support@cashbackfarms.com" className="flex items-center gap-2 hover:text-green-200 transition-colors">
              <Icon>✉️</Icon>
              support@cashbackfarms.com
            </a>
            <a href="tel:+918190019991" className="flex items-center gap-2 hover:text-green-200 transition-colors">
              <Icon>📞</Icon>
              +91 81900 19991
            </a>
          </div>
          <p className="mt-6 text-sm text-green-200 opacity-80">
            Greenheap Agro Farms Private Limited
          </p>
        </footer>

      </div>
    </div>
  );
};

export default RefundPolicyPage;