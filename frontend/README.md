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

<h1 align="center" id="features"> 📋 Features and solutions</h1>

- Filter vehicles by Make, Price, Model, Country
-
-
-
-
