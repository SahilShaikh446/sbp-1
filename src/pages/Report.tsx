import Report2 from "./Report2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";

interface ReportData {
  report_date: string;
  client: string;
  report_description: string;
  kva: string;
  voltage: string;
  make: string;
  sr_no: string;
  transformer_oil_quantity: string;
  transformer_before_filtration: string;
  transformer_after_filtration: string;
  oltc_oil_quantity: string;
  oltc_before_filtration: string;
  oltc_after_filtration: string;
  remark: string;
  date_of_filtration: string;
  clients_representative: string;
  tested_by: string;
  company_id: number;
}

export default function Report() {
  const [reportData, setReportData] = useState<ReportData>({
    report_date: "",
    client: "",
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
    date_of_filtration: "",
    clients_representative: "",
    tested_by: "",
    company_id: 0,
  });

  const [showPDF, setShowPDF] = useState(false);

  const handleInputChange = useCallback(
    (field: keyof ReportData, value: string | number) => {
      setReportData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleGenerateReport = () => {
    setShowPDF(true);
  };

  return (
    <div className="flex justify-between h-auto bg-white font-sans text-sm border border-gray-300 shadow-lg">
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max- mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Oil Filtration Test Report Generator
          </h1>

          <div className="grid grid-cols-2 gap-6">
            {/* Form Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Report Details Form</CardTitle>
              </CardHeader>
              {/* <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="report_date">Report Date</Label>
                    <Input
                      id="report_date"
                      type="date"
                      value={reportData.report_date}
                      onChange={(e) =>
                        handleInputChange("report_date", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_filtration">
                      Date of Filtration
                    </Label>
                    <Input
                      id="date_of_filtration"
                      type="date"
                      value={reportData.date_of_filtration}
                      onChange={(e) =>
                        handleInputChange("date_of_filtration", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="client">Client</Label>
                  <Textarea
                    id="client"
                    value={reportData.client}
                    onChange={(e) =>
                      handleInputChange("client", e.target.value)
                    }
                    placeholder="Client Name"
                  />
                </div>
                <div>
                  <Label htmlFor="report_description">Report Description</Label>
                  <Input
                    id="report_description"
                    value={reportData.report_description}
                    onChange={(e) =>
                      handleInputChange("report_description", e.target.value)
                    }
                    placeholder="Brief description of the report"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="kva">KVA</Label>
                    <Input
                      id="kva"
                      value={reportData.kva}
                      onChange={(e) => handleInputChange("kva", e.target.value)}
                      placeholder="e.g., 1250 KVA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="voltage">Voltage</Label>
                    <Input
                      id="voltage"
                      value={reportData.voltage}
                      onChange={(e) =>
                        handleInputChange("voltage", e.target.value)
                      }
                      placeholder="e.g., 22000V / 433V"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={reportData.make}
                      onChange={(e) =>
                        handleInputChange("make", e.target.value)
                      }
                      placeholder="Transformer make"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sr_no">Serial Number</Label>
                    <Input
                      id="sr_no"
                      value={reportData.sr_no}
                      onChange={(e) =>
                        handleInputChange("sr_no", e.target.value)
                      }
                      placeholder="e.g., 41083/1 Year - 2011"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="transformer_oil_quantity">
                    Transformer Oil Quantity
                  </Label>
                  <Input
                    id="transformer_oil_quantity"
                    value={reportData.transformer_oil_quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "transformer_oil_quantity",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 1500 LITERS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transformer_before_filtration">
                      Transformer Before Filtration
                    </Label>
                    <Input
                      id="transformer_before_filtration"
                      value={reportData.transformer_before_filtration}
                      onChange={(e) =>
                        handleInputChange(
                          "transformer_before_filtration",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 36 KV"
                    />
                  </div>
                  <div>
                    <Label htmlFor="transformer_after_filtration">
                      Transformer After Filtration
                    </Label>
                    <Input
                      id="transformer_after_filtration"
                      value={reportData.transformer_after_filtration}
                      onChange={(e) =>
                        handleInputChange(
                          "transformer_after_filtration",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Sample withdrawn at 80 KV for 1 minute"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="oltc_oil_quantity">OLTC Oil Quantity</Label>
                  <Input
                    id="oltc_oil_quantity"
                    value={reportData.oltc_oil_quantity}
                    onChange={(e) =>
                      handleInputChange("oltc_oil_quantity", e.target.value)
                    }
                    placeholder="e.g., 240 LITERS"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="oltc_before_filtration">
                      OLTC Before Filtration
                    </Label>
                    <Input
                      id="oltc_before_filtration"
                      value={reportData.oltc_before_filtration}
                      onChange={(e) =>
                        handleInputChange(
                          "oltc_before_filtration",
                          e.target.value
                        )
                      }
                      placeholder="e.g., 40 KV"
                    />
                  </div>
                  <div>
                    <Label htmlFor="oltc_after_filtration">
                      OLTC After Filtration
                    </Label>
                    <Input
                      id="oltc_after_filtration"
                      value={reportData.oltc_after_filtration}
                      onChange={(e) =>
                        handleInputChange(
                          "oltc_after_filtration",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Sample withdrawn at 80 KV for 1 minute"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="remark">Remark</Label>
                  <Textarea
                    id="remark"
                    value={reportData.remark}
                    onChange={(e) =>
                      handleInputChange("remark", e.target.value)
                    }
                    placeholder="Enter detailed remarks about the filtration process..."
                    rows={4}
                  />
                </div>

                <div className="grid gridDIV grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clients_representative">
                      Client's Representative
                    </Label>
                    <Input
                      id="clients_representative"
                      value={reportData.clients_representative}
                      onChange={(e) =>
                        handleInputChange(
                          "clients_representative",
                          e.target.value
                        )
                      }
                      placeholder="e.g., Mr. Sakharam Parab"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tested_by">Tested By</Label>
                    <Input
                      id="tested_by"
                      value={reportData.tested_by}
                      onChange={(e) =>
                        handleInputChange("tested_by", e.target.value)
                      }
                      placeholder="e.g., M/s. OK AGENCIES"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <PDFDownloadLink
                    document={<Report2 reportData={reportData} />}
                    fileName="oil_filtration_report.pdf"
                  >
                    {({ loading }) =>
                      loading ? (
                        <Button disabled>Loading...</Button>
                      ) : (
                        <Button>Download PDF</Button>
                      )
                    }
                  </PDFDownloadLink>
                  <PDFViewer width="100%" height="600px">
                    <Report2 reportData={reportData} />
                  </PDFViewer>
                </div>
              </CardContent> */}
              <PDFViewer width="100%" height="600px">
                <Report2 reportData={reportData} />
              </PDFViewer>
            </Card>

            {/* Preview Section */}
            <Card className="h-fit overflow-auto">
              <div className="w-[794px] min-h-[1123px] overflow-auto p-8 mx-auto tinos-regular flex flex-col">
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
                            <span className="text-md font-bold">
                              Report No.:
                            </span>{" "}
                            01/25-26
                          </div>
                          <div className="text-md font-bold">
                            <span className="font-bold">Date:</span>{" "}
                            {reportData.report_date || "07.04.2025"}
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
                            <td className="font-bold  align-top pr-6 ">
                              CLIENT
                            </td>
                            <td className="align-top min-w-[20px]">:</td>
                            <td className="align-top text-lg ">
                              {reportData.client ? (
                                <div className=" max-w-[320px] break-words">
                                  {reportData.client}
                                </div>
                              ) : (
                                <>
                                  <div>
                                    Ms. Dr. Acharya Laboratories Pvt. Ltd.,
                                  </div>
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
                          {reportData.report_description ||
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
                                  {reportData.kva || "1250 KVA"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">Voltage</td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.voltage || "22000V / 433V"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">Make</td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.make || "Voltamp"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">Sr. No.</td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.sr_no || "41083/1 Year - 2011"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  Transformer Oil Quantity
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.transformer_oil_quantity ||
                                    "1590 LITERS"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  Before Filtration
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.transformer_before_filtration ||
                                    "36 KV"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  After Filtration
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.transformer_after_filtration ||
                                    "Sample withstood at 80 KV for 1 minute"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  OLTC Oil Quantity
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.oltc_oil_quantity || "210 LITERS"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  Before Filtration
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.oltc_before_filtration || "40 KV"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className="py-0.5 font-medium">
                                  After Filtration
                                </td>
                                <td className="py-0.5 text-center">:</td>
                                <td className="py-0.5">
                                  {reportData.oltc_after_filtration ||
                                    "Sample withstood at 80 KV for 1 minute"}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-0.5 font-medium align-top">
                                  Remark
                                </td>
                                <td className="py-0.5 text-center align-top">
                                  :
                                </td>
                                <td className="py-1 text-justify leading-tight max-w-[50px] break-words whitespace-pre-wrap overflow-hidden">
                                  {reportData.remark ||
                                    "Dielectric strength of transformer oil is Satisfactory. Silica Gel Replaced. OLTC Servicing Done. Radiator, Main tank, Cable box, Conservator, Valve OLTC, Top Bottom oil gauge, mog, Total Gasket and Total Gasket Nut Bolt is replaced. OLTC oil new. Filled up and painting Epoxy."}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-0.5 font-medium align-top">
                                  Date Of Filtration{" "}
                                </td>
                                <td className="py-0.5 text-center align-top">
                                  :
                                </td>
                                <td className="py-0.5 text-justify leading-relaxed">
                                  April 3rd, 2025
                                </td>
                              </tr>
                              <tr>
                                <td className="py-0.5 font-medium align-top">
                                  Client’s Representative
                                </td>
                                <td className="py-0.5 text-center align-top">
                                  :
                                </td>
                                <td className="py-0.5 text-justify leading-relaxed">
                                  {reportData.clients_representative ||
                                    "Mr. Sakharam Parab."}
                                </td>
                              </tr>
                              <tr>
                                <td className="py-0.5 font-medium align-top">
                                  Tested By
                                </td>
                                <td className="py-0.5 text-center align-top">
                                  :
                                </td>
                                <td className="py-0.5 text-justify leading-relaxed">
                                  {reportData.tested_by || "M/s. OK AGENCIES"}
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
                      <span className="font-bold">
                        Address for correspondence:
                      </span>{" "}
                      101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
                    </p>
                    <p>
                      Mumbai-400081, <span className="font-bold">Contact</span>{" "}
                      - 9619866401, <span className="font-bold">Email</span> -{" "}
                      <span className="text-blue-900 font-bold">
                        ok_agencies@yahoo.com,
                      </span>
                    </p>
                    <p>
                      <span className="font-bold">Website</span>{" "}
                      <span className="text-blue-900 font-bold">
                        – www.okagencies.in;
                      </span>{" "}
                      <span className="font-bold">
                        GST NO.: 27ABDPJ0462B1Z9
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
