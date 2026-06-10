import React from 'react';
import { useItems } from '@/features/items/hooks/useItems';

// 🟢 Correct Path pointing directly to your new component
import { ItemList } from '@/features/items/components/ItemList'; 

export const ItemsPage: React.FC = () => {
  const { items, loading } = useItems();

  if (loading) return <div className="p-6 text-slate-500">Loading cost estimation items...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Cost Estimation Items</h1>
      <ItemList items={items} />
    </div>
  );
};