import { useMemo, useState } from "react";
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
import { Edit3, Plus, Search, Trash2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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
import { usePricing } from "@/features/pricing/hooks/usePricing"; // Import your custom hook
import {
  PaperBoardPricingCreateUpdateDto,
  PaperBoardPricingResponseDto,
} from "./types";

export const PricingPage: React.FC = () => {
  // Use custom hook state management
  const { pricing, error, isLoading, fetchPricing } = usePricing();
  
  const [isSaving, setIsSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEntry, setSelectedEntry] = useState<PaperBoardPricingResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const form = useForm<PaperBoardPricingCreateUpdateDto>({
    defaultValues: {
      group: "",
      pType: "",
      vendor: "",
      itemCode: "",
      currcode: "",
      price_MT: undefined,
      price_Sheet: undefined,
      price_Pound: undefined,
      price_Bale: undefined,
      effectiveDate: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const openCreateSheet = () => {
    setFormMode("create");
    setSelectedEntry(null);
    reset({
      group: "",
      pType: "",
      vendor: "",
      itemCode: "",
      currcode: "",
      price_MT: undefined,
      price_Sheet: undefined,
      price_Pound: undefined,
      price_Bale: undefined,
      effectiveDate: "",
    });
    setSheetOpen(true);
  };

  const openEditSheet = (entry: PaperBoardPricingResponseDto) => {
    setFormMode("edit");
    setSelectedEntry(entry);
    reset({
      group: entry.group || "",
      pType: entry.pType,
      vendor: entry.vendor,
      itemCode: entry.itemCode,
      currcode: entry.currcode || "",
      price_MT: entry.price_MT,
      price_Sheet: entry.price_Sheet,
      price_Pound: entry.price_Pound,
      price_Bale: entry.price_Bale,
      effectiveDate: entry.effectiveDate?.split("T")[0] ?? "",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (values: PaperBoardPricingCreateUpdateDto) => {
    setIsSaving(true);
    try {
      if (formMode === "create") {
        await api.post<PaperBoardPricingResponseDto>("/PaperBoardPricing", values);
        window.alert("Pricing entry created successfully.");
      } else if (selectedEntry) {
        await api.put<PaperBoardPricingResponseDto>(
          `/PaperBoardPricing/${selectedEntry.itemCode}/${selectedEntry.vendor}/${selectedEntry.pType}`,
          values,
        );
        window.alert("Pricing entry updated successfully.");
      }
      await fetchPricing();
      setSheetOpen(false);
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to save pricing entry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (entry: PaperBoardPricingResponseDto) => {
    const confirmed = window.confirm(`Delete pricing entry ${entry.itemCode} / ${entry.vendor} / ${entry.pType}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/PaperBoardPricing/${entry.itemCode}/${entry.vendor}/${entry.pType}`);
      await fetchPricing(); // Reload cleanly via hook
      window.alert("Pricing entry deleted successfully.");
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to delete pricing entry.");
    }
  };

  const columns = useMemo<ColumnDef<PaperBoardPricingResponseDto>[]>(
    () => [
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "vendor", header: "Vendor" },
      { accessorKey: "pType", header: "PType" },
      { accessorKey: "currcode", header: "Currency" },
      { accessorKey: "price_MT", header: "Price / MT" },
      { accessorKey: "price_Sheet", header: "Price / Sheet" },
      { accessorKey: "price_Pound", header: "Price / Pound" },
      { accessorKey: "price_Bale", header: "Price / Bale" },
      {
        accessorKey: "effectiveDate",
        header: "Effective",
        cell: (info) => (info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : "—"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const entry = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openEditSheet(entry)}
                title="Edit pricing"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(entry)}
                title="Delete pricing"
              >
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
    data: pricing,
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Paper Board Pricing
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage pricing entries with search, sort, and edit dialogs.
            </p>
            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Input
                type="search"
                placeholder="Search pricing entries..."
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
              <span className="ml-2">New Pricing</span>
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={header.column.getCanSort() ? "cursor-pointer select-none" : undefined}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === "asc"
                        ? " ↑"
                        : header.column.getIsSorted() === "desc"
                        ? " ↓"
                        : null}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell className="h-24 text-center" colSpan={columns.length}>
                    {isLoading ? "Loading pricing entries..." : "No pricing entries match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
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
            <SheetTitle>{formMode === "create" ? "Create Pricing" : "Edit Pricing"}</SheetTitle>
            <SheetDescription>
              Provide configuration details below. Fields marked as required must be populated.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Item Code</span>
                <Input {...register("itemCode", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Vendor</span>
                <Input {...register("vendor", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>PType</span>
                <Input {...register("pType", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Currency</span>
                <Input {...register("currcode")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / MT</span>
                <Input type="number" step="0.01" {...register("price_MT", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Sheet</span>
                <Input type="number" step="0.01" {...register("price_Sheet", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Pound</span>
                <Input type="number" step="0.01" {...register("price_Pound", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Bale</span>
                <Input type="number" step="0.01" {...register("price_Bale", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Effective Date</span>
                <Input type="date" {...register("effectiveDate")} />
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