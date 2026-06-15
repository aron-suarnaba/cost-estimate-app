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
import {
  PaperBoardPricingCreateUpdateDto,
  PaperBoardPricingResponseDto,
} from "./types";

export const PricingPage: React.FC = () => {
  const [pricing, setPricing] = useState<PaperBoardPricingResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEntry, setSelectedEntry] = useState<PaperBoardPricingResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const form = useForm<PaperBoardPricingCreateUpdateDto>({
    defaultValues: {
      Group: "",
      PType: "",
      Vendor: "",
      ItemCode: "",
      Currcode: "",
      Price_MT: undefined,
      Price_Sheet: undefined,
      Price_Pound: undefined,
      Price_Bale: undefined,
      EffectiveDate: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const fetchPricing = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PaperBoardPricingResponseDto[]>("/PaperBoardPricing");
      setPricing(response.data);
    //   setError(null);
    } catch (err: any) {
    //   setError(err.response?.data?.message || err.message || "Unable to load pricing entries.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const openCreateSheet = () => {
    setFormMode("create");
    setSelectedEntry(null);
    reset({
      Group: "",
      PType: "",
      Vendor: "",
      ItemCode: "",
      Currcode: "",
      Price_MT: undefined,
      Price_Sheet: undefined,
      Price_Pound: undefined,
      Price_Bale: undefined,
      EffectiveDate: "",
    });
    setSheetOpen(true);
  };

  const openEditSheet = (entry: PaperBoardPricingResponseDto) => {
    setFormMode("edit");
    setSelectedEntry(entry);
    reset({
      Group: entry.Group || "",
      PType: entry.PType,
      Vendor: entry.Vendor,
      ItemCode: entry.ItemCode,
      Currcode: entry.Currcode || "",
      Price_MT: entry.Price_MT,
      Price_Sheet: entry.Price_Sheet,
      Price_Pound: entry.Price_Pound,
      Price_Bale: entry.Price_Bale,
      EffectiveDate: entry.EffectiveDate?.split("T")[0] ?? "",
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
          `/PaperBoardPricing/${selectedEntry.ItemCode}/${selectedEntry.Vendor}/${selectedEntry.PType}`,
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
    const confirmed = window.confirm(`Delete pricing entry ${entry.ItemCode} / ${entry.Vendor} / ${entry.PType}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/PaperBoardPricing/${entry.ItemCode}/${entry.Vendor}/${entry.PType}`);
      setPricing((current) => current.filter((item) => item.ItemCode !== entry.ItemCode || item.Vendor !== entry.Vendor || item.PType !== entry.PType));
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
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Item Code</span>
                <Input {...register("ItemCode", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Vendor</span>
                <Input {...register("Vendor", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>PType</span>
                <Input {...register("PType", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Currency</span>
                <Input {...register("Currcode")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / MT</span>
                <Input type="number" step="0.01" {...register("Price_MT", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Sheet</span>
                <Input type="number" step="0.01" {...register("Price_Sheet", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Pound</span>
                <Input type="number" step="0.01" {...register("Price_Pound", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Price / Bale</span>
                <Input type="number" step="0.01" {...register("Price_Bale", { valueAsNumber: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Effective Date</span>
                <Input type="date" {...register("EffectiveDate")} />
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
