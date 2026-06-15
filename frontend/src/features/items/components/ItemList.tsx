import React from 'react';
import { ItemResponseDto } from '@/features/items/types/item.types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Importing Shadcn base components

interface ItemListProps {
  items: ItemResponseDto[];
}

export const ItemList: React.FC<ItemListProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg text-slate-500">
        No cost estimation items found in the database.
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="font-semibold text-slate-700">Item Code</TableHead>
            <TableHead className="font-semibold text-slate-700">Description</TableHead>
            <TableHead className="font-semibold text-slate-700">Prod Group</TableHead>
            <TableHead className="font-semibold text-slate-700">Type</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">GSM</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Caliper (pt)</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Width (in)</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Length (in)</TableHead>
            <TableHead className="font-semibold text-slate-700">UOM</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.itemCode} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-mono font-medium text-slate-900">{item.itemCode}</TableCell>
              <TableCell className="text-slate-600">{item.itemDesc || '—'}</TableCell>
              <TableCell className="text-slate-600">{item.prodGroup || '—'}</TableCell>
              <TableCell className="text-slate-600">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                  {item.pType || '—'}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-slate-600">{item.gsm ?? '—'}</TableCell>
              <TableCell className="text-right font-mono text-slate-600">{item.caliper ?? '—'}</TableCell>
              <TableCell className="text-right font-mono text-slate-600">
                {item.width ? item.width.toFixed(4) : '—'}
              </TableCell>
              <TableCell className="text-right font-mono text-slate-600">
                {item.length ? item.length.toFixed(4) : '—'}
              </TableCell>
              <TableCell className="text-slate-600">{item.um || '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};