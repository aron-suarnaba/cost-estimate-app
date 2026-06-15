import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ColumnDef,
  flexRender,
  filterFns,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ItemCreateUpdateDto, ItemResponseDto } from "./types/item.types";

export const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<ItemResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<ItemResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const form = useForm<ItemCreateUpdateDto>({
    defaultValues: {
      itemCode: "",
      itemDesc: "",
      prodGroup: "",
      pType: "",
      um: "",
      gsm: undefined,
      caliper: undefined,
      ppr: undefined,
      width: undefined,
      length: undefined,
    },
  });

  const { register, handleSubmit, reset } = form;

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ItemResponseDto[]>("/Item");
      setItems(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateSheet = () => {
    setFormMode("create");
    setSelectedItem(null);
    reset({
      itemCode: "",
      itemDesc: "",
      prodGroup: "",
      pType: "",
      um: "",
      gsm: undefined,
      caliper: undefined,
      ppr: undefined,
      width: undefined,
      length: undefined,
    });
    setSheetOpen(true);
  };

  const openEditSheet = (item: ItemResponseDto) => {
    setFormMode("edit");
    setSelectedItem(item);
    reset({
      itemCode: item.itemCode,
      itemDesc: item.itemDesc || "",
      prodGroup: item.prodGroup || "",
      pType: item.pType || "",
      um: item.um || "",
      gsm: item.gsm,
      caliper: item.caliper,
      ppr: item.ppr,
      width: item.width,
      length: item.length,
    });
    setSheetOpen(true);
  };

  const onSubmit = async (values: ItemCreateUpdateDto) => {
    setIsSaving(true);
    try {
      if (formMode === "create") {
        await api.post<ItemResponseDto>("/Item", values);
        window.alert("Item created successfully.");
      } else if (selectedItem) {
        await api.put<ItemResponseDto>(`/Item/${selectedItem.itemCode}`, values);
        window.alert("Item updated successfully.");
      }
      await fetchItems();
      setSheetOpen(false);
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: ItemResponseDto) => {
    const confirmed = window.confirm(`Delete item ${item.itemCode}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/Item/${item.itemCode}`);
      setItems((current) => current.filter((i) => i.itemCode !== item.itemCode));
      window.alert("Item deleted successfully.");
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to delete item.");
    }
  };

  const columns = useMemo<ColumnDef<ItemResponseDto>[]>(
    () => [
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "itemDesc", header: "Description" },
      { accessorKey: "prodGroup", header: "Prod Group" },
      { accessorKey: "pType", header: "Type" },
      { accessorKey: "gsm", header: "GSM" },
      { accessorKey: "caliper", header: "Caliper" },
      { accessorKey: "width", header: "Width" },
      { accessorKey: "length", header: "Length" },
      { accessorKey: "um", header: "UOM" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="icon" onClick={() => openEditSheet(item)} title="Edit item">
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => handleDelete(item)} title="Delete item">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    filterFns: {
      includesString: filterFns.includesString,
    },
    globalFilterFn: filterFns.includesString,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cost Estimation Items</h1>
            <p className="text-sm text-slate-500 mt-1">Manage items with table search, sorting and dialog-based CRUD.</p>
            {error ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Input
                type="search"
                placeholder="Search items..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pr-10"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                <Search className="h-4 w-4" />
              </span>
            </div>
            <Button onClick={openCreateSheet} className="whitespace-nowrap">
              <Plus className="h-4 w-4" />
              <span className="ml-2">New Item</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortState = header.column.getIsSorted();
                    return (
                      <TableHead
                        key={header.id}
                        className={header.column.getCanSort() ? "cursor-pointer select-none" : undefined}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortState === "asc" ? " ↑" : sortState === "desc" ? " ↓" : null}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    {isLoading ? "Loading items..." : "No items match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{formMode === "create" ? "Create Item" : "Edit Item"}</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Item Code</span>
                <Input {...register("itemCode", { required: true })} disabled={formMode === "edit"} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Description</span>
                <Input {...register("itemDesc")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Prod Group</span>
                <Input {...register("prodGroup")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Type</span>
                <Input {...register("pType")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>UOM</span>
                <Input {...register("um")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>GSM</span>
                <Input type="number" step="0.1" {...register("gsm", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Caliper</span>
                <Input type="number" step="0.1" {...register("caliper", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>PPR</span>
                <Input type="number" step="0.1" {...register("ppr", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Width</span>
                <Input type="number" step="0.0001" {...register("width", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Length</span>
                <Input type="number" step="0.0001" {...register("length", { valueAsNumber: true })} />
              </label>
            </div>

            <SheetFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {formMode === "create" ? "Create" : "Save"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

