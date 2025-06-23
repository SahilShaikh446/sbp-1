import { useAppDispatch, useAppSelector } from "@/app/hooks";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectCompany } from "../company/companySlice";

interface clientType {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_id: string;
  mobile_number: string;
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
          company_id: "",
          mobile_number: "",
          designation: "",
        },
      });
      const company = useAppSelector(selectCompany);

      const onSubmit = async (data: z.infer<typeof schema>) => {
        try {
          const res = await axios.post(BASE_URL + `API/Update/Client`, {
            ...data,
            id: row.original.id,
          });
          if (res.status == 200) {
            await dispatch(fetchClientAsync()).unwrap();
            toast.success("Client updated Successfully");
            setOpen(false);
          } else {
            toast.error("Error while updating Client");
          }
        } catch (error) {
          toast.error("Error while updating Client");
        }
      };

      useEffect(() => {
        open && form.setValue("first_name", `${row.original.first_name}`);
        open && form.setValue("last_name", `${row.original.last_name}`);
        open && form.setValue("email", `${row.original.email}`);
        open && form.setValue("company_id", `${row.original.company_id}`);
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
                <DialogTitle>Edit Company</DialogTitle>
                <DialogDescription className="text-red-600 text-xs">
                  * marked fields are required
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2">
                    <div className="mt-2">
                      <FormField
                        control={form.control}
                        name="first_name"
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
                    </div>
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="eg. Doe"
                              {...field}
                            />
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
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="eg. john@example.com"
                              {...field}
                            />
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
                          <FormLabel>Company</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a company" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {company?.map((i) => (
                                <SelectItem key={i.id} value={`${i.id}`}>
                                  {i.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="mobile_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="eg. 123-456-7890"
                              {...field}
                            />
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
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">
                            Designation
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="eg. Developer"
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
                        Update Client
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
