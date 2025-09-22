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
  Loader,
  Plus,
  Trash2,
} from "lucide-react";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import { PreLoader } from "@/components/ui/Preloader";
import { fetchEarthReportAsync } from "./earthReportSlice";
import { addOneYear } from "../oilReport/column";

export const reportFormSchema = z.object({
  earth_pit_list: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      location: z.string().min(1, { message: "Location is required" }),
      remark: z.string().min(1, { message: "Remark is required" }),
      earth_resistance: z.object({
        open_pit: z.string().min(1, { message: "Open Pit is required" }),
        Connected: z.string().min(1, { message: "Connected is required" }),
        id: z.number().optional(),
      }),
    })
  ),
  report_date: z.string(),
  weather_condition: z.string(),
  soil: z.string(),
  for_client: z.string(),
  for_ok_agency: z.string(),
  company_id: z.string(),
  report_number: z.string(),
  next_date_of_filtriation: z.string().optional(),
});

export type ReportType = z.infer<typeof reportFormSchema>;

export function convertReportDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    return format(date, "MM.dd.yyyy");
  } catch (error) {
    console.error("Invalid date:", dateStr);
    return "";
  }
}

export default function EarthReportUpdate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

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
          description: "",
          location: "",
          remark: "",
          earth_resistance: {
            open_pit: "",
            Connected: "",
            id: 1,
          },
        },
      ],
      report_date: "",
      weather_condition: "",
      soil: "",
      for_client: "",
      for_ok_agency: "",
      company_id: "",
      report_number: "",
      next_date_of_filtriation: "",
    },
  });

  const fetchReport = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}API/GetById/Earth/Test/Report`, {
        id: id,
      });
      if (res.status === 200) {
        form.setValue("report_date", res.data.report_date);
        form.setValue("weather_condition", res.data.weather_condition);
        form.setValue("soil", res.data.soil);
        form.setValue("for_client", res.data.for_client);
        form.setValue("for_ok_agency", res.data.for_ok_agency);
        form.setValue("report_number", res.data.report_number);
        form.setValue("report_number", res.data.report_number);
        form.setValue("company_id", `${res.data.company_id}`);
        replace(res.data.earth_pit_list);
        setPosition({ x: res.data.image_data.x, y: 0 });
      }
    } catch (error) {
      toast.error("Failed to fetch report data. Please try again.");
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      fetchReport(id);
    }
  }, [id]);

  const { fields, remove, append, replace } = useFieldArray({
    control: form.control,
    name: "earth_pit_list",
  });

  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company]);

  async function onSubmit(data: z.infer<typeof reportFormSchema>) {
    try {
      const res = await axios.post(BASE_URL + "API/Update/Earth/Test/Report", {
        ...data,
        id: id,
        image_data: { x: position.x },
        next_date_of_filtriation: addOneYear(data.report_date),
      });
      if (res.status === 200) {
        toast.success("Report submitted successfully!");
        navigate("/earth-pit");
        form.reset();
        dispatch(fetchEarthReportAsync("page=0"));
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    }
  }

  if (loading) {
    return <PreLoader messages={["Loading", "Just there"]} dotCount={3} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
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
                          <FormLabel>Report Date </FormLabel>
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
                          <FormLabel>Report Number</FormLabel>
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
                      <Label>Company</Label>
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

                    <FormField
                      control={form.control}
                      name="weather_condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weather Condition</FormLabel>
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
                    <FormField
                      control={form.control}
                      name="soil"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Soil</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder="Enter Soil"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            <FormField
                              control={form.control}
                              name={`earth_pit_list.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., LT, ST, GF"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
                            />
                            <FormField
                              control={form.control}
                              name={`earth_pit_list.${index}.earth_resistance.open_pit`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Open Pit</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g.," {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`earth_pit_list.${index}.earth_resistance.Connected`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Connected</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g.," {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
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
                            description: "",
                            location: "",
                            earth_resistance: {
                              open_pit: "",
                              Connected: "",
                              id: fields.length + 1,
                            },
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
            {/* Header */}
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
                  {/* Header */}
                  <div className="flex justify-between items-start text-xl">
                    <div className="font-bold">
                      Report No.:EP {form.watch("report_number") || "--"}
                    </div>
                    <div className="font-bold">
                      Test Date:
                      {convertReportDate(form.watch("report_date")) ||
                        "--/--/----"}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="text-center font-bold underline text-2xl">
                    EARTH TEST REPORT
                  </div>

                  {/* Client Information */}
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

                  {/* Test Details */}
                  <div className="">
                    We certify that we have carried out the Earth Resistance
                    Test at site and the results are as under:
                  </div>

                  <div className="">
                    <div className="flex">
                      <span className="w-40 flex-shrink-0">
                        Weather Condition
                      </span>
                      <span className="mx-4">:</span>
                      <span>{form.watch("weather_condition") || "--"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 flex-shrink-0">Soil</span>
                      <span className="mx-4">:</span>
                      <span>{form.watch("soil") || "--"}</span>
                    </div>
                  </div>

                  <div className="">
                    The test was carried out on 3 pin method spacing the probes
                    at approximately 15 to 30 meters from test electrodes.
                  </div>
                </div>
                <div className="mt-">
                  <table className="w-full border-collapse border border-black">
                    <thead>
                      <tr className="">
                        <th
                          className="border border-black px-2  font-bold text-xl underline"
                          colSpan={6}
                        >
                          Earth Pit List
                        </th>
                      </tr>
                      <tr className="">
                        <th
                          className="border border-black px-2  text-sm font-semibold"
                          rowSpan={2}
                        >
                          Sr. No.
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-black px-2  text-sm font-semibold"
                        >
                          Description
                        </th>
                        <th
                          rowSpan={2}
                          className="border border-black px-2  text-sm font-semibold"
                        >
                          Location
                        </th>
                        <th
                          className="border border-black px-2  text-sm font-semibold"
                          colSpan={2}
                        >
                          Earth Resistance
                        </th>
                        <th
                          className="border border-black px-2  text-sm font-semibold"
                          rowSpan={2}
                        >
                          Remark
                        </th>
                      </tr>
                      <tr className="">
                        <th className="border border-black px-2  text-xs">
                          Open Pit
                        </th>
                        <th className="border border-black px-2  text-xs">
                          Connected
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.watch("earth_pit_list").map((item, index) => {
                        const location = item.location || "No Location";

                        // Only show the location cell for the first occurrence of this location in consecutive rows
                        let rowSpan = 1;
                        if (
                          index === 0 ||
                          location !==
                            form.watch("earth_pit_list")[index - 1].location
                        ) {
                          // count how many consecutive rows have the same location
                          for (
                            let i = index + 1;
                            i < form.watch("earth_pit_list").length;
                            i++
                          ) {
                            if (
                              form.watch("earth_pit_list")[i].location ===
                              location
                            )
                              rowSpan++;
                            else break;
                          }
                        } else {
                          rowSpan = 0; // skip rendering the cell
                        }

                        return (
                          <tr key={index}>
                            <td className="border border-black px-2 text-center text-sm">
                              {item.earth_resistance?.id || index + 1}
                            </td>
                            <td className="border border-black px-2 text-sm">
                              {item.description || "--"}
                            </td>

                            {rowSpan > 0 && (
                              <td
                                className="border border-black px-2 text-sm font-medium"
                                rowSpan={rowSpan}
                              >
                                {location === "No Location" ? "" : location}
                              </td>
                            )}

                            <td className="border border-black px-2 text-center text-sm">
                              {item.earth_resistance?.open_pit || "--"}
                            </td>
                            <td className="border border-black px-2 text-center text-sm">
                              {item.earth_resistance?.Connected || "--"}
                            </td>
                            <td className="border border-black px-2 text-center text-sm">
                              {item.remark || "--"}
                            </td>
                          </tr>
                        );
                      })}

                      {fields.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="border border-black px-2 py-8 text-center text-gray-500"
                          >
                            No earth pits added yet
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={6}>
                          <div className="flex justify-between px-3">
                            <div className=" ">
                              <span className="font-bold">For Client:</span>{" "}
                              {form.watch("for_client") || "--"}
                            </div>
                            <div className=" ">
                              <span className="font-bold">
                                For Ok Agencies.:-
                              </span>{" "}
                              M/s.
                              {form.watch("for_ok_agency") || "--"}
                            </div>
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
        </Card>
      </div>
    </div>
  );
}
