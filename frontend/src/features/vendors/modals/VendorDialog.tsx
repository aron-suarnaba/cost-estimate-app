// src/features/vendors/modals/VendorDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn, Controller } from "react-hook-form";
import { VendorsCreateUpdateDto } from "../types/vendors.types";

interface VendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formMode: "create" | "edit";
  form: UseFormReturn<VendorsCreateUpdateDto>;
  onSubmit: (values: VendorsCreateUpdateDto) => void;
  isSaving: boolean;
}

export const VendorDialog = ({
  open,
  onOpenChange,
  formMode,
  form,
  onSubmit,
  isSaving,
}: VendorDialogProps) => {
  const { register, control, handleSubmit } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create Vendor" : "Edit Vendor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase">Vendor Code</label>
              <Input {...register("Vendnum", { required: true })} readOnly={formMode === "edit"} className={formMode === "edit" ? "bg-slate-50 cursor-not-allowed text-slate-500" : ""} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase">Vendor Name</label>
              <Input 
                {...register("Name", { required: true })} 
                // 🟢 Force real-time capitalization in state and view layer
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register("Name").onChange(e);
                }}
                className="uppercase" // Keeps visual alignment consistent
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase">Group</label>
              <Controller
                control={control}
                name="Group"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Group" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IMPORTED">Imported</SelectItem>
                      <SelectItem value="LOCAL">Local</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* 🟢 Added Currency Dropdown Selection Block */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase">Currency</label>
              <Controller
                control={control}
                name="Currcode"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger><SelectValue placeholder="Select Currency" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PHP">PHP (₱)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};