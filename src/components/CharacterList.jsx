import React, { useState, useEffect } from "react";
import { Film, Globe, User, Users } from "lucide-react";

export default function CharacterList({ characters, loading }) {
  const [detailedCharacters, setDetailedCharacters] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState({});

  const extractIdFromUrl = (url) => {
    const match = url?.match(/\/people\/(\d+)/);
    return match ? match[1] : null;
  };

  const proxify = (url) =>
    url.replace("https://www.swapi.tech/api", "http://localhost:5000/api");

  useEffect(() => {
    async function fetchDetails(char) {
      const id = extractIdFromUrl(char.url);
      if (!id || loadingDetails[id]) return;

      setLoadingDetails((prev) => ({ ...prev, [id]: true }));

      try {
        const res = await fetch(`http://localhost:5000/api/people/${id}`);
        const json = await res.json();
        const props = json.result.properties;

        // homeworld
        let homeworld = "Unknown";
        if (props.homeworld) {
          try {
            const hwRes = await fetch(proxify(props.homeworld));
            const hwJson = await hwRes.json();
            homeworld = hwJson.result.properties.name;
          } catch {
            console.log(121);
          }
        }

        // species
        let species = "Unknown";
        if (props.species && props.species.length > 0) {
          try {
            const spRes = await fetch(proxify(props.species[0]));
            const spJson = await spRes.json();
            species = spJson.result.properties.name;
          } catch {
            console.log(121);
            
          }
        }

        // films
        let films = [];
        if (props.films && props.films.length > 0) {
          const results = await Promise.allSettled(
            props.films.map(async (filmUrl) => {
              const filmRes = await fetch(proxify(filmUrl));
              const filmJson = await filmRes.json();
              return filmJson.result.properties.title;
            })
          );
          films = results.map((r) =>
            r.status === "fulfilled" ? r.value : "Unknown"
          );
        }

        setDetailedCharacters((prev) => [
          ...prev.filter((c) => c.uid !== id),
          {
            uid: id,
            name: props.name || char.name,
            height: props.height || "Unknown",
            mass: props.mass || "Unknown",
            homeworld,
            species,
            films,
          },
        ]);
      } catch (err) {
        console.error("Error fetching details:", err);
      } finally {
        setLoadingDetails((prev) => ({ ...prev, [id]: false }));
      }
    }

    characters.forEach(fetchDetails);
  }, [characters]);

  const getCharacter = (char) => {
    const id = extractIdFromUrl(char.url) || char.url;
    return (
      detailedCharacters.find((c) => c.uid === id) || {
        uid: id,
        name: char.name,
        height: loadingDetails[id] ? "Loading..." : "Unknown",
        mass: loadingDetails[id] ? "Loading..." : "Unknown",
        homeworld: loadingDetails[id] ? "Loading..." : "Unknown",
        species: loadingDetails[id] ? "Loading..." : "Unknown",
        films: loadingDetails[id] ? ["Loading..."] : ["Unknown"],
      }
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-lg bg-gray-800 animate-pulse h-40"
          />
        ))}
      </div>
    );
  }

  if (!characters.length)
    return <p className="text-gray-400">No characters found.</p>;

  return (
    <ul className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-4">
      {characters.map((char, index) => {
        const c = getCharacter(char);

        return (
          <li
            key={c.uid || index}
            className="bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-slate-800/60 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{c.name}</h2>
            <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent mb-4"></div>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-md">
                  <span className="font-medium">Height:</span> {c.height}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-md">
                  <span className="font-medium">Mass:</span> {c.mass}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-md">
                  <span className="font-medium">Homeworld:</span> {c.homeworld}
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-3 text-purple-400" />
                <span className="text-md">
                  <span className="font-medium">Species:</span> {c.species}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-start text-gray-300">
                  <Film className="w-4 h-4 mr-3 text-purple-400 mt-1.5" />
                  <div>
                    <span className="text-md font-medium">Films:</span>
                    <ul className="mt-1 space-y-1">
                      {c.films.map((film, i) => (
                        <li className="text-sm text-gray-400" key={i}>
                          {film}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
