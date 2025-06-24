import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import Report2 from "./Report2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ReportData {
  report_date: string;
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

  const handleInputChange = (
    field: keyof ReportData,
    value: string | number
  ) => {
    setReportData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateReport = () => {
    setShowPDF(true);
  };
  return (
    <div className=" flex justify-between h-auto bg-white  font-sans text-sm border border-gray-300 shadow-lg">
      {/* Header */}

      {/* <PDFViewer width="100%" height="800px">
        <Report2 />
      </PDFViewer> */}

      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Oil Filtration Test Report Generator
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Section */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Report Details Form</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[800px] overflow-y-auto">
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

                <div className="grid grid-cols-2 gap-4">
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

                <div className="flex gap-4 pt-4">
                  <Button onClick={handleGenerateReport} className="flex-1">
                    Generate PDF Report
                  </Button>
                  {/* {showPDF && (
                    <PDFDownloadLink
                      document={<Report2 data={reportData} />}
                      fileName={`oil-filtration-report-${
                        reportData.report_date || "draft"
                      }.pdf`}
                    >
                      {({ loading }) => (
                        <Button variant="outline" disabled={loading}>
                          {loading ? "Generating..." : "Download PDF"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )} */}
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {showPDF ? (
                  <div className="h-[800px]">
                    <div>
                      <div className=" mb-4">
                        <div className=" text-white p-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 w-[40%]">
                            <img src="/oka.png" alt="Logo" className="w-full" />
                          </div>
                          <div className="text-right text-xs w-[40%]">
                            <img
                              src="/l&k.jpeg"
                              alt="Logo"
                              className="w-full"
                            />
                            <p className="text-[#5c9ed4] font-bold ">
                              L&K AUTHORIZED SERVICE CENTER
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                        <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
                      </div>

                      <div className="max-w-[75%] mx-auto">
                        {/* Report Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-md font-bold">
                              Report No.: 01/25-26
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Date: 07.04.2025</strong>
                            </p>
                          </div>
                        </div>

                        <h2 className="text-center text-xl font-bold mb-2 underline">
                          OIL FILTRATION TEST REPORT
                        </h2>

                        {/* Client Information */}
                        <div className="mb-6 flex items-start gap-4 font-bold">
                          <p className="w-24 ">CLIENT :</p>
                          <div>
                            <p>M/s. Dr. Acharya Laboratories Pvt. Ltd.</p>
                            <p>Anand Nagar, Ambernath (East)</p>
                          </div>
                        </div>

                        <p className="mb-2 text-justify">
                          We have the pleasure in informing you that we have
                          carried out transformer oil filtration on site &
                          tested the sample of transformer oil for dielectric
                          strength in accordance with 1966-2017 and the results
                          are as under.
                        </p>

                        {/* Test Results Table */}
                        <div className=" mb-2">
                          <table className="w-full text-xs border-separate border-spacing-y-2">
                            <tbody className="font-semibold">
                              <tr className="">
                                <td className="  font-bold underline text-lg ">
                                  Transformer Details:
                                </td>
                                <td className=""></td>
                              </tr>
                              <tr className="">
                                <td className="w-54">KVA</td>
                                <td className="">
                                  <div className="w-12 inline-block">:</div>1250
                                  KVA
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Voltage</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  22000V / 433V
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Volume</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>-
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Sr. No.</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  41083/1 Year - 2011
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Transformer Oil Quantity</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>1500
                                  LITERS
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Before Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>36
                                  KV
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">After Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  Sample withdrawn at 80 KV for 1 minute
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Oil-Cut Oil Quantity</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>240
                                  LITERS
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Before Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>40
                                  KV
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">After Filtration</td>
                                <td className="">
                                  <div className="w-12 inline-block">:</div>
                                  Sample withdrawn at 80 KV for 1 minute
                                </td>
                              </tr>
                              <tr className="align-top">
                                <td className="align-top font-semibold">
                                  Remark
                                </td>
                                <td className="align-top">
                                  <div className="flex items-start justify-between">
                                    <div className="w-64">:</div>
                                    <div className="max-w-prose">
                                      Dielectric strength of transformer oil is
                                      Satisfactory. Silica Gel Replaced. All oil
                                      Servicing Completed. Transformer Tested.
                                      Breather & Valve O.L.T.C. Top Bottom oil
                                      gauge, temp. Total Gasket and Total Gasket
                                      Not Boil is replaced. O.L.T.C. oil new.
                                      Filled up and painting Epoxy.
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Additional Information */}
                      </div>

                      {/* Footer */}
                      <div className="border-t-2 border-blue-600 pt-4 text-xs text-center">
                        <p>
                          <strong>Address for correspondence:</strong> 101,
                          Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
                        </p>
                        <p>
                          Mumbai-400081 Email : okagencies@gmail.com Tel :
                          022-25693547
                        </p>
                        <p>
                          <strong>Website :</strong>{" "}
                          <span className="text-blue-600">
                            www.okagencies.in
                          </span>{" "}
                          <strong>GST NO :</strong> 27AAHFO4632H1ZP
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // <ReportPreview data={reportData} />
                  <div className="h-[800px]">
                    <div>
                      <div className=" mb-4">
                        <div className=" text-white p-2 flex items-center justify-between">
                          <div className="flex items-center gap-3 w-[40%]">
                            <img src="/oka.png" alt="Logo" className="w-full" />
                          </div>
                          <div className="text-right text-xs w-[40%]">
                            <img
                              src="/l&k.jpeg"
                              alt="Logo"
                              className="w-full"
                            />
                            <p className="text-[#5c9ed4] font-bold ">
                              L&K AUTHORIZED SERVICE CENTER
                            </p>
                          </div>
                        </div>
                        <div className="bg-[#fcae08] text-white text-center py-1 text-xs font-semibold"></div>
                        <div className="bg-[#084f88] text-white text-center py-1 text-xs font-semibold"></div>
                      </div>

                      <div className="max-w-[75%] mx-auto">
                        {/* Report Header */}
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-md font-bold">
                              Report No.: 01/25-26
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Date: {reportData.report_date}</strong>
                            </p>
                          </div>
                        </div>

                        <h2 className="text-center text-xl font-bold mb-2 underline">
                          OIL FILTRATION TEST REPORT
                        </h2>

                        {/* Client Information */}
                        <div className="mb-6 flex items-start gap-4 font-bold">
                          <p className="w-24 ">CLIENT :</p>
                          <div>
                            {reportData.clients_representative ? (
                              <p>{reportData.clients_representative}</p>
                            ) : (
                              <p>M/s. Dr. Acharya Laboratories Pvt. Ltd.</p>
                            )}
                          </div>
                        </div>

                        <p className="mb-2 text-justify">
                          {reportData.report_description ||
                            "No description available."}
                        </p>

                        {/* Test Results Table */}
                        <div className=" mb-2">
                          <table className="w-full text-xs border-separate border-spacing-y-2">
                            <tbody className="font-semibold">
                              <tr className="">
                                <td className="  font-bold underline text-lg ">
                                  Transformer Details:
                                </td>
                                <td className=""></td>
                              </tr>
                              <tr className="">
                                <td className="w-54">KVA</td>
                                <td className="">
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.kva || "1250"} KVA
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Voltage</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.voltage || "22000V / 433V"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Volume</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>-
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Sr. No.</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.sr_no || "41083/1 Year - 2011"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Transformer Oil Quantity</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.transformer_oil_quantity ||
                                    "1500"}{" "}
                                  LITERS
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Before Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.transformer_before_filtration ||
                                    "36"}{" "}
                                  KV
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">After Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.transformer_after_filtration ||
                                    "Sample withdrawn at 80 KV for 1 minute"}
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Oil-Cut Oil Quantity</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.oltc_oil_quantity || "240"} LITERS
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">Before Filtration</td>
                                <td className="">
                                  {" "}
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.oltc_before_filtration || "40"} KV
                                </td>
                              </tr>
                              <tr className="">
                                <td className=" ">After Filtration</td>
                                <td className="">
                                  <div className="w-12 inline-block">:</div>
                                  {reportData.oltc_after_filtration ||
                                    "Sample withdrawn at 80 KV for 1 minute"}{" "}
                                </td>
                              </tr>
                              <tr className="align-top">
                                <td className="align-top font-semibold">
                                  Remark
                                </td>
                                <td className="align-top">
                                  <div className="flex items-start justify-between">
                                    <div className="w-12 ">:</div>
                                    <div className="max-w-prose text-wrap flex-wrap">
                                      {reportData.remark ||
                                        "No remarks available."}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Additional Information */}
                      </div>

                      {/* Footer */}
                      <div className="border-t-2 border-blue-600 pt-4 text-xs text-center">
                        <p>
                          <strong>Address for correspondence:</strong> 101,
                          Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
                        </p>
                        <p>
                          Mumbai-400081 Email : okagencies@gmail.com Tel :
                          022-25693547
                        </p>
                        <p>
                          <strong>Website :</strong>{" "}
                          <span className="text-blue-600">
                            www.okagencies.in
                          </span>{" "}
                          <strong>GST NO :</strong> 27AAHFO4632H1ZP
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
