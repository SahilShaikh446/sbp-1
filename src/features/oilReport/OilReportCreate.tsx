import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
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
import { parseISO, format } from "date-fns";
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
import { addOneYear } from "./column";

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
  for_client: z.string(),
  for_ok_agency: z.string(),
  company_id: z.string(),
  next_date_of_filtriation: z.string().optional(),
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

export default function OilReportCreate() {
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
      for_client: "",
      for_ok_agency: "",
      company_id: "",
      next_date_of_filtriation: "",
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
    console.log({
      ...data,
      image_data: { x: position.x },
      next_date_of_filtriation: addOneYear(data.report_date),
    });
    try {
      const res = await axios.post(
        BASE_URL + "API/Add/Oil/Filtration/Test/Report",
        {
          ...data,
          image_data: { x: position.x },
          next_date_of_filtriation: addOneYear(data.report_date),
        }
      );
      if (res.status === 201) {
        toast.success("Report submitted successfully!");
        form.reset();
        dispatch(fetchOilReportAsync("page=0"));
      }
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
      console.error("Error submitting report:", error);
    }
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
          <div className="max-w-[2480px] max-h-[3508px]  px-8 mx-auto tinos-regular flex flex-col">
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
                      LK AUTHORIZED SERVICE CENTER
                    </p>
                  </div>
                </div>
                <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
              </div>

              <div
                className="relative bg-white  flex flex-col flex-1"
                ref={containerRef}
              >
                <div className="px-18 py- flex-1">
                  <div className="">
                    <div className="flex justify-between items-center ">
                      <div className="text-md font-bold">
                        <span className="text-md font-bold">Report No.:</span>{" "}
                        TR {form.watch("report_number") || "--"}
                      </div>
                      <div className="text-md font-bold">
                        <span className="font-bold">Date of Filteration:</span>{" "}
                        {convertReportDate(form.watch("report_date")) ||
                          "--/--/----"}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center py-2">
                      <h1
                        style={{ fontSize: "29px" }}
                        className=" font-bold underline"
                      >
                        OIL FILTRATION TEST REPORT
                      </h1>
                    </div>
                  </div>

                  {/* Client Information */}
                  <table className="table-auto border-collapse ">
                    <tbody className="font-bold">
                      <tr>
                        <td className="font-bold  align-top pr-6 ">CLIENT</td>
                        <td className="align-top min-w-[20px]">:</td>
                        <td className="align-top text-lg ">
                          {form.watch("company_id") ? (
                            <>
                              <div>
                                {
                                  company?.find(
                                    (i) =>
                                      `${i.id}` == `${form.watch("company_id")}`
                                  )?.name
                                }
                              </div>
                              <div>
                                {
                                  company?.find(
                                    (i) =>
                                      `${i.id}` == `${form.watch("company_id")}`
                                  )?.address
                                }
                              </div>
                            </>
                          ) : (
                            <>
                              <div>-</div>
                              <div>-</div>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Description */}
                  <div className="mb-2 py-2 text-lg leading-6">
                    <p className="font-medium leading-tight max-w-[700px] break-words whitespace-pre-wrap overflow-hidden">
                      {form.watch("report_description") || "-"}
                    </p>
                  </div>

                  {/* Transformer Details */}
                  <div className="">
                    <h2 className="font-bold text-lg mb-4 underline">
                      Transformer Details:
                    </h2>

                    <div className="">
                      <table className="w-full font-medium ">
                        <tbody>
                          <tr className="">
                            <td className="py-0.5 font-medium -r -black w-1/3">
                              KVA
                            </td>
                            <td className="py-0.5 text-center -r -black w-16">
                              :
                            </td>
                            <td className="py-0.5">
                              {form.watch("kva")
                                ? `${form.watch("kva")} KVA`
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Voltage</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("voltage") || "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Make</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("make") || "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Sr. No.</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("sr_no") || "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              Manufacturing Year
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("manufacturing_year") || "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              Transformer Oil Quantity
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("transformer_oil_quantity")
                                ? `${form.watch(
                                    "transformer_oil_quantity"
                                  )} LITERS`
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV Before Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("transformer_before_filtration")
                                ? form.watch("transformer_before_filtration")
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV After Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("transformer_after_filtration")
                                ? form.watch("transformer_after_filtration") +
                                  " KV"
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              OLTC Make/Type
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_make_type")
                                ? form.watch("oltc_make_type")
                                : "--"}
                            </td>
                          </tr>

                          <tr className="">
                            <td className="py-0.5 font-medium">
                              OLTC Oil Quantity
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_oil_quantity")
                                ? form.watch("oltc_oil_quantity") + " LITERS"
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV Before Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_before_filtration")
                                ? form.watch("oltc_before_filtration") + " KV"
                                : "--"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV After Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_after_filtration") || "--"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Remark
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-1 text-justify  max-w-[50px] break-words whitespace-pre-wrap overflow-hidden">
                              {form.watch("remark") || "--"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="w-full flex justify-between items-center font-bold text-lg">
                    <div className="flex flex-col">
                      <span className="">For Client :</span>
                      <span>{form.watch("for_client") || "--"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="">For Ok Agencies :</span>
                      <span>{form.watch("for_ok_agency") || "--"}</span>
                    </div>
                  </div>
                </div>
                <img
                  ref={imgRef}
                  className="object-contain max-h-[150px] max-w-[150px]  bottom-0 cursor-grab ml-[65px]"
                  src="/stamp.jpg"
                  onMouseDown={handleMouseDown}
                  style={{
                    transform: `translateX(${position.x}px)`,
                  }}
                  alt="Stamp"
                />
              </div>

              {/* Footer */}
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
