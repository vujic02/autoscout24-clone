"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Shield, Package, Building2, Plus, X, Clock, CheckCircle2, XCircle, ImageIcon, MessageSquare } from "lucide-react";
import {
  fetchCurrentUser,
  updateProfile,
  requestDealerAccount,
  updateDealerProfile,
  addDealerPhone,
  removeDealerPhone,
  addDealerAddress,
  removeDealerAddress,
  requestMoreListings,
  AuthUser,
} from "@/lib/api";
import Image from "next/image";

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Dealer fields
  const [companyName, setCompanyName] = useState("");
  const [newPhoneLabel, setNewPhoneLabel] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressValue, setNewAddressValue] = useState("");
  const [dealerSaving, setDealerSaving] = useState(false);
  const [requestingDealer, setRequestingDealer] = useState(false);
  const [showLimitRequestForm, setShowLimitRequestForm] = useState(false);
  const [limitRequestMessage, setLimitRequestMessage] = useState("");
  const [limitRequestSending, setLimitRequestSending] = useState(false);

  const getToken = () => localStorage.getItem("authToken");

  const syncUser = (data: AuthUser) => {
    setUser(data);
    localStorage.setItem("authUser", JSON.stringify(data));
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const data = await fetchCurrentUser(token);
        setUser(data);
        setDisplayName(data.profile.display_name);
        setPhone(data.profile.phone);
        setLocation(data.profile.location);
        setCompanyName(data.profile.company_name);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const token = getToken();
    if (!token) return;

    try {
      const updated = await updateProfile(token, {
        display_name: displayName,
        phone,
        location,
      });
      syncUser(updated);
      setSuccess("Profile updated successfully.");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDealer = async () => {
    const token = getToken();
    if (!token) return;
    setRequestingDealer(true);
    setError("");
    setSuccess("");
    try {
      const updated = await requestDealerAccount(token);
      syncUser(updated);
      setSuccess("Dealer account request submitted. An admin will review it.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request dealer account.");
    } finally {
      setRequestingDealer(false);
    }
  };

  const handleSaveDealerProfile = async () => {
    const token = getToken();
    if (!token) return;
    setDealerSaving(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("company_name", companyName);
      const fileInput = document.getElementById("companyImage") as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("company_image", fileInput.files[0]);
      }
      const updated = await updateDealerProfile(token, formData);
      syncUser(updated);
      setSuccess("Dealer profile updated.");
    } catch {
      setError("Failed to update dealer profile.");
    } finally {
      setDealerSaving(false);
    }
  };

  const handleAddPhone = async () => {
    const token = getToken();
    if (!token || !newPhoneNumber.trim()) return;
    setDealerSaving(true);
    try {
      const updated = await addDealerPhone(token, { label: newPhoneLabel, number: newPhoneNumber });
      syncUser(updated);
      setNewPhoneLabel("");
      setNewPhoneNumber("");
    } catch {
      setError("Failed to add phone.");
    } finally {
      setDealerSaving(false);
    }
  };

  const handleRemovePhone = async (id: number) => {
    const token = getToken();
    if (!token) return;
    try {
      const updated = await removeDealerPhone(token, id);
      syncUser(updated);
    } catch {
      setError("Failed to remove phone.");
    }
  };

  const handleAddAddress = async () => {
    const token = getToken();
    if (!token || !newAddressValue.trim()) return;
    setDealerSaving(true);
    try {
      const updated = await addDealerAddress(token, { label: newAddressLabel, address: newAddressValue });
      syncUser(updated);
      setNewAddressLabel("");
      setNewAddressValue("");
    } catch {
      setError("Failed to add address.");
    } finally {
      setDealerSaving(false);
    }
  };

  const handleRemoveAddress = async (id: number) => {
    const token = getToken();
    if (!token) return;
    try {
      const updated = await removeDealerAddress(token, id);
      syncUser(updated);
    } catch {
      setError("Failed to remove address.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="max-w-xl w-full bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-transparent text-sm";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
  const isDealer = user.profile.seller_type === "dealer";
  const dealerStatus = user.profile.dealer_request_status;

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-xl w-full space-y-6">
        {/* Main Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>

          {/* Account Info (read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h2>
            <div className="flex items-center gap-2 text-sm">
              <User size={16} className="text-gray-400" />
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{user.username}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail size={16} className="text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            {user.is_staff && (
              <div className="flex items-center gap-2 text-sm">
                <Shield size={16} className="text-blue-500" />
                <span className="font-medium text-blue-600">Staff / Admin</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Package size={16} className="text-gray-400" />
              <span className="text-gray-600">Listing quota:</span>
              <span className="font-medium">
                {user.listing_quota.max === null ? `${user.listing_quota.used} used (unlimited)` : `${user.listing_quota.used} / ${user.listing_quota.max} used`}
              </span>
            </div>

            {/* Request More Listings (dealers only) */}
            {isDealer && user.listing_quota.max !== null && (
              <div className="pt-1">
                {!showLimitRequestForm ? (
                  <button
                    onClick={() => setShowLimitRequestForm(true)}
                    className="flex items-center gap-1.5 text-sm text-[#1166a8] hover:text-[#0e568f] font-medium transition-colors"
                  >
                    <MessageSquare size={14} /> Request more listings
                  </button>
                ) : (
                  <div className="space-y-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <textarea
                      value={limitRequestMessage}
                      onChange={(e) => setLimitRequestMessage(e.target.value)}
                      placeholder="Explain why you need more listings..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1166a8] focus:border-transparent text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          const token = getToken();
                          if (!token || !limitRequestMessage.trim()) return;
                          setLimitRequestSending(true);
                          setError("");
                          try {
                            await requestMoreListings(token, limitRequestMessage);
                            setSuccess("Your request has been sent to the admin team.");
                            setShowLimitRequestForm(false);
                            setLimitRequestMessage("");
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to send request.");
                          } finally {
                            setLimitRequestSending(false);
                          }
                        }}
                        disabled={limitRequestSending || !limitRequestMessage.trim()}
                        className="bg-[#1166a8] hover:bg-[#0e568f] disabled:opacity-50 text-white text-sm font-medium rounded-md px-4 py-1.5 transition-colors"
                      >
                        {limitRequestSending ? "Sending..." : "Send Request"}
                      </button>
                      <button
                        onClick={() => {
                          setShowLimitRequestForm(false);
                          setLimitRequestMessage("");
                        }}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-gray-600">Account type:</span>
              <span className={`font-medium ${isDealer ? "text-emerald-600" : "text-gray-900"}`}>{isDealer ? "Dealer" : "Private Seller"}</span>
            </div>
          </div>

          {/* Editable Profile */}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md text-sm">{success}</div>}

          <form onSubmit={handleSave} className="space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Contact Information</h2>

            <div>
              <label htmlFor="displayName" className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" /> Display Name
                </span>
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How buyers will see your name"
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="phone" className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-gray-400" /> Phone Number
                </span>
              </label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 123 456789" className={inputClasses} />
            </div>

            <div>
              <label htmlFor="location" className={labelClasses}>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-gray-400" /> Location
                </span>
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Munich, Germany"
                className={inputClasses}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#1166a8] hover:bg-[#0e568f] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md py-2.5 transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Dealer Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Building2 size={20} /> Dealer Account
          </h2>

          {/* Private seller — can request dealer */}
          {!isDealer && dealerStatus === "none" && (
            <div className="text-center py-6">
              <p className="text-gray-600 text-sm mb-4">
                Upgrade to a dealer account to add company details, multiple phone numbers, and multiple addresses to your profile.
              </p>
              <button
                onClick={handleRequestDealer}
                disabled={requestingDealer}
                className="bg-[#f5f200] hover:bg-[#e0dd00] disabled:opacity-60 text-[#1c1c2e] text-sm font-medium rounded-md px-6 py-2.5 transition-colors"
              >
                {requestingDealer ? "Submitting..." : "Request Dealer Account"}
              </button>
            </div>
          )}

          {/* Pending request */}
          {!isDealer && dealerStatus === "pending" && (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Clock size={20} className="text-yellow-600 shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Request Pending</p>
                <p className="text-sm text-yellow-700">Your dealer account request is being reviewed by an admin.</p>
              </div>
            </div>
          )}

          {/* Rejected request */}
          {!isDealer && dealerStatus === "rejected" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle size={20} className="text-red-600 shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Request Rejected</p>
                  <p className="text-sm text-red-700">Your dealer account request was rejected. You can submit a new request.</p>
                </div>
              </div>
              <button
                onClick={handleRequestDealer}
                disabled={requestingDealer}
                className="bg-[#f5f200] hover:bg-[#e0dd00] disabled:opacity-60 text-[#1c1c2e] text-sm font-medium rounded-md px-6 py-2.5 transition-colors"
              >
                {requestingDealer ? "Submitting..." : "Request Again"}
              </button>
            </div>
          )}

          {/* Approved dealer — show full dealer management */}
          {isDealer && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">Approved Dealer Account</span>
              </div>

              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Company Info</h3>
                <div>
                  <label htmlFor="companyName" className={labelClasses}>
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="companyImage" className={labelClasses}>
                    <span className="flex items-center gap-1.5">
                      <ImageIcon size={14} className="text-gray-400" /> Company Image / Logo
                    </span>
                  </label>
                  {user.profile.company_image && (
                    <div className="mb-2 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <Image src={`http://127.0.0.1:8000${user.profile.company_image}`} alt="Company" fill className="object-cover" />
                    </div>
                  )}
                  <input id="companyImage" type="file" accept="image/*" className="text-sm text-gray-600" />
                </div>
                <button
                  onClick={handleSaveDealerProfile}
                  disabled={dealerSaving}
                  className="bg-[#1166a8] hover:bg-[#0e568f] disabled:opacity-60 text-white text-sm font-medium rounded-md px-5 py-2 transition-colors"
                >
                  {dealerSaving ? "Saving..." : "Save Company Info"}
                </button>
              </div>

              {/* Dealer Phones */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Phone Numbers</h3>
                {user.profile.dealer_phones?.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      {p.label && <span className="text-xs text-gray-500 font-medium">{p.label}: </span>}
                      <span className="text-sm font-medium">{p.number}</span>
                    </div>
                    <button onClick={() => handleRemovePhone(p.id)} className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors" title="Remove">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPhoneLabel}
                    onChange={(e) => setNewPhoneLabel(e.target.value)}
                    placeholder="Label (e.g. Sales)"
                    className={`${inputClasses} w-1/3`}
                  />
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="Phone number"
                    className={`${inputClasses} flex-1`}
                  />
                  <button
                    onClick={handleAddPhone}
                    disabled={!newPhoneNumber.trim() || dealerSaving}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-md transition-colors"
                    title="Add phone"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Dealer Addresses */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Addresses</h3>
                {user.profile.dealer_addresses?.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      {a.label && <span className="text-xs text-gray-500 font-medium">{a.label}: </span>}
                      <span className="text-sm font-medium">{a.address}</span>
                    </div>
                    <button onClick={() => handleRemoveAddress(a.id)} className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors" title="Remove">
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                    placeholder="Label (e.g. Showroom)"
                    className={`${inputClasses} w-1/3`}
                  />
                  <input
                    type="text"
                    value={newAddressValue}
                    onChange={(e) => setNewAddressValue(e.target.value)}
                    placeholder="Full address"
                    className={`${inputClasses} flex-1`}
                  />
                  <button
                    onClick={handleAddAddress}
                    disabled={!newAddressValue.trim() || dealerSaving}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-md transition-colors"
                    title="Add address"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
