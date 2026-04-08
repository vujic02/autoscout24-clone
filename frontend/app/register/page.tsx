"use client";

import React, { useState } from "react";
import { useTranslation, usePageTitle } from "@/lib/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const API_BASE = "http://127.0.0.1:8000";

const RegisterPage = () => {
  const { t } = useTranslation();
  usePageTitle(t("titles.register"));
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

    if (!isLong) return { label: t("register.tooShort"), color: "bg-red-500", width: "25%" };
    if (!hasNumber) return { label: t("register.needsANumber"), color: "bg-orange-500", width: "40%" };
    if (isVeryLong && hasNumber) return { label: t("register.strong"), color: "bg-green-500", width: "100%" };
    return { label: t("register.good"), color: "bg-yellow-500", width: "70%" };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!username || !email || !password) {
      setError(t("register.pleaseFillRequired"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(t("register.pleaseEnterValidEmail"));
      return;
    }

    if (password.length < 6) {
      setError(t("register.passwordMinLength"));
      return;
    }

    if (!/\d/.test(password)) {
      setError(t("register.passwordNeedsNumber"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("register.passwordsDoNotMatch"));
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
        const msg = data.detail || t("register.registrationFailed");
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

      toast.success(t("register.accountCreated"));
      router.push("/");
    } catch (err) {
      console.error(err);
      setError(t("common.somethingWentWrong"));
      toast.error(t("common.somethingWentWrong"));
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
          <h1 className="text-xl font-semibold text-gray-900 text-center mb-2">{t("register.registerForFree")}</h1>
          <ul className="text-sm text-gray-700 space-y-1 mb-5">
            <li>• {t("register.listYourCar")}</li>
            <li>• {t("register.autoSearchesSave")}</li>
            <li>• {t("register.viewAutoReminder")}</li>
          </ul>

          {/* Retailer link */}
          <button type="button" className="w-full border border-[#1166a8] text-[#1166a8] text-sm font-medium rounded-md py-2 mb-4 hover:bg-[#1166a80a] transition-colors">
            {t("register.areYouRetailer")}
          </button>

          {/* Error message */}
          {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">{error}</div>}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label htmlFor="username" className="block text-sm font-medium text-gray-800">
                {t("register.username")} <span className="text-red-500">*</span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder={t("register.usernamePlaceholder")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                {t("register.emailAddress")} <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t("register.emailPlaceholder")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                {t("register.password")} <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder={t("register.passwordPlaceholder")}
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
              <p className="text-xs text-gray-500 mt-0.5">{t("register.passwordHint")}</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
                {t("register.confirmPassword")} <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder={t("register.confirmPasswordPlaceholder")}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8] ${confirmPassword && password !== confirmPassword ? "border-red-400" : "border-gray-300"}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-600 mt-0.5">{t("register.passwordsDoNotMatch")}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-800">
                  {t("register.phoneNumber")}
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder={t("register.phonePlaceholder")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-[#1166a8]"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="location" className="block text-sm font-medium text-gray-800">
                  {t("register.location")}
                </label>
                <input
                  id="location"
                  type="text"
                  autoComplete="address-level2"
                  placeholder={t("register.locationPlaceholder")}
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
              {loading ? t("register.creatingAccount") : t("register.continueViaEmail")}
            </button>
          </form>

          {/* Separator */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-xs text-gray-500">{t("register.or")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons – UI only for now */}
          <div className="space-y-2">
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">G</span>
              <span>{t("register.continueWithGoogle")}</span>
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base">f</span>
              <span>{t("register.continueWithFacebook")}</span>
            </button>
            <button
              type="button"
              className="w-full border border-gray-300 rounded-md py-2.5 text-sm font-medium text-gray-800 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg"></span>
              <span>{t("register.continueWithApple")}</span>
            </button>
          </div>

          {/* Already have account – optional */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            {t("register.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-[#1166a8] hover:underline">
              {t("register.logIn")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
