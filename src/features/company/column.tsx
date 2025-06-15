import { useAppDispatch } from "@/app/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { schema } from "./Company";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader, SquarePen } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCompanyAsync } from "./companySlice";

interface companyType {
  id: string;
  name: string;
  address: string;
}

export const COLUMNS: ColumnDef<companyType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Address",
    accessorKey: "address",
  },
  {
    header: "Edit",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const dispatch = useAppDispatch();
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
          name: "",
          address: "",
        },
      });

      const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
          const res = await axios.post(
            BASE_URL + `/Crm/Portal/User/updatevendormaster`,
            { ...data, id: row.original.id }
          );
          if (res.status == 201) {
            await dispatch(getCompanyAsync()).unwrap();
            toast.success("Company updated Successfully");
            setOpen(false);
          } else {
            toast.error("Error while updating Company");
          }
        } catch (error) {
          toast.error("Error while updating Company");
        }
      };

      useEffect(() => {
        open && form.setValue("name", `${row.original.name}`);
        open && form.setValue("address", `${row.original.address}`);
      }, [row, open]);

      return (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="link" size="icon">
                <SquarePen className="w-5 text-green-700" strokeWidth={2} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit Company</DialogTitle>
                <DialogDescription className="text-red-600 text-xs">
                  * marked fields are required
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-1"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      disabled={form.formState.isSubmitting}
                      type="submit"
                      className="mt-5"
                    >
                      {form.formState.isSubmitting && (
                        <>
                          Updating
                          <Loader className="animate-spin w-4 mr-1" />
                        </>
                      )}
                      Update
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
