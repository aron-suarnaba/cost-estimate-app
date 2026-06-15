import { useEffect, useState } from "react";
import api from "@/lib/api";
import { PtypeResponseDto } from "../types/ptype.types";

export const usePtypes = () => {
  const [ptypes, setPtypes] = useState<PtypeResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPtypes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PtypeResponseDto[]>("/Ptype");
      setPtypes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load product types.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPtypes();
  }, []);

  return { ptypes, error, isLoading, fetchPtypes };
};
