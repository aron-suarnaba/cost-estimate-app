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
import { PtypeCreateUpdateDto, PtypeResponseDto } from "./types/ptype.types";

export const PtypesPage: React.FC = () => {
  const [ptypes, setPtypes] = useState<PtypeResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedPtype, setSelectedPtype] = useState<PtypeResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const form = useForm<PtypeCreateUpdateDto>({
    defaultValues: {
      PType: "",
      PtypeDesc: "",
      DescLabel: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const fetchPtypes = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<PtypeResponseDto[]>("/Ptype");
      setPtypes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unable to load product types.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPtypes();
  }, []);

  const openCreateSheet = () => {
    setFormMode("create");
    setSelectedPtype(null);
    reset({ PType: "", PtypeDesc: "", DescLabel: "" });
    setSheetOpen(true);
  };

  const openEditSheet = (ptype: PtypeResponseDto) => {
    setFormMode("edit");
    setSelectedPtype(ptype);
    reset({
      PType: ptype.PType,
      PtypeDesc: ptype.PtypeDesc || "",
      DescLabel: ptype.DescLabel || "",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (values: PtypeCreateUpdateDto) => {
    setIsSaving(true);
    try {
      if (formMode === "create") {
        await api.post<PtypeResponseDto>("/Ptype", values);
        window.alert("Product type created successfully.");
      } else if (selectedPtype) {
        await api.put<PtypeResponseDto>(`/Ptype/${selectedPtype.PType}`, values);
        window.alert("Product type updated successfully.");
      }
      await fetchPtypes();
      setSheetOpen(false);
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to save product type.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (ptype: PtypeResponseDto) => {
    const confirmed = window.confirm(`Delete product type ${ptype.PType}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/Ptype/${ptype.PType}`);
      setPtypes((current) => current.filter((item) => item.PType !== ptype.PType));
      window.alert("Product type deleted successfully.");
    } catch (err: any) {
      window.alert(err.response?.data?.message || err.message || "Failed to delete product type.");
    }
  };

  const columns = useMemo<ColumnDef<PtypeResponseDto>[]>(
    () => [
      {
        accessorKey: "pType",
        header: "Type",
      },
      {
        accessorKey: "ptypeDesc",
        header: "Description",
      },
      {
        accessorKey: "descLabel",
        header: "Label",
      },
      {
        accessorKey: "createDate",
        header: "Created",
        cell: (info) => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const ptype = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openEditSheet(ptype)}
                title="Edit product type"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(ptype)}
                title="Delete product type"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: ptypes,
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
              Product Types (PType)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage product type records with table search, filter and sorting.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Input
                type="search"
                placeholder="Search product types..."
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
              <span className="ml-2">New Type</span>
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
                    {isLoading ? "Loading product types..." : "No product types match your search."}
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
            <SheetTitle>{formMode === "create" ? "Create Product Type" : "Edit Product Type"}</SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700">
                <span>Type Code</span>
                <Input {...register("PType", { required: true })} />
              </label>
              <label className="space-y-2 text-sm text-slate-700">
                <span>Description</span>
                <Input {...register("PtypeDesc")} />
              </label>
              <label className="space-y-2 text-sm text-slate-700 sm:col-span-2">
                <span>Label</span>
                <Input {...register("DescLabel")} />
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
