# 🌌 Star Wars Explorer

![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![Express](https://img.shields.io/badge/Backend-Express-green?logo=express)
![TailwindCSS](https://img.shields.io/badge/Style-TailwindCSS-38B2AC?logo=tailwind-css)
![API](https://img.shields.io/badge/API-SWAPI.tech-yellow)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

> **Explore Star Wars characters with enhanced details.**
> This app fetches data from [SWAPI.tech](https://www.swapi.tech/) and enriches it to display **films, species, homeworld** and more – all with **pagination**, **real-time search**, and a clean modern UI.

---

## 📖 Table of Contents

* [Overview](#-overview)
* [Features](#-features)
* [Architecture](#-architecture)
* [Data Flow](#-data-flow)
* [Pagination & Search](#-pagination--search)
* [Technologies](#-technologies)
* [Local Setup](#-local-setup)
* [Folder Structure](#-folder-structure)
* [API Endpoints](#-api-endpoints)
* [Error Handling](#-error-handling)
* [Performance Notes](#-performance-notes)
* [Roadmap](#-roadmap)
* [License](#-license)

---

## 📖 Overview

The **Star Wars Explorer** is a full-stack application designed to provide an intuitive interface for browsing Star Wars characters.
The app is powered by:

* A **Node.js + Express backend** that proxies and enriches data from [SWAPI.tech](https://www.swapi.tech/)
* A **React frontend** that displays character information with **local caching, search, and pagination**

The enrichment process involves fetching **homeworld, species, and film details**, since SWAPI provides these as separate URLs.

---

## ✨ Features

### Data Enrichment

* Show character **homeworld** name (resolved from homeworld URL)
* Show **species** name (resolved from species URL)
* Show **films** (resolved from each film URL)

### UI/UX

* **Pagination** (10 characters per page)
* **Real-time, client-side search** with:

  * Instant filtering of already-cached pages
  * Case-insensitive matching
* **Clean URLs**:

  * Page numbers and search terms are stored in state only (not added to URL)
* **Responsive dark theme** styled with Tailwind CSS
* Hover and animation effects for cards

### Performance

* Local caching of loaded pages for faster search
* Throttled parallel requests on backend
* Retry with exponential backoff for SWAPI rate-limits

---

## 🏗️ Architecture

### Frontend

* **Key Components:**

  * `Homepage` – manages state, fetches data
  * `CharacterList` – displays character cards
  * `Pagination` – handles page navigation
  * `SearchInput` – search bar
* **State Management:**

  * `characters` (current page)
  * `cachedCharacters` (for searching)
  * `searchTerm`, `page`, `totalPages`
* **Workflow:**

  * Fetches paginated data from backend
  * On search: filters the `cachedCharacters` locally

### Backend

* **Endpoints:**

  * `/api/people?page=&limit=` – proxy paginated list from SWAPI
  * `/api/:category/:id` – proxy to SWAPI details (e.g., films, species)
* **Features:**

  * Retry logic
  * Rate limit handling
  * Clean JSON responses

---

## 🔁 Data Flow

1. **Initial page request:**

   * Frontend requests `/api/people?page=1&limit=10`
   * Backend fetches data from SWAPI `/people?page=1&limit=10`
2. **Character enrichment:**

   * For each character:

     * Fetch `/api/people/:id` for detailed properties
     * Fetch **homeworld/species/films** by following URLs
3. **Search:**

   * The frontend stores loaded data in a local cache
   * Search queries filter only this local cache without new API calls

---

## 🔎 Pagination & Search

* **Pagination:**

  * Controlled entirely in React using a `Pagination` component
  * No page number in URL (state only)
* **Search:**

  * Works **only on already-loaded characters**
  * If you navigate multiple pages first, those pages are available in search results

> **Future enhancement:** Option to prefetch all characters at backend startup for global search.

---

## 🛠️ Technologies

### Frontend

* React (Hooks)
* Tailwind CSS
* Lucide React Icons

### Backend

* Node.js
* Express
* Axios (API calls)
* dotenv (configuration)

---

## ⚙️ Local Setup

### 1. Clone repository

```bash
git clone https://github.com/yourusername/star-wars-explorer.git
cd star-wars-explorer
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env # configure BASE_API if needed
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`
Backend runs at `http://localhost:5000`

---

## 📂 Folder Structure

```
star-wars-explorer/
  backend/
    index.js
    ...
  frontend/
    src/
      components/
        CharacterList.jsx
        Pagination.jsx
        SearchInput.jsx
      App.jsx
```

---

## 📡 API Endpoints

### `/api/people`

Fetches paginated characters from SWAPI.

Query params:

* `page`: page number (default: 1)
* `limit`: items per page (default: 10)

### `/api/:category/:id`

Generic proxy endpoint to fetch details for:

* `people/:id`
* `planets/:id`
* `species/:id`
* `films/:id`

---

## 🧱 Error Handling

* If enrichment fails (e.g., SWAPI timeout):

  * Show partial data
  * Missing values displayed as `Unknown`
* User-friendly messages:

  * “No characters found”
  * Skeleton loaders during fetching

---

## ⚡ Performance Notes

* **Client cache:**

  * Stores all previously fetched pages
  * Used **only for search**
  * Pagination always fetches fresh data from backend
* **Backend retry:**

  * Retries up to 5 times with increasing delays when SWAPI rate-limits

---

## 🛣 Roadmap

* [ ] Global search across all characters (backend prefetch)
* [ ] Sorting (alphabetical, height, etc.)
* [ ] Add character images (custom assets)
* [ ] Offline-first caching with IndexedDB

---

## 📜 License

This project is for educational purposes only.
All Star Wars data is provided by [SWAPI.tech](https://www.swapi.tech/).

---
