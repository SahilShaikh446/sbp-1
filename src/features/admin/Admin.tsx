import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { AppDispatch } from "@/app/store";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { COLUMNS } from "./column";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import {
  adminLoading,
  selectAdmin,
  adminError,
  fetchAdminAsync,
} from "./adminSlice";

export const schema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required"),
  number: z.string().min(1, "Number is required"),
  designation: z.string().min(1, "Designation is required"),
});

const Admin = () => {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector(selectAdmin);
  const loading = useSelector(adminLoading);
  const error = useSelector(adminError);

  useEffect(() => {
    !data && dispatch(fetchAdminAsync());
  }, [data, dispatch]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      number: "",
      designation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await axios.post("/api/company/add", data);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("Admin added Successfully");
        await dispatch(fetchAdminAsync()).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.response?.data || "Error adding Admin");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Admin</CardTitle>
        </CardHeader>
        <CardContent>
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
                        <Input type="text" placeholder="eg. Doe" {...field} />
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
                  name="number"
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
                  <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting && (
                      <Loader className="animate-spin w-4 mr-1" />
                    )}
                    Add Client
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ShadcnTable
        name="Client"
        data={data}
        columns={COLUMNS}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Admin;
