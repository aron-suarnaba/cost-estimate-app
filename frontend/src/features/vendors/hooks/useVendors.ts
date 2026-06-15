import { useEffect, useState } from "react";
import api from "@/lib/api";
import { VendorsResponseDto } from "@/features/vendors/types/vendors.types";

export const useVendors = () => {
  const [vendors, setVendors] = useState<VendorsResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<VendorsResponseDto[]>("/Vendors");
      setVendors(response.data || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load vendors.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return { vendors, setVendors, error, isLoading, fetchVendors };
};