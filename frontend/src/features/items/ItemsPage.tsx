import React from 'react';
import { useItems } from '@/features/items/hooks/useItems';
import { ItemList } from '@/features/items/components/ItemList'; 

export const ItemsPage: React.FC = () => {
  // 1. Fixed destructuring names to match hook returns exactly
  const { items, isLoading, error } = useItems();

  // 2. Handle the loading state accurately
  if (isLoading) {
    return (
      <div className="p-6 text-slate-500 flex items-center gap-2 font-mono text-sm">
        <span className="animate-pulse">Loading cost estimation data matrix...</span>
      </div>
    );
  }

  // 3. Optional but highly recommended: Handle server errors in the UI
  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 font-sans text-sm">
          <p className="font-semibold">System Diagnostics Alert</p>
          <p className="text-rose-600/90 text-xs mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">
        Cost Estimation Items
      </h1>
      <ItemList items={items} />
    </div>
  );
};