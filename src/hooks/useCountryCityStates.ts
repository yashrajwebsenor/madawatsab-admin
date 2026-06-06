import { useState } from "react";
import ENDPOINTS from "../api/endpoints";
import http from "@/api/http";

type Option = {
  id: number;
  name: string;
};

const useCountryCityStates = () => {
  const [countries, setCountries] = useState<Option[]>([]);
  const [states, setStates] = useState<Option[]>([]);
  const [cities, setCities] = useState<Option[]>([]);

  const fetchCountries = async () => {
    try {
      const res = await http.get(ENDPOINTS.CONFIGS.COUNTRIES);
      setCountries(res?.data ?? []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStates = async (countryId: string) => {
    if (!countryId) return;
    try {
      setStates([]);
      setCities([]);

      const res = await http.get(ENDPOINTS.CONFIGS.STATES(countryId));
      setStates(res?.data || []);
    } catch (error) {
      console.log("Error fetching states:", error);
    }
  };

  const fetchCities = async (countryId: string, stateId: string) => {
    if (!countryId || !stateId) return;
    try {
      setCities([]);
      const res = await http.get(ENDPOINTS.CONFIGS.CITIES(countryId, stateId));
      setCities(res?.data || []);
    } catch (error) {
      console.log("Error fetching cities:", error);
    }
  };

  return {
    countries,
    states,
    cities,
    fetchCountries,
    fetchStates,
    fetchCities,
  };
};

export default useCountryCityStates;
