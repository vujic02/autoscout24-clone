const API_BASE = "http://127.0.0.1:8000";

export type ListingImage = {
  id: number;
  image: string;
  created_at: string;
};

export type DealerPhone = {
  id: number;
  label: string;
  number: string;
};

export type DealerAddress = {
  id: number;
  label: string;
  address: string;
};

export type UserProfile = {
  display_name: string;
  phone: string;
  location: string;
  seller_type: "private" | "dealer";
  dealer_request_status: "none" | "pending" | "approved" | "rejected";
  company_name: string;
  company_image: string | null;
  dealer_phones?: DealerPhone[];
  dealer_addresses?: DealerAddress[];
};

export type ListingQuota = {
  max: number | null;
  used: number;
  remaining: number | null;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  token?: string;
  profile: UserProfile;
  listing_quota: ListingQuota;
};

export type SellerInfo = {
  username: string;
  display_name: string;
  phone: string;
  location: string;
  seller_type: "private" | "dealer";
  company_name: string;
  company_image: string | null;
  dealer_phones?: DealerPhone[];
  dealer_addresses?: DealerAddress[];
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
  body_type: string | null;
  transmission: string | null;
  drive_type: string | null;
  horsepower: number | null;
  engine_displacement: number | null;
  exterior_color: string | null;
  interior_color: string | null;
  number_of_doors: number | null;
  number_of_seats: number | null;
  previous_owners: number | null;
  seller_type: string | null;
  country: string;
  city: string;
  description: string | null;
  main_image: string | null;
  images?: ListingImage[];
  status: string;
  view_count: number;
  created_at: string;
  seller?: SellerInfo;
};

export type ListingFilters = {
  make?: string;
  model?: string;
  price?: string; // max price
  registration?: string; // year
  country?: string;
  fuel_type?: string;
  featured?: string;
  seller?: string;
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
  if (params.seller) searchParams.set("seller", params.seller);
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

export async function updateProfile(token: string, data: Partial<UserProfile>): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/profile/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
}

export async function fetchCurrentUser(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/current-user/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }

  return res.json();
}

export async function requestDealerAccount(token: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/request-dealer/`, {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
    },
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to request dealer account");
  }

  return res.json();
}

export async function updateDealerProfile(token: string, data: FormData): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/dealer-profile/`, {
    method: "PATCH",
    headers: {
      Authorization: `Token ${token}`,
    },
    body: data,
  });

  if (!res.ok) {
    throw new Error("Failed to update dealer profile");
  }

  return res.json();
}

export async function addDealerPhone(token: string, data: { label: string; number: string }): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/dealer-phones/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add dealer phone");
  }

  return res.json();
}

export async function removeDealerPhone(token: string, id: number): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/dealer-phones/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Failed to remove dealer phone");
  }

  return res.json();
}

export async function addDealerAddress(token: string, data: { label: string; address: string }): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/dealer-addresses/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to add dealer address");
  }

  return res.json();
}

export async function removeDealerAddress(token: string, id: number): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/api/auth/dealer-addresses/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) {
    throw new Error("Failed to remove dealer address");
  }

  return res.json();
}

export type DealerRequest = {
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  phone: string;
  location: string;
};

export async function fetchDealerRequests(token: string): Promise<DealerRequest[]> {
  const res = await fetch(`${API_BASE}/api/admin/dealer-requests/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch dealer requests");
  }

  return res.json();
}

export async function handleDealerRequest(token: string, userId: number, action: "approve" | "reject"): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/dealer-requests/${userId}/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ action }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to handle dealer request");
  }
}

export async function requestMoreListings(token: string, message: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/request-more-listings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to submit request");
  }
}

export type ListingLimitRequest = {
  id: number;
  user_id: number;
  username: string;
  email: string;
  display_name: string;
  company_name: string;
  current_limit: number;
  message: string;
  created_at: string;
};

export async function fetchListingLimitRequests(token: string): Promise<ListingLimitRequest[]> {
  const res = await fetch(`${API_BASE}/api/admin/listing-limit-requests/`, {
    method: "GET",
    headers: {
      Authorization: `Token ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch listing limit requests");
  }

  return res.json();
}

export async function updateUserListingLimit(token: string, userId: number, maxListings: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/admin/users/${userId}/listing-limit/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({ max_listings: maxListings }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Failed to update listing limit");
  }
}
