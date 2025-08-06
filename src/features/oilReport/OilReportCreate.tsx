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
import { useParams } from "react-router-dom";
import { fetchOilReportAsync } from "@/features/oilReport/oilReportSlice";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";
import { PDFViewer } from "@react-pdf/renderer";
import OilReport from "@/components/template/OilReport";

export const reportFormSchema = z.object({
  report_date: z.string(),
  report_description: z.string().min(1, {
    message: "Description is required",
  }),
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
function convertDOF(dateStr: string): string {
  try {
    const date = parseISO(dateStr); // accepts 'YYYY-MM-DD'
    return formatWithOrdinal(date, "MMMM do, yyyy", { locale: enUS });
  } catch {
    return "";
  }
}

export default function OilReportCreate() {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [imageConstraints, setImageConstraints] = useState({
    left: "0px", // Position
    top: "0px", // Position
    width: "100px", // Size
    height: "100px", // Size
  });

  const form = useForm({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      report_date: "",
      report_description: "",
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
        data
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

  const { id } = useParams();

  useEffect(() => {
    if (id) {
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Form Section */}
        {/* <Card className="h-fit">
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
                <div className="grid grid-cols-2 gap-4">
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
                    name="company_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a company" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {company?.map((company) => (
                              <SelectItem
                                key={company.id}
                                value={`${company.id}`}
                              >
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                    name="manufacturing_year"
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="transformer_before_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transformer Before Filtration</FormLabel>
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
                        <FormLabel>Transformer After Filtration</FormLabel>
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
                        <FormLabel>OLTC Before Filtration</FormLabel>
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
                        <FormLabel>OLTC After Filtration</FormLabel>
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
                    name="date_of_filtration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Filteration</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
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
                    name="clients_representative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Representative</FormLabel>
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
                        <FormLabel>Tested By</FormLabel>
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
          </CardContent>
        </Card> */}

        {/* Preview Section */}
        <Card className="h-auto overflow-auto">
          <div className="w-[794px]  overflow-auto px-8 mx-auto tinos-regular flex flex-col">
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

              <div
                ref={containerRef}
                className="relative bg-white shadow-lg flex flex-col flex-1"
              >
                <div className="px-18 py-4 flex-1">
                  <div className="">
                    <div className="flex justify-between items-center ">
                      <div className="text-md font-bold">
                        <span className="text-md font-bold">Report No.:</span>{" "}
                        01/25-26
                      </div>
                      <div className="text-md font-bold">
                        <span className="font-bold">Date:</span>{" "}
                        {convertReportDate(form.watch("report_date")) ||
                          "--/--/----"}
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center py-2">
                      <h1 className="text-2xl font-bold underline">
                        OIL FILTRATION TEST REPORT
                      </h1>
                    </div>
                  </div>

                  {/* Client Information */}
                  <table className="table-auto border-collapse">
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
                  <div className="mb-6">
                    <h2 className="font-bold text-lg mb-4 underline">
                      Transformer Details:
                    </h2>

                    <div className="">
                      <table className="w-full font-medium text-lg ">
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
                                ? form.watch("transformer_before_filtration") +
                                  " KV"
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
                              Before Filtration
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
                              After Filtration
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
                            <td className="py-1 text-justify leading-tight max-w-[50px] break-words whitespace-pre-wrap overflow-hidden">
                              {form.watch("remark") || "--"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Date Of Filtration{" "}
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {convertDOF(form.watch("date_of_filtration")) ||
                                "--/--/----"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Client’s Representative
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {form.watch("clients_representative") || "--"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Tested By
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {form.watch("tested_by") || "--"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <motion.img
                  ref={imgRef}
                  drag
                  dragConstraints={containerRef}
                  onDrag={(event, info) => {
                    console.log("Current position:", info.point);
                    setImageConstraints({
                      left: `${info.point.x}px`, // Position
                      top: `${info.point.y}px`, // Position
                      width: "100px", // Fixed size or from another source
                      height: "100px", // Fixed size or from another source
                    });
                  }}
                  src="/image.png"
                  className="absolute w-36 h-12 right-3.5 object-cover"
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

        <PDFViewer width="100%" height="600px" className="w-full">
          <OilReport
            reportData={form.watch()}
            companyData={company || []}
            imageConstraints={imageConstraints}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
