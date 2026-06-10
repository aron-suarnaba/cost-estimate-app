import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { ItemResponseDto } from '@/features/items/types/item.types';

export const useItems = () => {
  const [items, setItems] = useState<ItemResponseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchItems = async () => {
    try {
      // Connects directly to your [HttpGet] ItemController endpoint
      const response = await api.get<ItemResponseDto[]>('/Item');
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items from backend:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return { items, loading, refreshItems: fetchItems };
};