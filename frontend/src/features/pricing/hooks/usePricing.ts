import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PaperBoardPricingResponseDto } from "../types";

export const usePricing = () => {
  const [pricing, setPricing] = useState<PaperBoardPricingResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PaperBoardPricingResponseDto[]>("/PaperBoardPricing");
      setPricing(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load pricing." );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return { pricing, error, isLoading, fetchPricing };
};
