"use client";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { ArrowRight, Zap } from "lucide-react";
import axios from "axios";
import API_URL from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const userEmail = userCred.user.email || email;
      
      const checkRes = await axios.get(`${API_URL}/api/user/${userEmail}`);
      if (!checkRes.data || checkRes.data.websites === undefined) {
        await auth.signOut();
        setError("Account not found. Please sign up first.");
        setLoading(false);
        return;
      }
      
      try {
        await axios.post(`${API_URL}/api/create-user`, {
          email: userEmail
        });
      } catch (createErr) {}
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userEmail = result.user.email;
      
      const checkRes = await axios.get(`${API_URL}/api/user/${userEmail}`);
      if (!checkRes.data || checkRes.data.websites === undefined) {
        await auth.signOut();
        setError("Account not found. Please sign up first.");
        setLoading(false);
        return;
      }
      
      try {
        await axios.post(`${API_URL}/api/create-user`, {
          email: userEmail
        });
      } catch (createErr) {}
      navigate("/dashboard");
    } catch (err) {
      setError("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden" style={{ cursor: "none" }}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
      
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-700/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-fuchsia-700/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.15)] rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-zinc-400 mt-2">Sign in to continue creating</p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 mb-6 rounded-xl text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full p-3.5 rounded-xl bg-black/40 border border-violet-500/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 outline-none transition backdrop-blur-md text-white placeholder-zinc-500"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full p-3.5 pr-12 rounded-xl bg-black/40 border border-violet-500/20 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 outline-none transition backdrop-blur-md text-white placeholder-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-violet-400 transition"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right mt-3">
              <a href="/forgot-password" className="text-violet-400 text-sm hover:text-violet-300 transition">
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-violet-500/30" />
              <span className="px-3 text-violet-400 text-sm">or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-violet-500/30" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-black/40 border border-violet-500/20 hover:bg-violet-900/20 transition backdrop-blur-md"
            >
              <FcGoogle size={24} />
              Continue with Google
            </button>

            <p className="text-sm text-zinc-400 mt-6 text-center">
              Don't have an account?{" "}
              <a href="/signup" className="text-violet-400 hover:text-violet-300 transition font-medium">
                Sign up free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
