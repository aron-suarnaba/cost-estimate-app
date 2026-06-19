import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PaperBoardPricingResponseDto } from "@/features/pricing/types";

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
      // Enhanced error handling to capture exact C# exception details if available
      const serverErrorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Failed to load pricing.";

      setError(
        typeof serverErrorMessage === "object"
          ? JSON.stringify(serverErrorMessage)
          : serverErrorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return { pricing, error, isLoading, fetchPricing };
};