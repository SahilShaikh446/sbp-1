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
import { BASE_URL } from "@/lib/constants";
import { useLocation } from "react-router-dom";
import {
  allCompanyError,
  allCompanyLoading,
  fetchAllCompanyAsync,
  selectAllCompany,
} from "./paginateCompanySlice";

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
});

const Company = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocation().search;

  const data = useSelector(selectAllCompany);
  const loading = useSelector(allCompanyLoading);
  const error = useSelector(allCompanyError);

  useEffect(() => {
    dispatch(fetchAllCompanyAsync(params));
  }, [params]);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await axios.post(BASE_URL + "API/Add/Company", data);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("Company added Successfully");
        await dispatch(fetchAllCompanyAsync("?page=0&size=10"));
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
        title="Company"
        desc=" Companies"
        data={data?.content || []}
        columns={COLUMNS}
        loading={loading}
        error={error}
        api={true}
        currentPage={data ? data.pageable?.pageNumber : 0}
        totalPages={data ? data.totalPages : 10}
        totalelement={data ? data.totalElements : 0}
      />
    </div>
  );
};

export default Company;
