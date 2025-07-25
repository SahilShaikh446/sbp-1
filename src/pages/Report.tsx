import OilReport from "../components/template/OilReport";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { use, useCallback, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
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
import { PreLoader } from "@/components/ui/Preloader";

export const reportFormSchema = z.object({
  report_date: z.string().min(1, "Report date is required"),
  report_description: z.string().min(1, "Description is required"),
  kva: z.string().min(1, "KVA is required"),
  voltage: z.string().min(1, "Voltage is required"),
  make: z.string().min(1, "Make is required"),
  sr_no: z.string().min(1, "Serial number is required"),
  transformer_oil_quantity: z
    .string()
    .min(1, "Transformer oil quantity is required"),
  transformer_before_filtration: z
    .string()
    .min(1, "Value before filtration is required"),
  transformer_after_filtration: z
    .string()
    .min(1, "Value after filtration is required"),
  oltc_oil_quantity: z.string().min(1, "OLTC oil quantity is required"),
  oltc_before_filtration: z
    .string()
    .min(1, "OLTC before filtration is required"),
  oltc_after_filtration: z.string().min(1, "OLTC after filtration is required"),
  remark: z.string().min(1, "Remark is required"),
  clients_representative: z
    .string()
    .min(1, "Client representative is required"),
  tested_by: z.string().min(1, "Tested by is required"),
  company_id: z.string().min(1, "Company  is required"),
  date_of_filtration: z.string().min(1, "Date of filtration is required"),
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

export default function Report() {
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
      oltc_oil_quantity: "",
      oltc_before_filtration: "",
      oltc_after_filtration: "",
      remark: "",
      clients_representative: "",
      tested_by: "",
      company_id: "",
      date_of_filtration: "",
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
        </Card>

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

              <div className="bg-white shadow-lg flex flex-col flex-1">
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
                          "07.04.2025"}
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
                              <div>Ms. Dr. Acharya Laboratories Pvt. Ltd.,</div>
                              <div>Anand Nagar, Ambernath (East)</div>
                            </>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Description */}
                  <div className="mb-2 py-2 text-lg leading-6">
                    <p className="font-medium leading-tight max-w-[700px] break-words whitespace-pre-wrap overflow-hidden">
                      {form.watch("report_description") ||
                        "We have carried out oil filtration work for your transformer oil for dielectric strength in filtration at site & tested the sample after transformer oil for dielectric strength in accordance with 1866-2017 and the results are as under."}
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
                                : "1250 KVA"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Voltage</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("voltage") || "22000V / 433V"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Make</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("make") || "Voltamp"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">Sr. No.</td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("sr_no") || "41083/1 Year - 2011"}
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
                                : "1590 LITERS"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV Before Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("transformer_before_filtration") +
                                " KV" || "36 KV"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              BDV After Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("transformer_after_filtration") +
                                " KV" ||
                                "Sample withstood at 80 KV for 1 minute"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              OLTC Oil Quantity
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_oil_quantity") + " LITERS" ||
                                "210 LITERS"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              Before Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_before_filtration") + " KV" ||
                                "40 KV"}
                            </td>
                          </tr>
                          <tr className="">
                            <td className="py-0.5 font-medium">
                              After Filtration
                            </td>
                            <td className="py-0.5 text-center">:</td>
                            <td className="py-0.5">
                              {form.watch("oltc_after_filtration") ||
                                "Sample withstood at 80 KV for 1 minute"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Remark
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-1 text-justify leading-tight max-w-[50px] break-words whitespace-pre-wrap overflow-hidden">
                              {form.watch("remark") ||
                                "Dielectric strength of transformer oil is Satisfactory. Silica Gel Replaced. OLTC Servicing Done. Radiator, Main tank, Cable box, Conservator, Valve OLTC, Top Bottom oil gauge, mog, Total Gasket and Total Gasket Nut Bolt is replaced. OLTC oil new. Filled up and painting Epoxy."}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Date Of Filtration{" "}
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {convertDOF(form.watch("date_of_filtration")) ||
                                "April 7th, 2025"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Client’s Representative
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {form.watch("clients_representative") ||
                                "Mr. Sakharam Parab."}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-0.5 font-medium align-top">
                              Tested By
                            </td>
                            <td className="py-0.5 text-center align-top">:</td>
                            <td className="py-0.5 text-justify leading-relaxed">
                              {form.watch("tested_by") || "M/s. OK AGENCIES"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
