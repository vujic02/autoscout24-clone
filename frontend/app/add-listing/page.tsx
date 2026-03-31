"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { carsMakeData, carsModelData, countries, fuelTypes, bodyTypes, transmissions, driveTypes, colors } from "@/utils/tabsStatic";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { fetchCurrentUser, ListingQuota } from "@/lib/api";

const AddListingPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");
  const isEditMode = !!listingId;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState<ListingQuota | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("petrol");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedDriveType, setSelectedDriveType] = useState("");
  const [selectedExteriorColor, setSelectedExteriorColor] = useState("");
  const [selectedInteriorColor, setSelectedInteriorColor] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    registration_year: new Date().getFullYear(),
    mileage: "",
    price: "",
    fuel_type: "petrol",
    body_type: "",
    transmission: "",
    drive_type: "",
    horsepower: "",
    engine_displacement: "",
    exterior_color: "",
    interior_color: "",
    number_of_doors: "",
    number_of_seats: "",
    previous_owners: "",
    country: "",
    city: "",
    description: "",
    images: [] as File[],
    main_image: null as File | null,
  });

  // Flatten makes from carsMakeData
  const allMakes = carsMakeData.flatMap((group) => group.options);
  const modelOptions = selectedMake ? (carsModelData as any)[selectedMake]?.options || [] : [];
  const countryOptions = countries[0]?.options || [];
  const fuelTypeOptions = fuelTypes[0]?.options || [];

  // Sync wrapper states with formData
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      make: selectedMake,
      model: selectedModel,
      country: selectedCountry,
      fuel_type: selectedFuel,
      body_type: selectedBodyType,
      transmission: selectedTransmission,
      drive_type: selectedDriveType,
      exterior_color: selectedExteriorColor,
      interior_color: selectedInteriorColor,
    }));
  }, [
    selectedMake,
    selectedModel,
    selectedCountry,
    selectedFuel,
    selectedBodyType,
    selectedTransmission,
    selectedDriveType,
    selectedExteriorColor,
    selectedInteriorColor,
  ]);

  // Check auth + listing quota on mount
  useEffect(() => {
    const checkQuota = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const user = await fetchCurrentUser(token);
        setQuota(user.listing_quota);
      } catch {
        router.push("/login");
      } finally {
        if (!isEditMode) setPageLoading(false);
      }
    };
    checkQuota();
  }, [router, isEditMode]);

  // Fetch listing data for edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchListing = async () => {
      try {
        setPageLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("You must be logged in to edit a listing");
        }

        const res = await fetch(`http://127.0.0.1:8000/api/listings/${listingId}/`, {
          method: "GET",
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch listing");
        }

        const data = await res.json();

        // Prefill form data
        setFormData({
          title: data.title || "",
          make: data.make || "",
          model: data.model || "",
          year: data.year || new Date().getFullYear(),
          registration_year: data.registration_year || new Date().getFullYear(),
          mileage: data.mileage || "",
          price: data.price || "",
          fuel_type: data.fuel_type || "petrol",
          body_type: data.body_type || "",
          transmission: data.transmission || "",
          drive_type: data.drive_type || "",
          horsepower: data.horsepower || "",
          engine_displacement: data.engine_displacement || "",
          exterior_color: data.exterior_color || "",
          interior_color: data.interior_color || "",
          number_of_doors: data.number_of_doors || "",
          number_of_seats: data.number_of_seats || "",
          previous_owners: data.previous_owners ?? "",
          country: data.country || "",
          city: data.city || "",
          description: data.description || "",
          images: [],
          main_image: null,
        });

        // Sync wrapper states for edit mode
        setSelectedMake(data.make || "");
        setSelectedModel(data.model || "");
        setSelectedCountry(data.country || "");
        setSelectedFuel(data.fuel_type || "petrol");
        setSelectedBodyType(data.body_type || "");
        setSelectedTransmission(data.transmission || "");
        setSelectedDriveType(data.drive_type || "");
        setSelectedExteriorColor(data.exterior_color || "");
        setSelectedInteriorColor(data.interior_color || "");

        // Set existing images
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images.map((img: any) => img.image));
        } else if (data.main_image) {
          setExistingImages([data.main_image]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [isEditMode, listingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numericFields = ["mileage", "price", "year", "registration_year", "horsepower", "engine_displacement", "number_of_doors", "number_of_seats", "previous_owners"];
    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value ? Number(value) : "") : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }));

      // Create previews
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to create a listing");
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("make", formData.make);
      formDataToSend.append("model", formData.model);
      formDataToSend.append("year", String(formData.year));
      formDataToSend.append("registration_year", String(formData.registration_year));
      formDataToSend.append("mileage", String(formData.mileage));
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("fuel_type", formData.fuel_type.toLowerCase());
      if (formData.body_type) formDataToSend.append("body_type", formData.body_type.toLowerCase());
      if (formData.transmission) formDataToSend.append("transmission", formData.transmission.toLowerCase());
      if (formData.drive_type) formDataToSend.append("drive_type", formData.drive_type.toLowerCase());
      if (formData.horsepower) formDataToSend.append("horsepower", String(formData.horsepower));
      if (formData.engine_displacement) formDataToSend.append("engine_displacement", String(formData.engine_displacement));
      if (formData.exterior_color) formDataToSend.append("exterior_color", formData.exterior_color.toLowerCase());
      if (formData.interior_color) formDataToSend.append("interior_color", formData.interior_color.toLowerCase());
      if (formData.number_of_doors) formDataToSend.append("number_of_doors", String(formData.number_of_doors));
      if (formData.number_of_seats) formDataToSend.append("number_of_seats", String(formData.number_of_seats));
      if (formData.previous_owners !== "") formDataToSend.append("previous_owners", String(formData.previous_owners));
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("description", formData.description);

      // Append multiple images
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Keep main_image for backward compatibility if needed
      if (formData.images.length > 0) {
        formDataToSend.append("main_image", formData.images[0]);
      }

      const method = isEditMode ? "PUT" : "POST";
      const url = isEditMode ? `http://127.0.0.1:8000/api/listings/${listingId}/` : "http://127.0.0.1:8000/api/listings/";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formDataToSend,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.detail || JSON.stringify(responseData) || `Failed to ${isEditMode ? "update" : "create"} listing`);
      }

      router.push(isEditMode ? `/vehicle/${listingId}` : "/");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show quota exceeded message for non-edit mode
  if (!isEditMode && quota && quota.remaining !== null && quota.remaining <= 0) {
    return (
      <main className="flex min-h-screen flex-col items-center p-8">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="flex items-center gap-3 mb-6 justify-center">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold">Listing Limit Reached</h1>
          </div>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">
            <p className="font-medium mb-1">You already have {quota.used} active listing(s).</p>
            <p className="text-sm">
              Regular users can have a maximum of {quota.max} active listing at a time. Please remove or deactivate your current listing before adding another.
            </p>
          </div>
          <Button onClick={() => router.push("/my-listings")} className="bg-black text-white hover:bg-gray-800">
            Go to My Listings
          </Button>
        </div>
      </main>
    );
  }

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Back">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold">{isEditMode ? "Edit Listing" : "Create a Listing"}</h1>
        </div>
        <p className="text-gray-600 mb-8 pl-12">{isEditMode ? "Update your vehicle details" : "Fill in the details of your vehicle"}</p>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className={labelClasses}>Vehicle Images</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {/* Display existing images */}
              {existingImages.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-600">Existing Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt="Existing" className="w-full h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Display new image previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-gray-600">New Images:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img src={preview} alt="Preview" className="w-full h-24 object-cover rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClasses}>
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., BMW 320d M Sport"
              className={inputClasses}
              required
            />
          </div>

          {/* Make and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Make</label>
              <CustomSelect data={carsMakeData} placeholder="Select a make" setSelectedOption={setSelectedMake} />
            </div>
            <div>
              <label className={labelClasses}>Model</label>
              <CustomSelect
                data={selectedMake ? [{ label: "Models", options: modelOptions }] : [{ label: "Models", options: [] }]}
                placeholder="Select a model"
                disabled={!selectedMake}
                setSelectedOption={setSelectedModel}
              />
            </div>
          </div>

          {/* Year and Registration Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className={labelClasses}>
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="registration_year" className={labelClasses}>
                Registration Year
              </label>
              <input
                type="number"
                id="registration_year"
                name="registration_year"
                value={formData.registration_year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Mileage and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="mileage" className={labelClasses}>
                Mileage (km)
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="e.g., 50000"
                min="0"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClasses}>
                Price (€)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 25000"
                min="0"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className={labelClasses}>Fuel Type</label>
            <CustomSelect data={fuelTypes} placeholder="Select fuel type" setSelectedOption={setSelectedFuel} />
          </div>

          {/* Body Type and Transmission */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Body Type</label>
              <CustomSelect data={bodyTypes} placeholder="Select body type" setSelectedOption={setSelectedBodyType} />
            </div>
            <div>
              <label className={labelClasses}>Transmission</label>
              <CustomSelect data={transmissions} placeholder="Select transmission" setSelectedOption={setSelectedTransmission} />
            </div>
          </div>

          {/* Drive Type */}
          <div>
            <label className={labelClasses}>Drive Type</label>
            <CustomSelect data={driveTypes} placeholder="Select drive type" setSelectedOption={setSelectedDriveType} />
          </div>

          {/* Horsepower and Engine Displacement */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="horsepower" className={labelClasses}>
                Horsepower (hp)
              </label>
              <input
                type="number"
                id="horsepower"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleInputChange}
                placeholder="e.g., 150"
                min="0"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="engine_displacement" className={labelClasses}>
                Engine Displacement (cc)
              </label>
              <input
                type="number"
                id="engine_displacement"
                name="engine_displacement"
                value={formData.engine_displacement}
                onChange={handleInputChange}
                placeholder="e.g., 1998"
                min="0"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Exterior and Interior Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Exterior Color</label>
              <CustomSelect data={colors} placeholder="Select exterior color" setSelectedOption={setSelectedExteriorColor} />
            </div>
            <div>
              <label className={labelClasses}>Interior Color</label>
              <CustomSelect data={colors} placeholder="Select interior color" setSelectedOption={setSelectedInteriorColor} />
            </div>
          </div>

          {/* Doors, Seats, Previous Owners */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="number_of_doors" className={labelClasses}>
                Doors
              </label>
              <input
                type="number"
                id="number_of_doors"
                name="number_of_doors"
                value={formData.number_of_doors}
                onChange={handleInputChange}
                placeholder="e.g., 4"
                min="2"
                max="5"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="number_of_seats" className={labelClasses}>
                Seats
              </label>
              <input
                type="number"
                id="number_of_seats"
                name="number_of_seats"
                value={formData.number_of_seats}
                onChange={handleInputChange}
                placeholder="e.g., 5"
                min="1"
                max="9"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="previous_owners" className={labelClasses}>
                Previous Owners
              </label>
              <input
                type="number"
                id="previous_owners"
                name="previous_owners"
                value={formData.previous_owners}
                onChange={handleInputChange}
                placeholder="e.g., 1"
                min="0"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Country</label>
              <CustomSelect data={countries} placeholder="Select a country" setSelectedOption={setSelectedCountry} />
            </div>
            <div>
              <label htmlFor="city" className={labelClasses}>
                City
              </label>
              <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g., Munich" className={inputClasses} required />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add any additional details about the vehicle..."
              rows={5}
              className={inputClasses}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update Listing" : "Create Listing"}
            </Button>
            <Button type="button" onClick={() => router.back()} className="flex-1 bg-gray-200 text-black py-3 rounded-md font-medium hover:bg-gray-300 transition-colors">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AddListingPage;
