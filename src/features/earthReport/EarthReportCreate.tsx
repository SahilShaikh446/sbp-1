import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  fetchCompanyAsync,
  selectCompany,
} from "@/features/company/companySlice";
import { BASE_URL } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format, parseISO } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CircleAlertIcon,
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { fetchEarthReportAsync } from "./earthReportSlice";
import { addOneYear } from "../oilReport/column";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PDFViewer } from "@react-pdf/renderer";
import EarthReport from "@/components/template/EarthReport";

export const reportFormSchema = z.object({
  earth_pit_list: z.array(
    z.object({
      area: z.string(),
      location: z.string(),
      type_earthing: z.string(),
      equipment: z.string(),
      ep_tag: z.string(),
      pit_resistance: z.string(),
      grid_resistance: z.string(),
      remark: z.string(),
    })
  ),
  report_date: z.string().min(1, "Report date is required"),
  is_area: z.boolean(),
  is_location: z.boolean(),
  is_type_earthing: z.boolean(),
  is_ep_tag: z.boolean(),
  is_pit: z.boolean(),
  is_grid: z.boolean(),
  for_client: z.string(),
  for_ok_agency: z.string(),
  company_id: z.string().min(1, "Company Name is required"),
  report_number: z.string().min(1, "Report number is required"),
  next_date_of_filtriation: z.string().optional(),
  remark: z.string(),
});

export type ReportType = z.infer<typeof reportFormSchema>;

export function convertReportDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, "dd.MM.yyyy");
  } catch (error) {
    console.error("Invalid date:", dateStr);
    return "";
  }
}

export default function EarthReportCreate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = position.x;
    const initialY = position.y;
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current || !imgRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const imgRect = imgRef.current.getBoundingClientRect();

      // Get size of image without translation effect
      const imgWidth = imgRect.width;
      const imgHeight = imgRect.height;

      // Calculate the delta
      let newX = initialX + (moveEvent.clientX - startX);
      let newY = initialY + (moveEvent.clientY - startY);

      // Clamp so it stays inside container
      const minX = 0;
      const minY = 0;
      const maxX = containerRect.width - imgWidth - 100;
      const maxY = containerRect.height - imgHeight;

      newX = Math.min(Math.max(newX, minX), maxX);
      newY = Math.min(Math.max(newY, minY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const form = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      earth_pit_list: [
        {
          area: "",
          location: "",
          type_earthing: "",
          equipment: "",
          ep_tag: "",
          pit_resistance: "",
          grid_resistance: "",
          remark: "",
        },
      ],
      remark: "",
      report_date: "",
      is_area: true,
      is_location: true,
      is_type_earthing: true,
      is_ep_tag: true,
      is_pit: true,
      is_grid: true,
      for_client: "",
      for_ok_agency: "",
      company_id: "",
      report_number: "",
      next_date_of_filtriation: "",
    },
  });

  const { fields, remove, append } = useFieldArray({
    control: form.control,
    name: "earth_pit_list",
  });

  const earthPitList = form.watch("earth_pit_list");

  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company]);

  async function onSubmit(data: z.infer<typeof reportFormSchema>) {
    data.is_location == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        location: "",
      })));
    data.is_area == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        area: "",
      })));
    data.is_type_earthing == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        type_earthing: "",
      })));
    data.is_ep_tag == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        ep_tag: "",
      })));
    data.is_pit == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        pit_resistance: "",
      })));
    data.is_grid == false &&
      (data.earth_pit_list = data.earth_pit_list.map((i) => ({
        ...i,
        grid_resistance: "",
      })));

    try {
      const res = await axios.post(BASE_URL + "API/Add/Earth/Test/Report", {
        ...data,
        image_data: { x: position.x },
        next_date_of_filtriation: addOneYear(data.report_date),
      });
      if (res.status === 201) {
        toast.success("Report submitted successfully!");
        form.reset();
        dispatch(fetchEarthReportAsync("?page=0"));
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    }
  }
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <CircleAlertIcon className="opacity-80" size={16} />
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to hide Open Connected Columns?
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsOpen(false); // just close modal
                form.setValue("is_open_connected", true); // reset switch back to true
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsOpen(false);
                form.setValue("show_open_connected", false); // confirm → set to false
              }}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <div className="grid grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="h-fit">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Earth Pit Report
            </h2>
            <p className="text-gray-600">
              Fill in the details below to create a new report
            </p>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      General details about the inspection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="report_date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 ">
                            Report Date{" "}
                          </FormLabel>
                          <Popover modal={true}>
                            <PopoverTrigger>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(new Date(field.value), "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}

                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={
                                  field.value
                                    ? new Date(field.value)
                                    : undefined
                                }
                                onSelect={(date) =>
                                  field.onChange(
                                    date ? format(date, "yyyy-MM-dd") : ""
                                  )
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="report_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500 ">
                            Report Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder="Enter report number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="*:not-first:mt-2">
                      <Label className="after:content-['*'] after:ml-0.5 after:text-red-500 ">
                        Company
                      </Label>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger className="w-full">
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            className={`bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] ${form.formState.errors.company_id
                              ? "border-red-500"
                              : ""
                              }`}
                          >
                            <span
                              className={cn(
                                "truncate",
                                !form.watch("company_id") &&
                                "text-muted-foreground"
                              )}
                            >
                              {form.watch("company_id")
                                ? company?.find(
                                  (c) =>
                                    `${c.id}` === form.watch("company_id")
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
                                      <CheckIcon
                                        size={16}
                                        className="ml-auto"
                                      />
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Earth Inspection Details</CardTitle>
                    <CardDescription>
                      Detailed information about the earth inspection
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-2 w-full ">
                        <FormField
                          control={form.control}
                          name="is_area"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Area</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_location"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Location</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_type_earthing"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Type Earthing</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_ep_tag"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>EP Tag</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_pit"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Pit Resistance</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="is_grid"
                          render={({ field }) => (
                            <FormItem className="flex w-full flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Grid Resistance</FormLabel>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                      </div>
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="border rounded-lg p-4 space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Sr.No {index + 1}</h4>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {form.watch("is_area") && (
                              <FormField
                                control={form.control}
                                name={`earth_pit_list.${index}.area`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Area</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., LT, ST, GF"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />)}
                            {
                              form.watch("is_location") && (
                                <FormField
                                  control={form.control}
                                  name={`earth_pit_list.${index}.location`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Location</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g.," {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />)
                            }
                            {form.watch("is_type_earthing") && (
                              <FormField
                                control={form.control}
                                name={`earth_pit_list.${index}.type_earthing`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Type Earthing</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g.," {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            <FormField
                              control={form.control}
                              name={`earth_pit_list.${index}.equipment`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Equipment</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g.," {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            {form.watch("is_ep_tag") && (
                              <FormField
                                control={form.control}
                                name={`earth_pit_list.${index}.ep_tag`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>EP Tag</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g.," {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                            {form.watch("is_pit") && (
                              <>
                                <FormField
                                  control={form.control}
                                  name={`earth_pit_list.${index}.pit_resistance`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Pit Resistance</FormLabel>
                                      <FormControl>
                                        <Input placeholder="e.g.," {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                {
                                  form.watch("is_grid") &&
                                  <FormField
                                    control={form.control}
                                    name={`earth_pit_list.${index}.grid_resistance`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Grid Resistance</FormLabel>
                                        <FormControl>
                                          <Input placeholder="e.g.," {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />}
                              </>
                            )}
                            <FormField
                              control={form.control}
                              name={`earth_pit_list.${index}.remark`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Remark</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g.," {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          append({
                            area: "",
                            location: "",
                            type_earthing: "",
                            equipment: "",
                            ep_tag: "",
                            pit_resistance: "",
                            grid_resistance: "",
                            remark: "",
                          })
                        }
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div>
                      <FormField
                        control={form.control}
                        name="remark"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Remark</FormLabel>
                            <FormControl>
                              <Input
                                type="text"
                                {...field}
                                placeholder="Enter Remark"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <FormField
                        control={form.control}
                        name="for_client"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>For Client</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Mr. Sakharam Parab"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="for_ok_agency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>For Ok Agencies</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., M/s. OK AGENCIES"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" />
                      <span>Submitting... Report</span>
                    </div>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </form>
            </Form>
            {/* <PDFViewer width="100%" height="600px" className="w-full">
              <EarthReport
                reportData={{
                  ...form.watch(),
                  image_data: { x: position.x },
                }}
                companyData={company || []}
              />
            </PDFViewer> */}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="">
          <div className="max-w-[2480px] max-h-[3508px]  px-8 mx-auto tinos-regular flex flex-col">
            <div className="border border-grayd q-300">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="w-[40%]">
                    <img src="/oka.png" alt="Logo" className="w-full" />
                  </div>
                  <div className="text-right text-xs w-[40%]">
                    <img src="/l&k.jpeg" alt="Logo" className="w-full" />
                    <p className="text-blue-600 font-bold">
                      LK AUTHORIZED SERVICE CENTER
                    </p>
                  </div>
                </div>
                <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
              </div>

              <div className="px-9 py-2" ref={containerRef}>
                <div className="">
                  <div className="flex justify-between items-start text-xl">
                    <div className="font-bold">
                      Report No.: EP - {form.watch("report_number") || "-"}
                    </div>
                    <div className="font-bold">
                      Date Of EP Testing:
                      {convertReportDate(form.watch("report_date")) ||
                        "--/--/----"}
                    </div>
                  </div>

                  <div className="text-center font-bold underline text-2xl">
                    EARTH TEST REPORT
                  </div>

                  <div className="flex items-start">
                    <span className="font-bold mr-2">Client Name:</span>
                    <div>
                      <div className="font-bold">
                        {
                          company?.find(
                            (i) => `${i.id}` == `${form.watch("company_id")}`
                          )?.name
                        }
                      </div>
                      <div className="">
                        {
                          company?.find(
                            (i) => `${i.id}` == `${form.watch("company_id")}`
                          )?.address
                        }
                      </div>
                    </div>
                  </div>

                  <div className="">
                    We certify that we have carried out the Earth Resistance
                    Test at site and the results are as under:
                  </div>

                  <div className="">
                    The test was carried out on 3 pin method spacing the probes
                    at approximately 15 to 30 meters from test electrodes.
                  </div>
                </div>
                <div className="mt-">
                  <table className="w-full border-collapse border border-black">
                    <thead>
                      <tr>
                        <th
                          colSpan={
                            3 +
                            Number(form.watch("is_area")) +
                            Number(form.watch("is_location")) +
                            Number(form.watch("is_type_earthing")) +
                            Number(form.watch("is_ep_tag")) +
                            Number(form.watch("is_pit")) +
                            Number(form.watch("is_grid"))
                          }
                          className="border border-black text-xl font-bold underline text-center py-2"
                        >
                          Earth Pit List
                        </th>
                      </tr>

                      <tr>
                        <th className="border border-black px-2 text-sm font-semibold">
                          Sr. No.
                        </th>

                        {form.watch("is_area") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            Area
                          </th>
                        )}

                        {form.watch("is_location") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            Location
                          </th>
                        )}

                        {form.watch("is_type_earthing") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            Type of Earthing
                          </th>
                        )}

                        <th className="border border-black px-2 text-sm font-semibold">
                          Equipment
                        </th>

                        {form.watch("is_ep_tag") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            EP No./Tag
                          </th>
                        )}

                        {form.watch("is_pit") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            Pit Resis.
                          </th>
                        )}

                        {form.watch("is_grid") && (
                          <th className="border border-black px-2 text-sm font-semibold">
                            Grid Resis.
                          </th>
                        )}

                        <th className="border border-black px-2 text-sm font-semibold">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {earthPitList.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-black text-center text-sm">
                            {index + 1}
                          </td>

                          {form.watch("is_area") && (
                            <td className="border border-black px-1 text-center text-sm">
                              {item.area || ""}
                            </td>
                          )}

                          {form.watch("is_location") && (
                            <td className="border border-black px-1 text-center text-sm">
                              {item.location || ""}
                            </td>
                          )}

                          {form.watch("is_type_earthing") && (
                            <td className="border border-black px-1 text-center text-sm">
                              {item.type_earthing || ""}
                            </td>
                          )}

                          <td className="border border-black px-1 text-center text-sm">
                            {item.equipment || "--"}
                          </td>

                          {form.watch("is_ep_tag") && (
                            <td className="border border-black text-center text-sm">
                              {item.ep_tag || "--"}
                            </td>
                          )}

                          {form.watch("is_pit") && (
                            <td className="border border-black text-center text-sm">
                              {item.pit_resistance || "--"}
                            </td>
                          )}

                          {form.watch("is_grid") && (
                            <td className="border border-black text-center text-sm">
                              {item.grid_resistance || "--"}
                            </td>
                          )}

                          <td className="border border-black text-center text-sm">
                            {item.remark || "--"}
                          </td>
                        </tr>
                      ))}

                      <tr>
                        <td
                          colSpan={
                            3 +
                            Number(form.watch("is_area")) +
                            Number(form.watch("is_location")) +
                            Number(form.watch("is_type_earthing")) +
                            Number(form.watch("is_ep_tag")) +
                            Number(form.watch("is_pit")) +
                            Number(form.watch("is_grid"))
                          }
                          className="border border-black px-3 text-sm"
                        >
                          <span className="font-bold">Remark:</span>{" "}
                          {form.watch("remark") || "--"}
                        </td>
                      </tr>

                      <tr>
                        <td
                          colSpan={
                            3 +
                            Number(form.watch("is_area")) +
                            Number(form.watch("is_location")) +
                            Number(form.watch("is_type_earthing")) +
                            Number(form.watch("is_ep_tag")) +
                            Number(form.watch("is_pit")) +
                            Number(form.watch("is_grid"))
                          }
                          className="border border-black px-3 text-sm"
                        >
                          <div className="flex justify-between">
                            <span>
                              <b>For Client:</b> {form.watch("for_client") || "--"}
                            </span>
                            <span>
                              <b>For OK Agencies:</b> {form.watch("for_ok_agency") || "--"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>

                  </table>
                </div>
                <img
                  ref={imgRef}
                  className="object-contain max-h-[150px] max-w-[150px]  bottom-0 cursor-grab"
                  src="/stamp.jpg"
                  onMouseDown={handleMouseDown}
                  style={{
                    transform: `translateX(${position.x}px)`,
                  }}
                  alt="Stamp"
                />
              </div>

              <div className="border-t-8 border-[#fcae08] text-center p-3 text-md mt-auto">
                <p className="">
                  <span className="font-bold">Address for correspondence:</span>{" "}
                  101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
                </p>
                <p>
                  Mumbai-400081, <span className="font-bold">Contact</span> -
                  9619866401, <span className="font-bold">Email</span> -{" "}
                  <span className="text-blue-900 font-bold">
                    ok_agencies@yahoo.com,
                  </span>
                </p>
                <p>
                  <span className="font-bold">Website</span>{" "}
                  <span className="text-blue-900 font-bold">
                    – www.okagencies.in;
                  </span>{" "}
                  <span className="font-bold">GST NO.: 27ABDPJ0462B1Z9</span>
                </p>
              </div>
            </div>
          </div>

          {/* <PDFViewer width="100%" height="600px" className="w-full">
            <EarthReport
              reportData={{
                ...form.watch(),
                image_data: { x: position.x },
              }}
              companyData={company || []}
            />
          </PDFViewer> */}
        </Card>
      </div>
    </div >
  );
}
