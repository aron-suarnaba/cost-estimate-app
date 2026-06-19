import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Plus, Search, Trash2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePricing } from "@/features/pricing/hooks/usePricing";
import {
  PaperBoardPricingResponseDto,
} from "./types";

export const PricingPage: React.FC = () => {
  const { pricing, error, fetchPricing } = usePricing();

  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEntry, setSelectedEntry] =
    useState<PaperBoardPricingResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [ptypesList, setPtypesList] = useState<any[]>([]);
  const [vendorsList, setVendorsList] = useState<any[]>([]);
  const [itemsList, setItemsList] = useState<any[]>([]);

  const form = useForm<any>({
    defaultValues: {
      group: "",
      pType: "",
      vendor: "",
      itemCode: "",
      effectiveDate: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [ptypeRes, vendorRes, itemRes] = await Promise.all([
          api.get("/Ptype"),
          api.get("/Vendors"),
          api.get("/Item"),
        ]);
        setPtypesList(ptypeRes.data);
        setVendorsList(vendorRes.data);
        setItemsList(itemRes.data);
      } catch (err) {
        console.error("Failed loading backend table lookups:", err);
      }
    };
    loadLookups();
  }, []);

  const openCreateDialog = () => {
    setFormMode("create");
    setSelectedEntry(null);
    reset({
      group: "",
      pType: "",
      vendor: "",
      vendorName: "",
      itemCode: "",
      itemDescription: "",
      currcode: "",
      price_MT: undefined,
      price_Sheet: undefined,
      price_Pound: undefined,
      price_Bale: undefined,
      effectiveDate: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (entry: PaperBoardPricingResponseDto) => {
    setFormMode("edit");
    setSelectedEntry(entry);

    // Find matching records to fill initial names/descriptions using actual DTO keys
    const matchedVendor = vendorsList.find((v) => v.vendnum === entry.vendor);
    const matchedItem = itemsList.find((i) => i.itemCode === entry.itemCode);

    reset({
      group: entry.group || "",
      pType: entry.pType,
      vendor: entry.vendor,
      vendorName: matchedVendor?.name || "",
      itemCode: entry.itemCode,
      itemDescription: matchedItem?.itemDesc || "",
      currcode: entry.currcode || "",
      price_MT: entry.price_MT,
      price_Sheet: entry.price_Sheet,
      price_Pound: entry.price_Pound,
      price_Bale: entry.price_Bale,
      effectiveDate: entry.effectiveDate?.split("T")[0] ?? "",
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: any) => {
    setIsSaving(true);
    try {
      if (formMode === "create") {
        await api.post<PaperBoardPricingResponseDto>(
          "/PaperBoardPricing",
          values,
        );
        window.alert("Pricing entry created successfully.");
      } else if (selectedEntry) {
        await api.put<PaperBoardPricingResponseDto>(
          `/PaperBoardPricing/${selectedEntry.itemCode}/${selectedEntry.vendor}/${selectedEntry.pType}`,
          values,
        );
        window.alert("Pricing entry updated successfully.");
      }
      await fetchPricing();
      setDialogOpen(false);
    } catch (err: any) {
      window.alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to save pricing entry.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (entry: PaperBoardPricingResponseDto) => {
    const confirmed = window.confirm(
      `Delete pricing entry ${entry.itemCode} / ${entry.vendor} / ${entry.pType}?`,
    );
    if (!confirmed) return;
    try {
      await api.delete(
        `/PaperBoardPricing/${entry.itemCode}/${entry.vendor}/${entry.pType}`,
      );
      await fetchPricing();
      window.alert("Pricing entry deleted successfully.");
    } catch (err: any) {
      window.alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete pricing entry.",
      );
    }
  };

  const columns = useMemo<ColumnDef<PaperBoardPricingResponseDto>[]>(
    () => [
      { accessorKey: "group", header: "Group" },
      { accessorKey: "itemCode", header: "Item Code" },
      { accessorKey: "vendor", header: "Vendor" },
      { accessorKey: "pType", header: "PType" },
      {
        accessorKey: "price_MT",
        header: "Price / MT",
        cell: (info) =>
          info.getValue() ? `$${Number(info.getValue()).toFixed(2)}` : "—",
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
                onClick={() => openEditDialog(entry)}
                title="Edit pricing entry"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(entry)}
                title="Delete pricing entry"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [vendorsList, itemsList], // Added lookup states to dependencies to re-sync names properly when editing
  );

  const table = useReactTable({
    data: pricing,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Paper Board Pricing
            </h1>
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
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" /> New Pricing
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-slate-50">
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id}>
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <span className="text-sm text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount() || 1}
            </span>

            <div className="flex items-center gap-1">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {"<<"}
              </Button>

              {/* Dynamic Page Numbers */}
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map(
                (pageIndex) => (
                  <Button
                    key={pageIndex}
                    variant={
                      table.getState().pagination.pageIndex === pageIndex
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                ),
              )}

              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto pb-0">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Create Pricing" : "Edit Pricing"}
            </DialogTitle>
            <DialogDescription>
              Provide configuration details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Group Field */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Group</span>
                <Controller
                  control={form.control}
                  name="group"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SEED">SEED</SelectItem>
                        <SelectItem value="IMPORTED">IMPORTED</SelectItem>
                        <SelectItem value="LOCAL">LOCAL</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </label>

              {/* Vendor Selector (Auto-populates Name & Currency) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Vendor</span>
                <Controller
                  control={form.control}
                  name="vendor"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const matched = vendorsList.find(
                          (v) => v.vendnum === val,
                        );
                        if (matched) {
                          setValue("vendorName", matched.name);
                          setValue("currcode", matched.currcode);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendorsList.map((v) => (
                          <SelectItem key={v.vendnum} value={v.vendnum}>
                            <span>{`${v.vendnum} - ${v.name}`}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </label>

              {/* Vendor Name field (Editable with Max Length 50) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Vendor Name</span>
                <Input
                  {...register("vendorName", { maxLength: 50 })}
                  placeholder="Vendor Name"
                />
                {errors.vendorName && (
                  <span className="text-xs text-red-500">
                    Max 50 characters allowed
                  </span>
                )}
              </label>

              {/* Item Code Selection (Auto-populates Description) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Item Code</span>
                <Controller
                  control={form.control}
                  name="itemCode"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        const matched = itemsList.find(
                          (i) => i.itemCode === val,
                        );
                        if (matched) {
                          setValue("itemDescription", matched.itemDesc);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Item" />
                      </SelectTrigger>
                      <SelectContent>
                        {itemsList.map((i) => (
                          <SelectItem key={i.itemCode} value={i.itemCode}>
                            <span>{`${i.itemCode} - ${i.itemDesc}`}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </label>

              {/* Item Description Field (Editable with Max Length 50) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">
                  Item Description
                </span>
                <Input
                  {...register("itemDescription", { maxLength: 50 })}
                  placeholder="Item Description"
                />
                {errors.itemDescription && (
                  <span className="text-xs text-red-500">
                    Max 50 characters allowed
                  </span>
                )}
              </label>

              {/* PType Selector (Formatted using ptypeCode and description) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">PType</span>
                <Controller
                  control={form.control}
                  name="pType"
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select PType" />
                      </SelectTrigger>
                      <SelectContent>
                        {ptypesList.map((p) => (
                          <SelectItem key={p.pType} value={p.pType}>
                            <span>{`${p.pType} - ${p.ptypeDesc}`}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </label>

              {/* Currency Input (Auto-filled, Editable with Max Length 3) */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Currency</span>
                <Input
                  {...register("currcode", { maxLength: 3 })}
                  placeholder="USD"
                />
                {errors.currcode && (
                  <span className="text-xs text-red-500">
                    Max 3 characters allowed
                  </span>
                )}
              </label>

              {/* Pricing Metric Fields */}
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Price / MT</span>
                <Input
                  type="number"
                  step="0.00000001"
                  {...register("price_MT", { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">
                  Price / Sheet
                </span>
                <Input
                  type="number"
                  step="0.00000001"
                  {...register("price_Sheet", { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">
                  Price / Pound
                </span>
                <Input
                  type="number"
                  step="0.00000001"
                  {...register("price_Pound", { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Price / Bale</span>
                <Input
                  type="number"
                  step="0.00000001"
                  {...register("price_Bale", { valueAsNumber: true })}
                />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span className="font-medium text-slate-900">
                  Effective Date
                </span>
                <Input type="date" {...register("effectiveDate")} />
              </label>
            </div>

            <DialogFooter className="flex gap-2 pt-4 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {formMode === "create" ? "Create" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};