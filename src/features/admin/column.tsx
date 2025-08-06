import { useAppDispatch } from "@/app/hooks";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { schema } from "./Admin";
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
import { fetchAdminAsync } from "./adminSlice";

interface adminType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  designation: string;
}

export const COLUMNS: ColumnDef<adminType>[] = [
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
    header: "Phone",
    accessorKey: "mobile_number",
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
          mobile_number: "",
          designation: "",
        },
      });

      const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
          const res = await axios.post(BASE_URL + `API/Update/Admin`, {
            ...data,
            id: row.original.id,
          });
          if (res.status == 200) {
            await dispatch(fetchAdminAsync()).unwrap();
            toast.success("Admin updated Successfully");
            setOpen(false);
          } else {
            toast.error("Error while updating Admin");
          }
        } catch (error) {
          toast.error("Error while updating Admin");
        }
      };

      useEffect(() => {
        open && form.setValue("first_name", `${row.original.first_name}`);
        open && form.setValue("last_name", `${row.original.last_name}`);
        open && form.setValue("email", `${row.original.email}`);
        open && form.setValue("mobile_number", `${row.original.mobile_number}`);
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
                <DialogTitle>Edit Admin</DialogTitle>
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
                    name="mobile_number"
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
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader className="animate-spin w-4 mr-1" />
                          Updating
                        </>
                      ) : (
                        "Update"
                      )}
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
