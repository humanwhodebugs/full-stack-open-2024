import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCountryDetails, setSelectedCountryDetails] = useState(null);

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
          setSelectedCountryDetails(foundCountries[0]);
          setShowDetails(true);
        } else {
          setSelectedCountry(null);
          setSelectedCountryDetails(null);
          setShowDetails(false);
        }
      } else {
        setSelectedCountry(null);
        setSelectedCountryDetails(null);
        setShowDetails(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, countries]);

  const handleInputChange = (event) => {
    setSearch(event.target.value);
  };

  const handleShowDetails = (country) => {
    setSelectedCountryDetails(country);
    setShowDetails(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <form>
        Find Country <input value={search} onChange={handleInputChange} />
      </form>
      {selectedCountryDetails && showDetails ? (
        <div>
          <h2>{selectedCountryDetails.name.common}</h2>
          <p>Capital: {selectedCountryDetails.capital}</p>
          <p>Area: {selectedCountryDetails.area} km²</p>
          <img
            src={selectedCountryDetails.flags.png}
            alt={`Flag of ${selectedCountryDetails.name.common}`}
            style={{ height: "100px" }}
          />
          <p>
            Languages:{" "}
            {Object.values(selectedCountryDetails.languages).join(", ")}
          </p>
          <button onClick={handleHideDetails}>Hide Details</button>
        </div>
      ) : (
        search !== "" && (
          <div>
            {filteredCountries.length > 10 ? (
              <p>Too many matches, specify another filter</p>
            ) : filteredCountries.length > 0 ? (
              <div>
                {filteredCountries.map((country) => (
                  <div key={country.cca3}>
                    <p>{country.name.common}</p>
                    {filteredCountries.length < 10 && (
                      <button onClick={() => handleShowDetails(country)}>
                        Show
                      </button>
                    )}
                  </div>
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

