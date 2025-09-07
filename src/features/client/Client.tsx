import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
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
import { CheckIcon, ChevronDownIcon, Loader } from "lucide-react";
import { toast } from "sonner";
import { COLUMNS } from "./column";
import ShadcnTable from "@/components/newShadcnTable/ShadcnTable";
import {
  clientLoading,
  selectClient,
  clientError,
  fetchClientAsync,
} from "./clientSlice";
import { useAppSelector } from "@/app/hooks";
import { BASE_URL } from "@/lib/constants";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { fetchCompanyAsync, selectCompany } from "../company/companySlice";
import { fetchAllCompanyAsync } from "../company/paginateCompanySlice";
import { useLocation } from "react-router-dom";

export const schema = z.object({
  first_name: z.string().min(1, "First Name is required"),
  last_name: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required"),
  company_id: z.string().min(1, "Company ID is required"),
  mobile_number: z.string().min(1, "Phone is required"),
  designation: z.string().min(1, "Designation is required"),
});

const Client = () => {
  const dispatch = useDispatch<AppDispatch>();
  const params = useLocation().search;

  const [open, setOpen] = useState(false);

  const data = useAppSelector(selectClient);
  const loading = useAppSelector(clientLoading);
  const error = useAppSelector(clientError);

  const company = useAppSelector(selectCompany);
  console.log(company);

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
    dispatch(fetchClientAsync(params));
  }, [params, company]);

  const form = useForm({
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

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const res = await axios.post(BASE_URL + "API/Add/Client", data);
      if (res.status === 201 || res.status === 200) {
        form.reset();
        toast.success("Client added Successfully");
        await dispatch(fetchClientAsync("?page=0&size=10")).unwrap();
      }
    } catch (error: any) {
      toast.error(error?.response?.data || "Error adding Client");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Client</CardTitle>
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
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="eg. John" />
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

                <div className="*:not-first:mt-2">
                  <Label
                    className={`after:content-['*'] after:ml-0.5 after:text-red-500 ${
                      form.formState.errors.company_id ? "text-red-500" : ""
                    }`}
                  >
                    Company
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger className="w-full">
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className={`bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] ${
                          form.formState.errors.company_id
                            ? "border-red-500"
                            : ""
                        }`}
                      >
                        <span
                          className={cn(
                            "truncate",
                            !form.watch("company_id") && "text-muted-foreground"
                          )}
                        >
                          {form.watch("company_id")
                            ? company?.find(
                                (c) => `${c.id}` === form.watch("company_id")
                              )?.name || "Select company"
                            : "Select company"}
                        </span>
                        <ChevronDownIcon
                          size={16}
                          className="text-muted-foreground/80 shrink-0"
                          aria-hidden="true"
                        />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
                      align="start"
                    >
                      <Command>
                        <CommandInput placeholder="Search Company..." />
                        <CommandList>
                          <CommandEmpty>No company found.</CommandEmpty>
                          <CommandGroup>
                            {company?.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={c.name} // search works by name
                                onSelect={() => {
                                  form.setValue("company_id", `${c.id}`, {
                                    shouldValidate: true,
                                  });
                                  setOpen(false);
                                }}
                              >
                                {c.name}
                                {`${c.id}` === form.watch("company_id") && (
                                  <CheckIcon size={16} className="ml-auto" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.company_id && (
                    <FormMessage>
                      {form.formState.errors.company_id.message}
                    </FormMessage>
                  )}
                </div>
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
                          placeholder="eg. Supervisor, Manager, etc."
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
        title="Client"
        desc=" Clients"
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

export default Client;
