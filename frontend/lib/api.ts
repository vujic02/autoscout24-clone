const API_BASE = "http://127.0.0.1:8000";

export type ListingImage = {
  id: number;
  image: string;
  created_at: string;
};

export type Listing = {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  registration_year: number;
  mileage: number;
  price: number;
  fuel_type: string;
  country: string;
  city: string;
  description: string | null;
  main_image: string | null;
  images?: ListingImage[];
  status: string;
  created_at: string;
};

export type ListingFilters = {
  make?: string;
  model?: string;
  price?: string; // max price
  registration?: string; // year
  country?: string;
  fuel_type?: string;
  featured?: string;
  page?: string;
};

export type PaginatedResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Listing[];
};

function buildQuery(params: ListingFilters): string {
  const searchParams = new URLSearchParams();

  if (params.make) searchParams.set("make", params.make);
  if (params.model) searchParams.set("model", params.model);
  if (params.price) searchParams.set("price", params.price);
  if (params.registration) searchParams.set("registration", params.registration);
  if (params.country) searchParams.set("country", params.country);
  if (params.fuel_type) searchParams.set("fuel_type", params.fuel_type);
  if (params.featured) searchParams.set("featured", params.featured);
  if (params.page) searchParams.set("page", params.page);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function fetchListings(filters: ListingFilters = {}): Promise<PaginatedResponse> {
  const query = buildQuery(filters);

  const res = await fetch(`${API_BASE}/api/listings/${query}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch listings", res.status);
    throw new Error("Failed to fetch listings");
  }

  return res.json();
}
