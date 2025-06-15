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
import {
  companyError,
  companyLoading,
  getCompanyAsync,
  selectCompany,
} from "./companySlice";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

const Company = () => {
  const dispatch = useDispatch<AppDispatch>();

  const data = useSelector(selectCompany);
  const loading = useSelector(companyLoading);
  const error = useSelector(companyError);

  useEffect(() => {
    !data && dispatch(getCompanyAsync());
  }, [data, dispatch]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await axios.post("/api/company/add", data);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("Company added Successfully");
        await dispatch(getCompanyAsync()).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.response?.data || "Error adding Company");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Company</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-2">
                <div className="mt-2">
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
                </div>
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
                  <Button disabled={form.formState.isSubmitting} type="submit">
                    {form.formState.isSubmitting && (
                      <Loader className="animate-spin w-4 mr-1" />
                    )}
                    Add Company
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <ShadcnTable
        name="Company"
        data={data}
        columns={COLUMNS}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Company;
