import React, { useState, useEffect, useRef } from "react";
import SearchInput from "./SearchInput"; 
import CharacterList from "./CharacterList"; 
import Pagination from "./Pagination";

export default function Homepage() {
  const [characters, setCharacters] = useState([]);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const cacheRef = useRef({});

  const fetchWithRetry = async (url, retries = 3, delayMs = 2000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); 

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        return await res.json();
      } catch (err) {
        if (err.name === "AbortError") {
          if (i === retries - 1) throw new Error("Request timed out.");
        } else if (err.message.includes("429") && i < retries - 1) {
          await new Promise((res) => setTimeout(res, delayMs * (i + 1)));
        } else {
          throw err;
        }
      }
    }
  };

  const loadPage = async (page) => {
    setLoading(true);
    setError(null);

    try {
      if (cacheRef.current[page]) {
        setCharacters(cacheRef.current[page].results);
        setTotalPages(cacheRef.current[page].totalPages);
        setCurrentPage(page);
        setLoading(false);
        return;
      }

      const url = `https://star-war-explore-backend.onrender.com/api/people?page=${page}&limit=10`;
      const data = await fetchWithRetry(url);

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Invalid response format from API");
      }

      const totalRecords = data.total_records || 82;
      const totalPagesCalc = Math.ceil(totalRecords / 10);
      cacheRef.current[page] = {
        results: data.results,
        totalPages: totalPagesCalc,
      };

      setCharacters(data.results);
      setTotalPages(totalPagesCalc);
      setCurrentPage(page);
    } catch (err) {
      setError(`Failed to load characters: ${err.message}`);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCharacters(characters);
    } else {
      const allCachedResults = Object.values(cacheRef.current).flatMap(
        (pageData) => pageData.results || []
      );
      const filtered = allCachedResults.filter((char) =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchQuery, characters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      loadPage(currentPage - 1);
      setSearchQuery("");
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      loadPage(currentPage + 1);
      setSearchQuery("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-primary mb-6 flex justify-center text-center font-inter tracking-tight bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
          Star Wars Explorer
        </h1>

        <SearchInput onSearch={handleSearch} />

        {error && <p className="text-red-400 text-lg mb-4">{error}</p>}
        {loading && <p className="text-gray-400 text-lg mb-4 italic">Loading characters...</p>}
        {!loading && filteredCharacters.length === 0 && !error && (
          <p className="text-gray-400 text-lg mb-4">No characters found.</p>
        )}

        {!loading && filteredCharacters.length > 0 && (
          <CharacterList characters={filteredCharacters} loading={loading} />
        )}

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
