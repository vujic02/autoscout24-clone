"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { carsMakeData, carsModelData, countries, fuelTypes, bodyTypes, transmissions, driveTypes, colors } from "@/utils/tabsStatic";
import CustomSelect from "@/components/ui/custom/Search/CustomSelect";
import { fetchCurrentUser, ListingQuota } from "@/lib/api";
import { useTranslation, usePageTitle } from "@/lib/i18n";
import { toast } from "sonner";

export default function AddListingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <AddListingContent />
    </Suspense>
  );
}

const AddListingContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");
  const isEditMode = !!listingId;
  usePageTitle(t(isEditMode ? "titles.editListing" : "titles.addListing"));

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [quota, setQuota] = useState<ListingQuota | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const hasUnsavedChanges = useRef(false);
  const isInitialSync = useRef(true);
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
    if (isInitialSync.current) {
      isInitialSync.current = false;
    } else {
      hasUnsavedChanges.current = true;
    }
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

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

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

        // Reset dirty flag after loading edit data
        setTimeout(() => {
          hasUnsavedChanges.current = false;
        }, 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing");
      } finally {
        setPageLoading(false);
      }
    };

    fetchListing();
  }, [isEditMode, listingId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    hasUnsavedChanges.current = true;
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
      hasUnsavedChanges.current = true;
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
    hasUnsavedChanges.current = true;
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeExistingImage = (index: number) => {
    hasUnsavedChanges.current = true;
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Frontend validation
    const currentYear = new Date().getFullYear();
    const validationErrors: string[] = [];

    if (!formData.title.trim()) validationErrors.push(t("addListing.titleRequired"));
    if (!formData.make) validationErrors.push(t("addListing.makeRequired"));
    if (!formData.model) validationErrors.push(t("addListing.modelRequired"));
    if (!formData.country) validationErrors.push(t("addListing.countryRequired"));
    if (!formData.city.trim()) validationErrors.push(t("addListing.cityRequired"));

    const price = Number(formData.price);
    if (!formData.price || price <= 0) validationErrors.push(t("addListing.pricePositive"));

    const mileage = Number(formData.mileage);
    if (!formData.mileage && formData.mileage !== 0) {
      validationErrors.push(t("addListing.mileageRequired"));
    } else if (mileage < 0) {
      validationErrors.push(t("addListing.mileageNonNegative"));
    }

    const year = Number(formData.year);
    if (year < 1900 || year > currentYear + 1) validationErrors.push(t("addListing.yearRange", { year: String(currentYear + 1) }));

    const regYear = Number(formData.registration_year);
    if (regYear < 1900 || regYear > currentYear + 1) validationErrors.push(t("addListing.registrationYearRange", { year: String(currentYear + 1) }));

    if (formData.horsepower && Number(formData.horsepower) < 0) validationErrors.push(t("addListing.horsepowerNonNegative"));
    if (formData.engine_displacement && Number(formData.engine_displacement) < 0) validationErrors.push(t("addListing.displacementNonNegative"));
    if (formData.number_of_doors && (Number(formData.number_of_doors) < 2 || Number(formData.number_of_doors) > 5)) validationErrors.push(t("addListing.doorsRange"));
    if (formData.number_of_seats && (Number(formData.number_of_seats) < 1 || Number(formData.number_of_seats) > 9)) validationErrors.push(t("addListing.seatsRange"));
    if (formData.previous_owners !== "" && Number(formData.previous_owners) < 0) validationErrors.push(t("addListing.previousOwnersNonNegative"));

    if (validationErrors.length > 0) {
      const msg = validationErrors.join(" ");
      setError(msg);
      toast.error(validationErrors[0]);
      setLoading(false);
      return;
    }

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

      hasUnsavedChanges.current = false;
      toast.success(isEditMode ? t("addListing.listingUpdated") : t("addListing.listingCreated"));
      router.push(isEditMode ? `/vehicle/${listingId}` : "/");
    } catch (err) {
      console.error("Error:", err);
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      toast.error(msg);
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
            <h1 className="text-3xl font-bold">{t("addListing.listingLimitReached")}</h1>
          </div>
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-md">
            <p className="font-medium mb-1">{t("addListing.alreadyHaveListings", { count: String(quota.used) })}</p>
            <p className="text-sm">{t("addListing.maxListingsMessage", { max: String(quota.max) })}</p>
          </div>
          <Button onClick={() => router.push("/my-listings")} className="bg-black text-white hover:bg-gray-800">
            {t("addListing.goToMyListings")}
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
          <h1 className="text-3xl font-bold">{isEditMode ? t("addListing.editListing") : t("addListing.createListing")}</h1>
        </div>
        <p className="text-gray-600 mb-8 pl-12">{isEditMode ? t("addListing.updateDetails") : t("addListing.fillDetails")}</p>

        {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className={labelClasses}>{t("addListing.vehicleImages")}</label>
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
                  <p className="text-sm font-medium text-gray-600">{t("addListing.existingImages")}</p>
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
                  <p className="text-sm font-medium text-gray-600">{t("addListing.newImages")}</p>
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
              {t("addListing.title")}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={t("addListing.titlePlaceholder")}
              className={inputClasses}
              required
            />
          </div>

          {/* Make and Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>{t("addListing.make")}</label>
              <CustomSelect data={carsMakeData} placeholder={t("addListing.selectMake")} setSelectedOption={setSelectedMake} />
            </div>
            <div>
              <label className={labelClasses}>{t("addListing.model")}</label>
              <CustomSelect
                data={selectedMake ? [{ label: "Models", options: modelOptions }] : [{ label: "Models", options: [] }]}
                placeholder={t("addListing.selectModel")}
                disabled={!selectedMake}
                setSelectedOption={setSelectedModel}
              />
            </div>
          </div>

          {/* Year and Registration Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className={labelClasses}>
                {t("addListing.year")}
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
                {t("addListing.registrationYear")}
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
                {t("addListing.mileageKm")}
              </label>
              <input
                type="number"
                id="mileage"
                name="mileage"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder={t("addListing.mileagePlaceholder")}
                min="0"
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClasses}>
                {t("addListing.priceEur")}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder={t("addListing.pricePlaceholder")}
                min="0"
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className={labelClasses}>{t("addListing.fuelType")}</label>
            <CustomSelect data={fuelTypes} placeholder={t("addListing.selectFuelType")} setSelectedOption={setSelectedFuel} />
          </div>

          {/* Body Type and Transmission */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>{t("addListing.bodyType")}</label>
              <CustomSelect data={bodyTypes} placeholder={t("addListing.selectBodyType")} setSelectedOption={setSelectedBodyType} />
            </div>
            <div>
              <label className={labelClasses}>{t("addListing.transmission")}</label>
              <CustomSelect data={transmissions} placeholder={t("addListing.selectTransmission")} setSelectedOption={setSelectedTransmission} />
            </div>
          </div>

          {/* Drive Type */}
          <div>
            <label className={labelClasses}>{t("addListing.driveType")}</label>
            <CustomSelect data={driveTypes} placeholder={t("addListing.selectDriveType")} setSelectedOption={setSelectedDriveType} />
          </div>

          {/* Horsepower and Engine Displacement */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="horsepower" className={labelClasses}>
                {t("addListing.horsepowerHp")}
              </label>
              <input
                type="number"
                id="horsepower"
                name="horsepower"
                value={formData.horsepower}
                onChange={handleInputChange}
                placeholder={t("addListing.horsepowerPlaceholder")}
                min="0"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="engine_displacement" className={labelClasses}>
                {t("addListing.engineDisplacementCc")}
              </label>
              <input
                type="number"
                id="engine_displacement"
                name="engine_displacement"
                value={formData.engine_displacement}
                onChange={handleInputChange}
                placeholder={t("addListing.engineDisplacementPlaceholder")}
                min="0"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Exterior and Interior Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>{t("addListing.exteriorColor")}</label>
              <CustomSelect data={colors} placeholder={t("addListing.selectExteriorColor")} setSelectedOption={setSelectedExteriorColor} />
            </div>
            <div>
              <label className={labelClasses}>{t("addListing.interiorColor")}</label>
              <CustomSelect data={colors} placeholder={t("addListing.selectInteriorColor")} setSelectedOption={setSelectedInteriorColor} />
            </div>
          </div>

          {/* Doors, Seats, Previous Owners */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="number_of_doors" className={labelClasses}>
                {t("addListing.doors")}
              </label>
              <input
                type="number"
                id="number_of_doors"
                name="number_of_doors"
                value={formData.number_of_doors}
                onChange={handleInputChange}
                placeholder={t("addListing.doorsPlaceholder")}
                min="2"
                max="5"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="number_of_seats" className={labelClasses}>
                {t("addListing.seats")}
              </label>
              <input
                type="number"
                id="number_of_seats"
                name="number_of_seats"
                value={formData.number_of_seats}
                onChange={handleInputChange}
                placeholder={t("addListing.seatsPlaceholder")}
                min="1"
                max="9"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="previous_owners" className={labelClasses}>
                {t("addListing.previousOwners")}
              </label>
              <input
                type="number"
                id="previous_owners"
                name="previous_owners"
                value={formData.previous_owners}
                onChange={handleInputChange}
                placeholder={t("addListing.previousOwnersPlaceholder")}
                min="0"
                className={inputClasses}
              />
            </div>
          </div>

          {/* Country and City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>{t("addListing.country")}</label>
              <CustomSelect data={countries} placeholder={t("addListing.selectCountry")} setSelectedOption={setSelectedCountry} />
            </div>
            <div>
              <label htmlFor="city" className={labelClasses}>
                {t("addListing.city")}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder={t("addListing.cityPlaceholder")}
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClasses}>
              {t("addListing.description")}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={t("addListing.descriptionPlaceholder")}
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
              {loading
                ? isEditMode
                  ? t("addListing.updating")
                  : t("addListing.creating")
                : isEditMode
                  ? t("addListing.updateListingBtn")
                  : t("addListing.createListingBtn")}
            </Button>
            <Button type="button" onClick={() => router.back()} className="flex-1 bg-gray-200 text-black py-3 rounded-md font-medium hover:bg-gray-300 transition-colors">
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};
