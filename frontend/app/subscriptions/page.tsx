import React from "react";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  gradient: string;
  features: string[];
}

interface SubscriptionCardProps {
  plan: Plan;
  isPopular: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isPopular,
}) => {
  return (
    <div className="relative group transition-transform duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div
        className={`relative backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 h-full shadow-lg ${
          isPopular ? "ring-2 ring-blue-400" : ""
        }`}
      >
        {isPopular && (
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
        )}

        <h3
          className={`text-2xl font-semibold mb-2 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}
        >
          {plan.name}
        </h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-white">{plan.price}</span>
          <span className="text-blue-200/70">/{plan.period}</span>
        </div>
        <p className="text-blue-200/90 mb-6">{plan.description}</p>

        <button
          className={`w-full bg-gradient-to-r ${plan.gradient} text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300 mb-8 hover:scale-105 active:scale-95`}
        >
          Get Started
        </button>

        <div className="space-y-4">
          {plan.features.map((feature, featureIndex) => (
            <div key={featureIndex} className="flex items-center">
              <Check className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
              <span className="text-blue-100/80">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SubscriptionPage = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99",
      period: "monthly",
      description: "Essential support for your mental wellness journey",
      gradient: "from-blue-400 to-blue-600",
      features: [
        "Access to basic AI companion",
        "Daily check-ins and mood tracking",
        "Guided meditation sessions",
        "Basic progress analytics",
        "Email support",
        "Weekly wellness reports",
      ],
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "monthly",
      description: "Advanced features for deeper personal growth",
      gradient: "from-indigo-400 to-indigo-600",
      features: [
        "Everything in Basic, plus:",
        "Advanced AI personality matching",
        "Unlimited chat sessions",
        "Personalized growth roadmap",
        "Priority support response",
        "Advanced analytics dashboard",
        "Custom therapeutic exercises",
        "Crisis support 24/7",
      ],
    },
    {
      name: "Pro+",
      price: "$39.99",
      period: "monthly",
      description: "Premium experience for comprehensive mental healthcare",
      gradient: "from-purple-400 to-purple-600",
      features: [
        "Everything in Pro, plus:",
        "Multiple AI companion profiles",
        "Family account (up to 4 members)",
        "Monthly progress consultation",
        "Integration with health apps",
        "Expert-curated content library",
        "Custom wellness challenges",
        "Priority feature access",
        "Dedicated support team",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-blue-900/20 to-gray-900/40" />
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob" />
        <div className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-indigo-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-2000" />
        <div className="absolute left-0 bottom-1/4 w-[700px] h-[700px] bg-purple-400/30 rounded-full mix-blend-soft-light filter blur-[128px] animate-blob animation-delay-4000" />
      </div>

      <main className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-purple-200">
            Choose Your Journey
          </h1>
          <p className="text-xl text-blue-200/90 max-w-2xl mx-auto">
            Select the plan that best fits your needs and start your path to
            better mental wellness today.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <SubscriptionCard key={index} plan={plan} isPopular={index === 1} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-16">
          <p className="text-blue-200/70 mb-6">
            All plans include a 14-day free trial. Cancel anytime. No credit
            card required to start.
          </p>
          <p className="text-blue-200/90">
            Need help choosing? Take our{" "}
            <a href="#" className="text-blue-400 hover:text-blue-300 underline">
              personality test
            </a>{" "}
            to find your perfect match.
          </p>
        </div>
      </main>
    </div>
  );
};

export default SubscriptionPage;
