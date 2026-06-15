import { useEffect, useState } from "react";
import api from "@/lib/api"; 
import axios from "axios";

export interface Item {
  id: number;
  name: string;
  itemCode: string;
}

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    // Safety guard: If there's no token, don't even make the API call!
    if (!token) {
      setError("Not authenticated.");
      return;
    }

    const controller = new AbortController();

    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/Item", {
          signal: controller.signal,
        });
        setItems(response.data);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err)) {
          console.log("Request canceled safely");
        } else {
          console.error("Error fetching items from backend:", err);
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();

    return () => {
      controller.abort();
    };
  }, []);

  return { items, error, isLoading };
};