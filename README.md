<h1 align="center">
    <img src="https://www.autoscout24.nl/cms-content-assets/1tkbXrmTEPPaTFel6UxtLr-c0eb4849caa00accfa44b32e8da0a2ff-AutoScout24_primary_solid.png"
    width="200px"
    alt="Logo" />
</h1>

<h3 align="center">
  Next.js - Autoscout24 
</h3>

<p align="center">
  :pushpin: Autoscout24 clone website created using Next.js, Typescript &amp; Django REST Framework
</p>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/vujic02/autoscout24-clone.svg?color=yellow">

  <img alt="GitHub language top" src="https://img.shields.io/github/languages/top/vujic02/autoscout24-clone?color=yellow">

  <a href="https://www.nikolavujic.com/">
    <img alt="Made by vujic02" src="https://img.shields.io/badge/made%20by-vujic02-yellow">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-yellow">
</p>

<p align="center">
  <a href="#setup">Install and run</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#demo">Demo</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;<a href="#features">Features</a>
</p>

<h1 align="center" id="demo">💻 Demo</h1>

<div width="100%" align="center">
<img src="DEMO IMAGE LINK GOES HERE / GIF" height="400px" align="center" />
</div>

<h1 align="center" id="setup"> ⚙️ Setup (Local)</h1>

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (3.10+)

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install django djangorestframework django-cors-headers

# Run migrations
python manage.py migrate

# Create a superuser (for admin access)
python manage.py createsuperuser

# Start the server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

✨You're all set!✨

<h1 align="center" id="features"> 📋 Features</h1>

### Search & Browsing

- Advanced vehicle search with filters for make, model, price, mileage, fuel type, body type, transmission, drive type, color, and horsepower
- Sort results by price, date, mileage, or registration year
- Paginated search results
- Visual body-type category browser
- "Currently in Demand" featured vehicles section
- Last searches saved locally with thumbnails

<!-- <img src="SEARCH_BROWSING_GIF" alt="Search & Browsing" /> -->

### Vehicle Details

- Detailed listing pages with multi-image galleries
- Full vehicle specifications display
- Seller contact information
- View count tracking (once per user per 24h)
- Share listings via Facebook, email, print, or link copy

<!-- <img src="VEHICLE_DETAILS_GIF" alt="Vehicle Details" /> -->

### Favorites

- Save and manage favorite listings
- Real-time favorite status sync across pages

<!-- <img src="FAVORITES_GIF" alt="Favorites" /> -->

### Authentication & Profiles

- Register and login (by username or email)
- Token-based session management
- User profiles with display name, phone, and location

<!-- <img src="AUTH_PROFILES_GIF" alt="Authentication & Profiles" /> -->

### Listing Management

- Create, edit, and delete own listings
- Upload up to 20 images per listing (5MB each)
- Listing quotas enforced by account type

<!-- <img src="LISTING_MANAGEMENT_GIF" alt="Listing Management" /> -->

### Dealer System

- Request dealer account status
- Dealer profile with company name, logo, multiple phones, and addresses
- Higher listing limits with ability to request additional slots

<!-- <img src="DEALER_SYSTEM_GIF" alt="Dealer System" /> -->

### Admin Dashboard

- View and filter all listings
- Toggle featured status on any listing
- Approve/reject dealer requests
- Manage user listing limits
- Brand-level average price statistics

<!-- <img src="ADMIN_DASHBOARD_GIF" alt="Admin Dashboard" /> -->
