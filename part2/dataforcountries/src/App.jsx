import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim() !== "") {
        const foundCountries = countries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        );
        if (foundCountries.length === 1) {
          setSelectedCountry(foundCountries[0]);
        } else {
          setSelectedCountry(null);
        }
      } else {
        setSelectedCountry(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, countries]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <form>
        Find Country <input value={search} onChange={handleInputChange} />
      </form>
      {selectedCountry ? (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area} km²</p>
          <img
            src={selectedCountry.flags.png}
            alt={`Flag of ${selectedCountry.name.common}`}
            style={{ height: "100px" }}
          />
          <p>
            Languages: {Object.values(selectedCountry.languages).join(", ")}
          </p>
        </div>
      ) : (
        search !== "" && (
          <div>
            {filteredCountries.length > 10 ? (
              <p>Too many matches, specify another filter</p>
            ) : filteredCountries.length > 0 ? (
              <div>
                {filteredCountries.map((country) => (
                  <p key={country.cca3}>{country.name.common}</p>
                ))}
              </div>
            ) : (
              <p>No countries found</p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default App;

