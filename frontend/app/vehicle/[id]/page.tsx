"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Heart, Share2, Printer, Mail, Facebook, Link as LinkIcon, Eye, Phone, MapPin, User, Building2 } from "lucide-react";
import * as DropdownMenu from "@/components/ui/dropdown-menu";
import { Listing, SellerInfo } from "@/lib/api";
import Image from "next/image";

const VehicleDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:8000/api/listings/${params.id}/`, {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await res.json();
        setListing(data);

        // Record a unique view
        const token = localStorage.getItem("authToken");
        fetch(`http://127.0.0.1:8000/api/listings/${params.id}/view/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Token ${token}` } : {}),
          },
        })
          .then((r) => r.json())
          .then((d) => {
            setListing((prev) => (prev ? { ...prev, view_count: d.view_count } : prev));
          })
          .catch(() => {});
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.id]);

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-24"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </main>
    );
  }

  if (error || !listing) {
    return (
      <main className="max-w-6xl mx-auto py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 mb-4 hover:text-blue-800">
          <ArrowLeft width={20} /> Back
        </button>
        <div className="text-red-500">{error || "Listing not found"}</div>
      </main>
    );
  }

  return (
    <main className="max-w-[1100px] mx-auto py-8 min-h-screen">
      {/* Header with Back Button and Navigation */}
      <div className="mb-8 rounded-lg flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft size={20} />
          <span>Back to vehicle list</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white p-4 rounded-lg">
        {/* Left Side: Images and Details */}
        <div className="lg:col-span-2">
          {/* Main Image with Counter */}
          <div className="relative bg-white rounded-lg overflow-hidden mb-4 aspect-video">
            {listing.images && listing.images.length > 0 ? (
              <img
                src={listing.images[currentImageIndex]?.image || listing.main_image || "/bg404.png"}
                alt={`${listing.make} ${listing.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={listing.main_image || "/bg404.png"} alt={`${listing.make} ${listing.model}`} className="w-full h-full object-cover" />
            )}
            {listing.images && listing.images.length > 0 && (
              <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded text-sm font-medium">
                {currentImageIndex + 1} / {listing.images.length}
              </div>
            )}

            {/* Image Navigation Arrows */}
            {listing.images && listing.images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + (listing.images?.length || 0)) % (listing.images?.length || 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % (listing.images?.length || 1))}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-700 text-white p-2 rounded"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {listing.images && listing.images.length > 0 && (
            <div className="grid grid-cols-6 gap-2 mb-6">
              {listing.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                    idx === currentImageIndex ? "border-yellow-400" : "border-gray-300"
                  } hover:border-yellow-300 transition-colors`}
                >
                  <img src={img.image} alt={`thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Specifications Grid */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="border-r border-gray-200 pr-6">
                <p className="text-gray-600 text-sm mb-2">Mileage</p>
                <p className="text-xl font-semibold">{listing.mileage.toLocaleString()} km</p>
              </div>
              <div className="border-r border-gray-200 pr-6">
                <p className="text-gray-600 text-sm mb-2">Gearbox</p>
                <p className="text-xl font-semibold capitalize">{listing.transmission || "-"}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-2">First registration</p>
                <p className="text-xl font-semibold">{listing.registration_year}</p>
              </div>
              <div className="border-r border-gray-200 pr-6 pt-4">
                <p className="text-gray-600 text-sm mb-2">Fuel type</p>
                <p className="text-xl font-semibold capitalize">{listing.fuel_type}</p>
              </div>
              <div className="border-r border-gray-200 pr-6 pt-4">
                <p className="text-gray-600 text-sm mb-2">Power</p>
                <p className="text-xl font-semibold">{listing.horsepower ? `${listing.horsepower} hp` : "-"}</p>
              </div>
              <div className="pt-4">
                <p className="text-gray-600 text-sm mb-2">Seller</p>
                <p className="text-xl font-semibold capitalize">{listing.seller_type ? `${listing.seller_type} seller` : "-"}</p>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          {(listing.body_type ||
            listing.drive_type ||
            listing.exterior_color ||
            listing.interior_color ||
            listing.engine_displacement ||
            listing.number_of_doors ||
            listing.number_of_seats ||
            listing.previous_owners) && (
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {listing.body_type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Body type</span>
                    <span className="font-medium capitalize">{listing.body_type}</span>
                  </div>
                )}
                {listing.drive_type && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Drive type</span>
                    <span className="font-medium uppercase">{listing.drive_type}</span>
                  </div>
                )}
                {listing.engine_displacement && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Engine</span>
                    <span className="font-medium">{listing.engine_displacement.toLocaleString()} cc</span>
                  </div>
                )}
                {listing.exterior_color && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Exterior color</span>
                    <span className="font-medium capitalize">{listing.exterior_color}</span>
                  </div>
                )}
                {listing.interior_color && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Interior color</span>
                    <span className="font-medium capitalize">{listing.interior_color}</span>
                  </div>
                )}
                {listing.number_of_doors && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Doors</span>
                    <span className="font-medium">{listing.number_of_doors}</span>
                  </div>
                )}
                {listing.number_of_seats && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Seats</span>
                    <span className="font-medium">{listing.number_of_seats}</span>
                  </div>
                )}
                {listing.previous_owners !== null && listing.previous_owners !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Previous owners</span>
                    <span className="font-medium">{listing.previous_owners}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm">{listing.description}</p>
            </div>
          )}
        </div>

        {/* Right Side: Title, Price, and Actions */}
        <div className="lg:col-span-1">
          {/* Vehicle Title and Location */}
          <div className="bg-white rounded-lg p-6 mb-4">
            <h1 className="text-2xl font-bold mb-2">
              {listing.make} {listing.model}
            </h1>
            <p className="text-blue-600 font-medium mb-4">{listing.city}</p>

            {/* View Count */}
            <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
              <Eye size={16} />
              <span>
                {listing.view_count} {listing.view_count === 1 ? "view" : "views"}
              </span>
            </div>

            {/* Price */}
            <p className="text-4xl font-bold text-gray-900 mb-6">€ {listing.price.toLocaleString()}</p>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFavorite(!favorite)}
                className="flex items-center justify-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-xs"
                title="Add to favorites"
              >
                <Heart size={18} className={favorite ? "fill-red-500 text-red-500" : "text-gray-600"} />
                <span>Add to list</span>
              </button>

              <DropdownMenu.DropdownMenu modal={false}>
                <DropdownMenu.DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-xs">
                    <Share2 size={18} className="text-gray-600" />
                    <span>Share</span>
                  </button>
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent align="end">
                  <DropdownMenu.DropdownMenuLabel>Share offer</DropdownMenu.DropdownMenuLabel>
                  <DropdownMenu.DropdownMenuSeparator />
                  <DropdownMenu.DropdownMenuGroup>
                    <DropdownMenu.DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Mail size={16} /> Email
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <Facebook size={16} /> Facebook
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                      <LinkIcon size={16} /> Copy link
                    </DropdownMenu.DropdownMenuItem>
                  </DropdownMenu.DropdownMenuGroup>
                </DropdownMenu.DropdownMenuContent>
              </DropdownMenu.DropdownMenu>

              <button className="flex items-center justify-center gap-1 py-3 px-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-xs">
                <Printer size={18} className="text-gray-600" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Seller Info */}
          {listing.seller && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Seller</h3>
                {listing.seller.seller_type === "dealer" && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                    <Building2 size={12} /> Dealer
                  </span>
                )}
              </div>

              {/* Company info for dealers */}
              {listing.seller.seller_type === "dealer" && listing.seller.company_image && (
                <div className="mb-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                    <Image src={`http://127.0.0.1:8000${listing.seller.company_image}`} alt="Company" fill className="object-contain" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-gray-400" />
                  <span className="font-medium">
                    {listing.seller.seller_type === "dealer" && listing.seller.company_name
                      ? listing.seller.company_name
                      : listing.seller.display_name || listing.seller.username}
                  </span>
                </div>
                {listing.seller.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${listing.seller.phone}`} className="text-blue-600 hover:underline">
                      {listing.seller.phone}
                    </a>
                  </div>
                )}

                {/* Dealer extra phones */}
                {listing.seller.dealer_phones?.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${p.number}`} className="text-blue-600 hover:underline">
                      {p.number}
                    </a>
                    {p.label && <span className="text-xs text-gray-400">({p.label})</span>}
                  </div>
                ))}

                {listing.seller.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-700">{listing.seller.location}</span>
                  </div>
                )}

                {/* Dealer extra addresses */}
                {listing.seller.dealer_addresses?.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-gray-700">{a.address}</span>
                    {a.label && <span className="text-xs text-gray-400">({a.label})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Tip:</strong> Contact the seller to arrange a viewing. Never send money before seeing the vehicle.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VehicleDetailPage;
