"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE = "http://127.0.0.1:8000";

const RegisterPage = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPasswordStrength = (pw: string): { label: string; color: string; width: string } => {
    if (!pw) return { label: "", color: "", width: "0%" };
    const hasNumber = /\d/.test(pw);
    const isLong = pw.length >= 6;
    const isVeryLong = pw.length >= 10;

    if (!isLong) return { label: "Too short", color: "bg-red-500", width: "25%" };
    if (!hasNumber) return { label: "Needs a number", color: "bg-orange-500", width: "40%" };
    if (isVeryLong && hasNumber) return { label: "Strong", color: "bg-green-500", width: "100%" };
    return { label: "Good", color: "bg-yellow-500", width: "70%" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!username || !email || !password) {
      setError("Please fill in username, e-mail, and password.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid e-mail address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          display_name: username,
          phone,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.detail || "Registration failed.";
        setError(msg);
        toast.error(msg);
        return;
      }

      // imamo token → sačuvaj lokalno
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authUser", JSON.stringify(data));

        // Dispatch custom event to update header immediately
        window.dispatchEvent(new Event("authChange"));
      }

      toast.success("Account created successfully!");
      router.push("/");
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

          {/* Title + bullet list */}
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">Register for free</h1>
          <ul className="text-sm text-gray-700 space-y-1 mb-5">
            <li>• List your car</li>
            <li>• Auto searches save</li>
            <li>• View auto-reminder list from any device</li>
          </ul>

          {/* Retailer link */}
          <button type="button" className="w-full border border-[#1166a8] text-[#1166a8] text-sm font-medium rounded-md py-2 mb-4 hover:bg-[#1166a80a] transition-colors">
            Are you a retailer? Click here!
          </button>

          {/* Error message */}
          {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-800">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="e.g. max_mustermann"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                E-mail address <span className="text-red-500">*</span>
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
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Choose a password"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password && (
                <div className="mt-1.5">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`} style={{ width: passwordStrength.width }} />
                  </div>
                  <p
                    className={`text-xs mt-1 ${passwordStrength.color === "bg-red-500" || passwordStrength.color === "bg-orange-500" ? "text-red-600" : passwordStrength.color === "bg-yellow-500" ? "text-yellow-600" : "text-green-600"}`}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-0.5">At least 6 characters with one number</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8] ${confirmPassword && password !== confirmPassword ? "border-red-400" : "border-gray-300"}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-600 mt-0.5">Passwords do not match</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+49 123 456789"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-800">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder="e.g. Munich, Germany"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1166a8] hover:bg-[#0e568f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md py-2.5 mt-2 transition-colors"
            >
              {loading ? "Creating account..." : "Continue via email"}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-500">- or -</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons – UI only for now */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">G</span>
              <span>Continue with Google</span>
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base">f</span>
              <span>Continue with Facebook</span>
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg"></span>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Already have account – optional */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1166a8] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
