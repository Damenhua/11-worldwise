import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = import.meta.env.DEV
  ? "http://localhost:9000/cities" // 本地開發
  : "/.netlify/functions/cities"; // 生產環境

const CitiesContext = createContext();

const initialState = {
  cities: JSON.parse(localStorage.getItem("cities")) || [],
  loading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true };

    case "cities/loaded":
      localStorage.setItem("cities", JSON.stringify(action.payload));

      return { ...state, loading: false, cities: action.payload };

    case "currentCity/loaded":
      return { ...state, loading: false, currentCity: action.payload };

    case "city/created": {
      const newCities = [...state.cities, action.payload];
      localStorage.setItem("cities", JSON.stringify(newCities));
      return {
        ...state,
        loading: false,
        cities: newCities,
        currentCity: action.payload,
      };
    }

    case "city/deleted": {
      const filteredCities = state.cities.filter(
        (city) => city.id !== action.payload
      );
      localStorage.setItem("cities", JSON.stringify(filteredCities));

      return {
        ...state,
        loading: false,
        cities: filteredCities,
        currentCity: {},
      };
    }

    case "rejected":
      return { ...state, loading: false, error: action.payload };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, loading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}`);
        if (!res.ok) throw new Error("Failed to fetch cities");

        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data",
        });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (Number(id) === currentCity.id) return;

      dispatch({ type: "loading" });

      try {
        const res = await fetch(`${BASE_URL}/${id}`);
        if (!res.ok) throw new Error(`City with id ${id} not found`);

        const data = await res.json();
        dispatch({ type: "currentCity/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading current city",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        loading,
        currentCity,
        getCity,
        error,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was outside of the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
