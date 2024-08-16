import { useState, useEffect } from "react";
import axios from "axios";

const useCustomDomains = () => {
  const [domains, setDomains] = useState<{ domain: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getDomains = async () => {
      try {
        const response = await axios.get(
          "https://app-scissors-api.onrender.com/get-domains"
        );
        if (response.status === 200) {
          setDomains(response.data.domains);
        }
      } catch (error) {
        console.error("Error fetching domains:", error);
      } finally {
        setLoading(false);
      }
    };
    getDomains();
  }, []);

  const checkDomainAvailability = (domain: string) => {
    if (loading) return false; // Optionally handle loading state
    const sanitizedDomain = domain.replace(/^https?:\/\//, "");
    return !domains.some((d) => d.domain === sanitizedDomain);
  };

  return {
    domains,
    checkDomainAvailability,
  };
};

export default useCustomDomains;
