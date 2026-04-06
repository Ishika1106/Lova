"use client";
import { useState } from "react";
import { auth } from "../firebase";
import API_URL from "../api";
import { Zap, Globe, Rocket, Sparkles, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    id: "1",
    amount: 29,
    icon: Globe,
    label: "Starter",
    sites: "1 site",
    price: "29",
    perSite: "₹29 / site",
    features: ["1 AI-generated site", "HTML + Tailwind export", "Live preview", "Voice input support"],
    popular: false,
    gradient: "from-blue-600/20 to-cyan-600/20",
    border: "border-blue-500/30",
    accent: "text-blue-400"
  },
  {
    id: "3",
    amount: 59,
    icon: Rocket,
    label: "Builder",
    sites: "3 sites",
    price: "59",
    perSite: "~₹20 / site",
    features: [
      "3 AI-generated sites",
      "HTML + Tailwind export",
      "Live preview",
      "Priority generation",
      "Modification support",
      "All export formats"
    ],
    popular: true,
    gradient: "from-purple-600/20 to-pink-600/20",
    border: "border-purple-500/50",
    accent: "text-purple-400"
  },
  {
    id: "10",
    amount: 149,
    icon: Sparkles,
    label: "Pro",
    sites: "10 sites",
    price: "149",
    perSite: "~₹15 / site",
    features: [
      "10 AI-generated sites",
      "HTML + Tailwind export",
      "Live preview",
      "Priority generation",
      "Modification support",
      "All export formats",
      "Early access features"
    ],
    popular: false,
    gradient: "from-amber-600/20 to-orange-600/20",
    border: "border-amber-500/30",
    accent: "text-amber-400"
  },
];

export default function Billing() {
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async (amount, plan) => {
    setLoading(plan);
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const res = await fetch(`${API_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();

      const options = {
        key: "rzp_test_STBtunhIyRKrO1",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,
        theme: { color: "#7c3aed" },
        handler: async function (response) {
          const verifyRes = await fetch(`${API_URL}/api/verify-payment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, email: user.email, plan }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            alert("Payment successful! Credits added to your account.");
            navigate("/dashboard");
          } else {
            alert("Payment failed. Please try again.");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden" style={{ cursor: "none" }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Simple Pricing</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            One-time credits. No subscriptions. No hidden fees. Start creating today.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isLoading = loading === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col bg-white/[0.02] backdrop-blur-xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/10 ${plan.popular ? "border-violet-500/50 bg-white/[0.04]" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold">{plan.label}</h3>
                </div>

                <div className="mb-6">
                  <span className="text-5xl font-bold">₹{plan.price}</span>
                  <p className="text-sm text-zinc-500 mt-1">{plan.perSite}</p>
                </div>

                <ul className="space-y-3 text-sm text-zinc-300 flex-1 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isLoading}
                  onClick={() => handlePayment(plan.amount, plan.id)}
                  className={`w-full py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Get {plan.sites}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold mb-4">Need more credits?</h3>
          <p className="text-zinc-400 mb-6">Contact us for custom enterprise plans and volume pricing</p>
          <button className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition">
            Contact Sales
          </button>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-12">
          Secure payments via Razorpay • Credits never expire • Instant delivery
        </p>
      </div>
    </div>
  );
}
