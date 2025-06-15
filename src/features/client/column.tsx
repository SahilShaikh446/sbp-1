import { useAppDispatch } from "@/app/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { schema } from "./Client";
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
import { fetchClientAsync } from "./clientSlice";

interface clientType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  phone: string;
  designation: string;
}

export const COLUMNS: ColumnDef<clientType>[] = [
  {
    header: "ID",
    accessorKey: "id",
  },
  {
    header: "First Name",
    accessorKey: "first_name",
  },
  {
    header: "Last Name",
    accessorKey: "last_name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Company ID",
    accessorKey: "company_id",
  },
  {
    header: "Phone",
    accessorKey: "phone",
  },
  {
    header: "Designation",
    accessorKey: "designation",
  },
  {
    header: "Edit",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false);
      const dispatch = useAppDispatch();
      const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
          first_name: "",
          last_name: "",
          email: "",
          company_id: "",
          phone: "",
          designation: "",
        },
      });

      const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
          const res = await axios.post(BASE_URL + `/API/Update/Client`, {
            ...data,
            id: row.original.id,
          });
          if (res.status == 201) {
            await dispatch(fetchClientAsync()).unwrap();
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
        open && form.setValue("first_name", `${row.original.first_name}`);
        open && form.setValue("last_name", `${row.original.last_name}`);
        open && form.setValue("email", `${row.original.email}`);
        open && form.setValue("company_id", `${row.original.company_id}`);
        open && form.setValue("phone", `${row.original.phone}`);
        open && form.setValue("designation", `${row.original.designation}`);
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
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          First Name : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="First Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Last Name : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Last Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Company ID : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Company ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phone : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="designation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Designation : <span className="text-red-600"> *</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Designation" {...field} />
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
