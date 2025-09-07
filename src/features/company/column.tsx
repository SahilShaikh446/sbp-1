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
import { fetchCompanyAsync } from "./companySlice";
import { fetchAllCompanyAsync } from "./paginateCompanySlice";

interface companyType {
  id: string;
  name: string;
  address: string;
}

export const COLUMNS: ColumnDef<companyType>[] = [
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
          const res = await axios.post(BASE_URL + `API/Update/Company`, {
            ...data,
            id: row.original.id,
          });
          if (res.status == 200) {
            await dispatch(fetchAllCompanyAsync("?page=0&size=10"));
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
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Company Name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="eg. 123 Main St"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-full">
                      <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                      >
                        {form.formState.isSubmitting && (
                          <Loader className="animate-spin w-4 mr-1" />
                        )}
                        Update Company
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
