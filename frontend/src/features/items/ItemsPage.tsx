import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ColumnDef,
  flexRender,
  filterFns,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel, // Added for pagination
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
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
import { ItemCreateUpdateDto, ItemResponseDto } from "./types/item.types";

export const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<ItemResponseDto[]>([]);
  const [pTypes, setPTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
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
      gsm: undefined as any,
      caliper: undefined as any,
      ppr: undefined as any,
      cbnum: undefined as any, 
      width: undefined as any,
      length: undefined as any,
    },
  });

  const { register, handleSubmit, reset, watch, setValue } = form;

  const watchedProdGroup = watch("prodGroup");
  const watchedPType = watch("pType");
  const watchedUM = watch("um");
  const watchedGsm = watch("gsm");
  const watchedCaliper = watch("caliper");
  const watchedPpr = watch("ppr"); 
  const watchedCbnum = watch("cbnum"); 
  const watchedWidth = watch("width");
  const watchedLength = watch("length");

  // Side-Effect: Item Code and Description Formula Builder
  useEffect(() => {
    if (formMode === "edit") return;

    const pTypeStr = (watchedPType || "").toUpperCase().trim();

    const formatSegment = (val: any): string => {
      const num = typeof val === "string" ? parseFloat(val) : val;
      if (num === undefined || num === null || isNaN(num) || num <= 0) return "";
      const clamped = Math.min(Math.floor(num), 9999);
      return String(clamped).padStart(4, "0");
    };

    const caliperSeg = formatSegment(watchedCaliper);
    const pprSeg = formatSegment(watchedPpr);
    const cbnumSeg = formatSegment(watchedCbnum); 
    const gsmSeg = formatSegment(watchedGsm);
    const widthSeg = formatSegment(watchedWidth);
    const lengthSeg = formatSegment(watchedLength);

    let uSymbol = "";
    if (watchedUM === "RL") uSymbol = "R";
    if (watchedUM === "SH") uSymbol = "S";

    const generatedCode = `${pTypeStr}${caliperSeg}${pprSeg}${cbnumSeg}${gsmSeg}${widthSeg}${lengthSeg}${uSymbol}`;
    setValue("itemCode", generatedCode);

    const descSegments: string[] = [];

    if (pTypeStr) descSegments.push(pTypeStr);

    if (watchedCaliper !== undefined && watchedCaliper !== null && !isNaN(watchedCaliper)) {
      descSegments.push(`Cal ${watchedCaliper}`);
    }

    if (watchedCbnum !== undefined && watchedCbnum !== null && !isNaN(watchedCbnum)) {
      descSegments.push(`#${watchedCbnum}`);
    }

    if (watchedPpr !== undefined && watchedPpr !== null && !isNaN(watchedPpr)) {
      if (watchedProdGroup === "Board") {
        descSegments.push(`#${watchedPpr}`);
      } else {
        descSegments.push(`${watchedPpr}#`);
      }
    }

    if (watchedGsm !== undefined && watchedGsm !== null && !isNaN(watchedGsm)) {
      descSegments.push(`${watchedGsm}GSM`);
    }

    const validWidth = watchedWidth !== undefined && watchedWidth !== null && !isNaN(watchedWidth);
    const validLength = watchedLength !== undefined && watchedLength !== null && !isNaN(watchedLength);
    if (validWidth || validLength) {
      const wLabel = validWidth ? watchedWidth : "0";
      const lLabel = validLength ? watchedLength : "0";
      descSegments.push(`${wLabel}X${lLabel}`);
    }

    const generatedDesc = descSegments.join(" ");
    setValue("itemDesc", generatedDesc);

  }, [
    formMode, 
    watchedProdGroup,
    watchedPType, 
    watchedUM, 
    watchedGsm, 
    watchedCaliper, 
    watchedPpr, 
    watchedCbnum, 
    watchedWidth, 
    watchedLength, 
    setValue
  ]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, pTypeRes] = await Promise.all([
        api.get<ItemResponseDto[]>("/Item"),
        api.get<any[]>("/PType"),
      ]);

      setItems(itemsRes.data);
      const parsedPTypes = pTypeRes.data.map(pt => typeof pt === 'object' ? pt.pType || pt.name : pt).filter(Boolean);
      setPTypes(parsedPTypes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load structural parameters.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateDialog = () => {
    setFormMode("create");
    setSelectedItem(null);
    reset({
      itemCode: "",
      itemDesc: "",
      prodGroup: "Paper", 
      pType: pTypes[0] || "",
      um: "RL", 
      gsm: undefined as any,
      caliper: undefined as any,
      ppr: undefined as any,
      cbnum: undefined as any, 
      width: undefined as any,
      length: undefined as any,
    });
    setDialogOpen(true);
  };

  const openEditDialog = (item: ItemResponseDto) => {
    setFormMode("edit");
    setSelectedItem(item);
    reset({
      itemCode: item.itemCode,
      itemDesc: item.itemDesc || "",
      prodGroup: item.prodGroup || "Paper",
      pType: item.pType || "",
      um: item.um || "RL",
      gsm: item.gsm,
      caliper: item.caliper,
      ppr: item.ppr,
      cbnum: item.cbnum, 
      width: item.width,
      length: item.length,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (values: ItemCreateUpdateDto) => {
    setIsSaving(true);
    
    const payload = {
      ...values,
      itemCode: values.itemCode ? values.itemCode.toUpperCase().trim() : "",
      gsm: values.gsm || 0,
      caliper: values.caliper || 0,
      ppr: values.ppr || 0,
      cbnum: values.cbnum || 0, 
      width: values.width || 0,
      length: values.length || 0,
    };

    try {
      if (formMode === "create") {
        await api.post<ItemResponseDto>("/Item", payload);
        window.alert("Item created successfully.");
      } else if (selectedItem) {
        await api.put<ItemResponseDto>(`/Item/${selectedItem.itemCode}`, payload);
        window.alert("Item updated successfully.");
      }
      await fetchData();
      setDialogOpen(false);
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
      { accessorKey: "ppr", header: "PPR" },
      { accessorKey: "cbnum", header: "CB Num" }, 
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
              <Button variant="secondary" size="icon" onClick={() => openEditDialog(item)} title="Edit item">
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
    [pTypes]
  );

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting, globalFilter },
    filterFns: { includesString: filterFns.includesString },
    globalFilterFn: filterFns.includesString,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // Added for pagination configuration
  });

  const selectStyle = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

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
            <Button onClick={openCreateDialog} className="whitespace-nowrap">
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

          {/* Dynamic Pagination Section - Added << 1 2 3 >> Style Controls */}
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50/50">
            <span className="text-sm text-slate-500">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            
            <div className="flex items-center gap-1">
              {/* First Page Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-xs font-semibold"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                {'<<'}
              </Button>

              {/* Dynamic Number Selectors Loop */}
              {Array.from({ length: table.getPageCount() }, (_, index) => index).map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={table.getState().pagination.pageIndex === pageIndex ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0 text-xs font-medium"
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))}

              {/* Last Page Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-xs font-semibold"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                {'>>'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto pb-0">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? "Create Item" : "Edit Item"}</DialogTitle>
            <DialogDescription>
              Fill out the details below to configure item properties. Item codes and descriptions are dynamically updated based on attributes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span className="font-medium text-slate-900">Item Code</span>
                <Input 
                  {...register("itemCode", { required: true, maxLength: 30 })} 
                  maxLength={30}
                  placeholder="AUTO-GENERATED FORMULA CODE"
                  readOnly={true} 
                  className="uppercase bg-slate-50 cursor-not-allowed text-slate-500 font-mono tracking-wider"
                />
              </div>
              
              <div className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span className="font-medium text-slate-900">Description</span>
                <Input {...register("itemDesc", { maxLength: 50 })} maxLength={50} placeholder="Auto-fills from formula, user-editable" />
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Prod Group</span>
                <select {...register("prodGroup", { maxLength: 20 })} className={selectStyle}>
                  <option value="Paper">Paper</option>
                  <option value="Board">Board</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Type</span>
                <select {...register("pType", { maxLength: 7 })} className={selectStyle}>
                  {pTypes.length === 0 ? (
                    <option value="">No types found...</option>
                  ) : (
                    pTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">UOM</span>
                <select {...register("um", { maxLength: 3 })} className={selectStyle}>
                  <option value="RL">RL</option>
                  <option value="SH">SH</option>
                </select>
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">GSM</span>
                <Input type="number" step="0.1" placeholder="0" {...register("gsm", { valueAsNumber: true })} />
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Caliper</span>
                <Input type="number" step="0.1" placeholder="0" {...register("caliper", { valueAsNumber: true })} />
              </div>
              
              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">{watchedProdGroup === "Board" ? "Chipboard No. (#VALUE)" : "Pounds/Ream (VALUE#)"}</span>
                <Input type="number" step="0.1" placeholder="0" {...register("ppr", { valueAsNumber: true })} />
              </div>

              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">CB Num</span>
                <Input type="number" placeholder="0" {...register("cbnum", { valueAsNumber: true })} />
              </div>
              
              <div className="space-y-2 text-sm text-slate-700">
                <span className="font-medium text-slate-900">Width</span>
                <Input type="number" step="0.0001" placeholder="0" onInput={(e) => { if(e.currentTarget.value.length > 20) e.currentTarget.value = e.currentTarget.value.slice(0, 20) }} {...register("width", { valueAsNumber: true })} />
              </div>

              <div className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span className="font-medium text-slate-900">Length</span>
                <Input type="number" step="0.0001" placeholder="0" onInput={(e) => { if(e.currentTarget.value.length > 20) e.currentTarget.value = e.currentTarget.value.slice(0, 20) }} {...register("length", { valueAsNumber: true })} />
              </div>
            </div>

            <DialogFooter className="flex gap-2 pt-4 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
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