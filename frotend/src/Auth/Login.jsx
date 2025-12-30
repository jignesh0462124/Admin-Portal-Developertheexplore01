import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabase/supabase.js";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  Loader2
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data?.session) {
        setError("Login failed. Please try again.");
        return;
      }

      // ✅ Store auth flag for AuthGuard
      localStorage.setItem("admin_token", "true");

      // ✅ Navigate to admin dashboard
      navigate("/admindashboard");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-3xl hover:shadow-indigo-500/10">

        {/* BRANDING HEADER */}
        <div className="bg-white/50 pt-10 pb-8 px-8 text-center border-b border-gray-100">
          <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3 hover:rotate-0 transition-all duration-300">
            <ShieldCheck className="text-white drop-shadow-md" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Welcome Back
          </h1>
          <p className="text-base text-gray-500 mt-2 font-medium">
            Sign in to access the admin console
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
              </div>
              <input
                type="email"
                name="email"
                required
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 text-sm font-medium text-red-600 bg-red-50/50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle size={20} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <div className="bg-gray-50/80 px-8 py-5 border-t border-gray-100 text-center backdrop-blur-sm">
          <p className="text-xs text-gray-500 font-medium">
            Secure Admin Access &copy; {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  );
}
