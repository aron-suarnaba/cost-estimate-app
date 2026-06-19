import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  FilterFn,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  VendorsCreateUpdateDto,
  VendorsResponseDto,
} from "./types/vendors.types";
import { useVendors } from "@/features/vendors/hooks/useVendors";
import { VendorDialog } from "@/features/vendors/modals/VendorDialog";

// Define a valid custom global fuzzy filter function
const fuzzyFilter: FilterFn<VendorsResponseDto> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

export const VendorsPage: React.FC = () => {
  const { vendors, isLoading, setVendors, fetchVendors } = useVendors();
  const [isSaving, setIsSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedVendor, setSelectedVendor] =
    useState<VendorsResponseDto | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const form = useForm<VendorsCreateUpdateDto>({
    defaultValues: {
      Vendnum: "",
      Group: "",
      Name: "",
      Currcode: "",
    },
  });

  const { reset } = form;

  const openCreateSheet = () => {
    setFormMode("create");
    setSelectedVendor(null);
    reset({ Vendnum: "", Group: "LOCAL", Name: "", Currcode: "PHP" });
    setSheetOpen(true);
  };

  const openEditSheet = (vendor: VendorsResponseDto) => {
    setFormMode("edit");
    setSelectedVendor(vendor);
    reset({
      Vendnum: vendor.vendnum,
      Group: vendor.group || "LOCAL",
      Name: vendor.name || "",
      Currcode: vendor.currcode || "PHP",
    });
    setSheetOpen(true);
  };

  const onSubmit = async (values: VendorsCreateUpdateDto) => {
    setIsSaving(true);
    try {
      if (formMode === "create") {
        await api.post<VendorsResponseDto>("/Vendors", values);
        window.alert("Vendor created successfully.");
      } else if (selectedVendor) {
        await api.put<VendorsResponseDto>(
          `/Vendors/${selectedVendor.vendnum}`,
          values,
        );
        window.alert("Vendor updated successfully.");
      }
      await fetchVendors();
      setSheetOpen(false);
    } catch (err: any) {
      window.alert(
        err.response?.data?.message || err.message || "Failed to save vendor.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vendor: VendorsResponseDto) => {
    const confirmed = window.confirm(`Delete vendor ${vendor.vendnum}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/Vendors/${vendor.vendnum}`);
      setVendors((current) =>
        current.filter((item) => item.vendnum !== vendor.vendnum),
      );
      window.alert("Vendor deleted successfully.");
    } catch (err: any) {
      window.alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete vendor.",
      );
    }
  };

  const columns = useMemo<ColumnDef<VendorsResponseDto>[]>(
    () => [
      {
        accessorKey: "vendnum",
        header: "Vendor #",
      },
      {
        accessorKey: "name",
        header: "Vendor Name",
      },
      {
        accessorKey: "group",
        header: "Group",
        cell: (info) => {
          const val = info.getValue() as string;
          return val === "IMPORTED" ? "Imported" : "Local";
        },
      },
      {
        accessorKey: "currcode",
        header: "Currency",
      },
      {
        accessorKey: "createDate",
        header: "Created",
        cell: (info) =>
          info.getValue()
            ? new Date(info.getValue() as string).toLocaleDateString()
            : "—",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const vendor = row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => openEditSheet(vendor)}
                title="Edit vendor"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleDelete(vendor)}
                title="Delete vendor"
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
    data: vendors,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns: {
      fuzzyFilter,
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Vendors
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage vendor records with sorting, filtering and search.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-80">
              <Input
                type="search"
                placeholder="Search vendors..."
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
              <span className="ml-2">New Vendor</span>
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
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : undefined
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
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
                  <TableCell
                    className="h-24 text-center"
                    colSpan={columns.length}
                  >
                    {isLoading
                      ? "Loading vendors..."
                      : "No vendors match your search."}
                  </TableCell>
                </TableRow>
              ) : (
                <>
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
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <VendorDialog
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        formMode={formMode}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
      />
    </div>
  );
};
