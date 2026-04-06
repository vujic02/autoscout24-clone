"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE = "http://127.0.0.1:8000";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter e-mail and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid e-mail address.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // backend expects "username" – we use email as username
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.detail || "Login failed. Check your credentials.";
        setError(msg);
        toast.error(msg);
        return;
      }

      // Save token and basic user info
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data));

        // Store admin status
        if (data.is_staff) {
          localStorage.setItem("isAdmin", "true");
        }

        // Dispatch custom event to update header immediately
        window.dispatchEvent(new Event("authChange"));
      }

      toast.success("Welcome back!");

      // Redirect to admin if staff, else home
      if (data.is_staff) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Form Card */}
      <div
        style={{
          backgroundImage: "url('/keys.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "1024px",
        }}
        className="flex-1 flex items-center justify-center px-4 py-8 bg-white"
      >
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-[#ffe93b] rounded-sm">
              <span className="text-sm font-semibold text-black">Auto</span>
              <span className="text-sm font-semibold text-black">Scout24</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">Sign in</h1>

          <p className="text-sm text-gray-600 text-center mb-6">Log in with your email address to access your account.</p>

          {/* Email input */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-3 py-2">{error}</div>}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                E-mail address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. max.mustermann@example.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Password
              </label>

              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1166a8] hover:bg-[#0e568f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md py-2.5 mt-2 transition-colors"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-4">
            <a className="text-xs text-[#1166a8] hover:underline cursor-pointer" href="#">
              Forgot your password?
            </a>
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-500">New here?</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Register redirect */}
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-[#1166a8] font-medium hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
