import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchCompanyAsync,
  selectCompany,
} from "@/features/company/companySlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseISO, format } from "date-fns";
import { format as formatWithOrdinal } from "date-fns";
import { enUS } from "date-fns/locale";
import axios from "axios";
import { BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { fetchOilReportAsync } from "@/features/oilReport/oilReportSlice";
import { CheckIcon, ChevronDownIcon, Loader } from "lucide-react";
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
import { PDFViewer } from "@react-pdf/renderer";
import OilReport from "@/components/template/OilReport";

export const reportFormSchema = z.object({
  report_date: z.string(),
  report_description: z.string(),
  kva: z.string(),
  voltage: z.string(),
  make: z.string(),
  sr_no: z.string(),
  transformer_oil_quantity: z.string(),
  transformer_before_filtration: z.string(),
  transformer_after_filtration: z.string(),
  oltc_make_type: z.string(),
  oltc_oil_quantity: z.string(),
  oltc_before_filtration: z.string(),
  oltc_after_filtration: z.string(),
  remark: z.string(),
  clients_representative: z.string(),
  tested_by: z.string(),
  company_id: z.string(),
  date_of_filtration: z.string(),
  manufacturing_year: z.string(),
  report_number: z.string(),
  id: z.string(),
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

const inspectionData = [
  {
    srNo: 1,
    description: "PANEL NO/FEEDER NAME PLATE",
    observationReport: "01 / 100s FTL II",
  },
  {
    srNo: 2,
    description: "CB TYPE ",
    observationReport: "HPA 24 / 1225C ( SF6)",
  },
  {
    srNo: 3,
    description: "VOLTAGE/AMPS/KA",
    observationReport: "24KV / 1250A / 26.3KA",
  },
  {
    srNo: 4,
    description: "VCB SERIAL NO.",
    observationReport: "1VYN020411001007 / 2011",
  },
  {
    srNo: 5,
    description: "SPRING CHARGE MOTOR VOLTS",
    observationReport: "220V AC/DC",
  },
  {
    srNo: 6,
    description: "CLOSING COIL VOLTAGE",
    observationReport: "110V DC",
  },
  { srNo: 7, description: "TRIP COIL VOLTAGE", observationReport: "110V DC" },
  { srNo: 8, description: "COUNTER READING", observationReport: "0382" },
  {
    srNo: 9,
    description: "VISUAL INSPECTION FOR DAMAGED",
    observationReport: "OK",
  },
  { srNo: 10, description: "REPLACEMENT", observationReport: "NIL" },
  {
    srNo: 11,
    description: "THOROUGH CLEANING",
    observationReport: "YES DONE CRC SPRAY / SCOTCH BRITE",
  },
  {
    srNo: 12,
    description: "LUBRICATION OF MOVING PARTS",
    observationReport: "Done to all moving parts",
  },
  { srNo: 13, description: "TORQUE", observationReport: "NA" },
  {
    srNo: 14,
    description: "ON/OFF OPERATION ELECT/MANUAL",
    observationReport: "Manual and Electrical Operation checked OK",
  },
  {
    srNo: 15,
    description: "SF6 CHECKING",
    observationReport:
      "Checked megger meter for healthiness and megger taken since each pole.",
  },
  { srNo: 16, description: "RACK IN/OUT CHECKING", observationReport: "OK" },
  {
    srNo: 17,
    description: "SHUTTER MOVEMENT CHECKING",
    observationReport: "OK",
  },
  {
    srNo: 18,
    description: "DRIVE MECHANISM CHECKING",
    observationReport: "OK",
  },
  {
    srNo: 19,
    description: "CHECKING CB/DOOR INTERLOCK",
    observationReport: "OK",
  },
  {
    srNo: 20,
    description: "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )",
    observationReport: "special",
    subRows: [
      {
        description: "BETWEEN UPPER AND LOWER CONTACT",
        r: "1 TΩ",
        y: "1 TΩ",
        b: "1 TΩ",
      },
      { description: "PHASE TO EARTH", r: "1 TΩ", y: "1 TΩ", b: "1 TΩ" },
      { description: "PHASE TO PHASE", r: ">1 TΩ", y: ">1 TΩ", b: ">1 TΩ" },
    ],
  },
  {
    srNo: 21,
    description: "CHECKING CB TIMING",
    observationReport: "special",
    subRows: [
      { description: "CLOSE (ms)", r: "60", y: "59", b: "62" },
      { description: "OPEN (ms)", r: "46", y: "44", b: "44" },
    ],
  },
  {
    srNo: 22,
    description: "CONTACT RESISTANCE ( MICRO OHM )",
    observationReport: "special",
    rValue: "36.4 μΩ",
    yValue: "33.9 μΩ",
    bValue: "37.5 μΩ",
  },

  { srNo: 23, description: "OTHERS", observationReport: "NIL" },
  {
    srNo: 24,
    description: "REMARK",
    observationReport: "Breaker found working satisfactory.",
  },
];

export default function HTBreakerReportCreate() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

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
      report_date: "",
      report_number: "",
      report_description:
        "We have the pleasure in informing you that we have carried out transformer oil filtration at site & tested the sample of transformer oil for dielectric strength in accordance with 1866:2017 and the results are as under.",
      kva: "",
      voltage: "",
      make: "",
      sr_no: "",
      transformer_oil_quantity: "",
      transformer_before_filtration: "",
      transformer_after_filtration: "",
      oltc_make_type: "",
      oltc_oil_quantity: "",
      oltc_before_filtration: "",
      oltc_after_filtration: "",
      remark: "",
      clients_representative: "",
      tested_by: "",
      company_id: "",
      date_of_filtration: "",
      manufacturing_year: "",
      id: "0",
    },
  });

  const company = useAppSelector(selectCompany);
  const dispatch = useAppDispatch();

  useEffect(() => {
    !company && dispatch(fetchCompanyAsync());
  }, [company]);

  async function onSubmit(data: z.infer<typeof reportFormSchema>) {
    try {
      const res = await axios.post(
        BASE_URL + "API/Add/Oil/Filtration/Test/Report",
        { ...data, image_data: { x: position.x } }
      );
      if (res.status === 201) {
        toast.success("Report submitted successfully!");
        form.reset();
        dispatch(fetchOilReportAsync());
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    }
    // You can also make an API POST request here
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Form Section */}
        <Card className="h-fit">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-800">
              Create Oil Filtration Test Report
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
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="report_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
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
                          className={`bg-background hover:bg-background border-input w-full justify-between px-2 font-normal outline-offset-0 outline-none focus-visible:outline-[3px] ${
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
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="report_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Description</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief description of the report"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kva"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KVA</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1250 KVA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="voltage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voltage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 22000V / 433V" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <FormControl>
                          <Input placeholder="Transformer make" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sr_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serial Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 41083/1 Year - 2011"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="manufacturing_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturing Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2011" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="transformer_oil_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transformer Oil Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 1500 LITERS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="transformer_before_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BDV Before Filtration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 36 KV" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transformer_after_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BDV After Filtration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Sample withdrawn at 80 KV for 1 minute"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="oltc_make_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OLTC Make/Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 240 LITERS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oltc_oil_quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OLTC Oil Quantity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 240 LITERS" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="oltc_before_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BDV Before Filtration</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 40 KV" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oltc_after_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BDV After Filtration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Sample withdrawn at 80 KV for 1 minute"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="remark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remark</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter detailed remarks about the filtration process..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clients_representative"
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
                    name="tested_by"
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
              <OilReport
                reportData={{
                  ...form.getValues(),
                  image_data: { x: position.x },
                }}
                companyData={company || []}
              />
            </PDFViewer> */}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card className="h-auto overflow-auto">
          <div className="max-w-[2480px] max-h-[3508px]  px-8 mx-auto  flex flex-col">
            {/* Header */}
            <div className="border border-gray-300">
              <div className="p-2">
                <div className="flex items-center justify-between">
                  <div className="w-[40%]">
                    <img src="/oka.png" alt="Logo" className="w-full" />
                  </div>
                  <div className="text-right text-xs w-[40%]">
                    <img src="/l&k.jpeg" alt="Logo" className="w-full" />
                    <p className="text-blue-600 font-bold">
                      L&K AUTHORIZED SERVICE CENTER
                    </p>
                  </div>
                </div>
                <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
              </div>
              <div className="px-6 py-1">
                <div className="flex flex-wrap justify-between max-w-[90%] mx-auto tinos-regular">
                  <div>
                    Client:- M/s Dr. Acharya Laboratories Pvt. Ltd,
                    Ambernath(E).{" "}
                  </div>
                  <div>Date:- 02/04/2025</div>
                  <div>Location:- Main HT Room.</div>
                </div>
                <table className="w-full border-collapse border border-black">
                  {/* Header */}
                  <thead>
                    <tr className="">
                      <th className="border border-black px-3 py-1 text-left font-semibold text-sm text-nowrap">
                        Sr No.
                      </th>
                      <th className="border border-black px-3 py-1 text-center font-semibold text-sm">
                        Description
                      </th>
                      <th className="border border-black px-3 py-1 text-center font-semibold text-sm">
                        Observation Report
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspectionData.map((item, index) => (
                      <React.Fragment key={index}>
                        <tr>
                          <td className="border border-black px-3  text-sm text-center align-center">
                            {item.srNo}
                          </td>
                          <td className="border border-black px-3  text-sm font-medium align-center">
                            {item.description}
                          </td>
                          <td className="border border-black px-0 py-0 text-sm align-center text-center ">
                            {item.observationReport === "special" ? (
                              <div className="flex h-full">
                                <div
                                  className={`flex-1 px-2 ${
                                    item.description ==
                                    "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                      ? "py-[10px] px-3"
                                      : item.description == "CHECKING CB TIMING"
                                      ? "py-[2px] px-4"
                                      : "py-0 px-2"
                                  } border-r border-black font-semibold text-center`}
                                >
                                  {item.description ==
                                  "CONTACT RESISTANCE ( MICRO OHM )"
                                    ? item.rValue
                                    : "R"}
                                </div>
                                <div
                                  className={`flex-1 px-2 ${
                                    item.description ==
                                    "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                      ? "py-[10px] px-3"
                                      : item.description == "CHECKING CB TIMING"
                                      ? "py-[2px] px-4"
                                      : "py-0"
                                  } border-r border-black font-semibold text-center`}
                                >
                                  {item.description ==
                                  "CONTACT RESISTANCE ( MICRO OHM )"
                                    ? item.rValue
                                    : "Y"}
                                </div>
                                <div
                                  className={`flex-1 px-2 ${
                                    item.description ==
                                    "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                      ? "py-[10px] px-3"
                                      : item.description == "CHECKING CB TIMING"
                                      ? "py-[2px] px-4"
                                      : "py-0"
                                  }  font-semibold text-center`}
                                >
                                  {item.description ==
                                  "CONTACT RESISTANCE ( MICRO OHM )"
                                    ? item.rValue
                                    : "B"}
                                </div>
                              </div>
                            ) : (
                              <div className="px-3 ">
                                {item.observationReport}
                              </div>
                            )}
                          </td>
                        </tr>

                        {/* Sub-rows for items with detailed measurements */}
                        {item.subRows &&
                          item.subRows.map((subRow, subIndex) => (
                            <tr>
                              <td className="border border-black px-3  text-sm"></td>
                              <td className="border border-black px-3  text-sm pl-6">
                                {subRow.description}
                              </td>
                              <td className="border border-black px-0 py-0 text-sm">
                                <div className="flex h-full">
                                  <div
                                    className={`flex-1 ${"px-3"}  border-r border-black text-center`}
                                  >
                                    {subRow.r}
                                  </div>
                                  <div
                                    className={`flex-1 ${"px-3"}  border-r border-black text-center`}
                                  >
                                    {subRow.y}
                                  </div>
                                  <div
                                    className={`flex-1 ${"px-3"}  text-center`}
                                  >
                                    {subRow.b}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}

                        {/* Remove the special header row logic as it's now handled above */}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                <div className="w-full flex justify-between items-center font-bold text-md px-3">
                  <div className="flex flex-col">
                    <span className="">For Client :</span>
                    <span>{form.watch("clients_representative") || "--"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="">For Ok Agencies :</span>
                    <span>{form.watch("tested_by") || "--"}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t-8 tinos-regular border-[#fcae08] text-center p-3 text-md mt-auto">
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
