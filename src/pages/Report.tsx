import { PDFViewer } from "@react-pdf/renderer";
import Report2 from "./Report2";

export default function Report() {
  return (
    <div className=" flex justify-between h-auto bg-white  font-sans text-sm border border-gray-300 shadow-lg">
      {/* Header */}
      <div>
        <div className=" mb-4">
          <div className=" text-white p-2 flex items-center justify-between">
            <div className="flex items-center gap-3 w-[40%]">
              <img src="/oka.png" alt="Logo" className="w-full" />
            </div>
            <div className="text-right text-xs w-[40%]">
              <img src="/l&k.jpeg" alt="Logo" className="w-full" />
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
              <p className="text-md font-bold">Report No.: 01/25-26</p>
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
            We have the pleasure in informing you that we have carried out
            transformer oil filtration on site & tested the sample of
            transformer oil for dielectric strength in accordance with 1966-2017
            and the results are as under.
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
                    <div className="w-12 inline-block">:</div>1250 KVA
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">Voltage</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>22000V / 433V
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
                    <div className="w-12 inline-block">:</div>41083/1 Year -
                    2011
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">Transformer Oil Quantity</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>1500 LITERS
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">Before Filtration</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>36 KV
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">After Filtration</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>Sample withdrawn
                    at 80 KV for 1 minute
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">Oil-Cut Oil Quantity</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>240 LITERS
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">Before Filtration</td>
                  <td className="">
                    {" "}
                    <div className="w-12 inline-block">:</div>40 KV
                  </td>
                </tr>
                <tr className="">
                  <td className=" ">After Filtration</td>
                  <td className="">
                    <div className="w-12 inline-block">:</div>Sample withdrawn
                    at 80 KV for 1 minute
                  </td>
                </tr>
                <tr className="align-top">
                  <td className="align-top font-semibold">Remark</td>
                  <td className="align-top">
                    <div className="flex items-start justify-between">
                      <div className="w-64">:</div>
                      <div className="max-w-prose">
                        Dielectric strength of transformer oil is Satisfactory.
                        Silica Gel Replaced. All oil Servicing Completed.
                        Transformer Tested. Breather & Valve O.L.T.C. Top Bottom
                        oil gauge, temp. Total Gasket and Total Gasket Not Boil
                        is replaced. O.L.T.C. oil new. Filled up and painting
                        Epoxy.
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
            <strong>Address for correspondence:</strong> 101, Nimesh Industrial
            Premises, Bhoir Nagar, Mulund(E),
          </p>
          <p>Mumbai-400081 Email : okagencies@gmail.com Tel : 022-25693547</p>
          <p>
            <strong>Website :</strong>{" "}
            <span className="text-blue-600">www.okagencies.in</span>{" "}
            <strong>GST NO :</strong> 27AAHFO4632H1ZP
          </p>
        </div>
      </div>
      <PDFViewer width="100%" height="800px">
        <Report2 />
      </PDFViewer>
    </div>
  );
}
