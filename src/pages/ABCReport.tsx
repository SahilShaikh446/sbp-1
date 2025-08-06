import { Card } from "@/components/ui/card";

function ABCReport() {
  return (
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

          <div className="px-9 py-2">
            <div className=" border border-black">
              <table className="w-full text-center table-fixed">
                <tr className="border-b border-black">
                  <td className="font-bold text-2xl underline text-center align-middle">
                    ACB SERVICE REPORT
                  </td>
                </tr>
                <div className="text-sm">
                  <tr className=" flex justify-between pr-8 pl-4">
                    <td className="font-bold  text-left">
                      Test Report No. 12/25-26
                    </td>
                    <td className="font-bold  text-left">Date:- 26-04-2025</td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className="font-bold  text-left">
                      Name of Client: M/s. Dr. Acharya Laboratories Pvt. Ltd;
                      Ambernath (E)
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className="font-bold  text-left">
                      <span className="font-bold mr-21">Location: </span>Main
                      SS; PCC panel{" "}
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-15">Type of ACB: </span>
                      CNCS2000C / 4 Pole / EDO
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-2">
                        Closing Coil Voltage:{" "}
                      </span>
                      240 VAC
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-16">ACB Sr. No.: </span>
                      MU 483387
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-9">Shunt Release: </span>
                      240 VAC
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-5">
                        Feeder Designation:{" "}
                      </span>
                      1F2 – Incomer of DG Set
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-9">Motor Voltage: </span>
                      240 VAC
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-11">Current Rating: </span>
                      2000A (CT Tap – 2000A)
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-12">U/V Release: </span>
                      240 VAC
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-11">Type of Release: </span>
                      SR18G Release
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold">Setting- 50% </span>
                    </td>
                  </tr>
                </div>
                <tr className="border-t border-b border-black">
                  <td className="font-bold text-2xl  text-center align-middle">
                    INSPECTION
                  </td>
                </tr>
                <div className="text-sm">
                  <tr className=" flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-32">
                        ON/OFF Operations Manual:{" "}
                      </span>
                      OK
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-12">Moving:</span>
                      OK
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-20">
                        Condition of Arcing Contacts (Fixed):{" "}
                      </span>
                      OK
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-11">Moving: </span>
                      OK
                    </td>
                  </tr>
                  <tr className="border-t border-black flex justify-between pr-8 pl-4">
                    <td className=" text-left w-2/2 border-r border-black">
                      <span className="font-bold mr-39">
                        Condition of SIC (Fixed):
                      </span>
                      OK
                    </td>
                    <td className=" text-left w-1/2 px-2">
                      <span className="font-bold mr-11">Moving: </span>
                      OK
                    </td>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold  text-left w-[60%]">
                      Condition of Jaw Contact:
                    </td>
                    <div className="text-left">
                      <td className="text-left">checked and cleaned OK </td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Condition of Cradle Terminals:
                    </td>
                    <div className="text-left">
                      <td className="text-left">
                        Visually checked OK and Panel Live
                      </td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Condition of Earthing Terminals:
                    </td>
                    <div className="text-left">
                      <td className="text-left">Cleaned OK </td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Arcing Contact Gap:
                    </td>
                    <div className="text-left">
                      <td className="text-left"> As per Standard 0.9mm; OK</td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Condition of Arc Chute:
                    </td>
                    <div className="text-left">
                      <td className="text-left">OK</td>
                    </div>
                  </tr>

                  <tr className="border-t border-black gap-16 flex   pr-8 pl-4">
                    <td className="font-bold text-left">
                      <span className="font-bold mr-3">a) Dusty Housing:</span>{" "}
                      Dusty
                    </td>
                    <td className="text-left">
                      <span className="font-bold mr-3">b) Broken Housing:</span>{" "}
                      ----
                    </td>
                    <td className="text-left">
                      <span className="font-bold mr-3">c) Clean:</span> Cleaned
                    </td>
                  </tr>

                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Operation Of Auxiliary Contacts :
                    </td>
                    <div className="text-left">
                      <td className="text-left">OK</td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Condition of Current Transformers :
                    </td>
                    <div className="text-left">
                      <td className="text-left">OK</td>
                    </div>
                  </tr>
                  <tr className="border-t border-black flex   pr-8 pl-4">
                    <td className="font-bold w-[60%]  text-left">
                      Check control wiring of ACB for proper connections :
                    </td>
                    <div className="text-left">
                      <td className="text-left">OK</td>
                    </div>
                  </tr>
                </div>
                <tr className="border-t border-b border-black">
                  <td className="font-bold text-2xl  text-center align-middle">
                    GREASING SCHEDULE
                  </td>
                </tr>
                <div className="text-sm">
                  <tr className=" flex   pr-8 pl-4 gap-2">
                    <td className="font-bold text-left">
                      Greasing of moving parts in pole assembly:-
                    </td>
                    <div className="text-left">
                      <td className="text-left">
                        {" "}
                        Done to all moving parts & where ever required.{" "}
                      </td>
                    </div>
                  </tr>
                  <tr className=" flex border-t border-black   pr-8 pl-4 gap-2">
                    <td className="text-left">
                      <span className="font-bold mr-3">
                        Greasing of moving parts of mechanism & rails:-
                      </span>
                      <span className="text-left">
                        Removed old grease and applied new grease to mechanism
                        and rails.
                      </span>
                    </td>
                  </tr>
                </div>
                <tr className="border-t border-b border-black">
                  <td className="font-bold text-2xl  text-center align-middle">
                    ACB RELEASE TESTING
                  </td>
                </tr>
                <table className="w-full text-sm table-fixed border-collapse">
                  <thead>
                    <tr className="">
                      <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                        Protection
                      </th>
                      <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                        Setting
                      </th>
                      <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                        Characteristics
                      </th>
                      <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                        TMS as per Relay setting
                      </th>
                      <th className="w-1/6 font-bold text-md text-center border border-r-black border-b-black px-2 py-1">
                        Actual TMS (Sec.)
                      </th>
                      <th className="w-1/6 font-bold text-md text-center border border-b-black px-2 py-1">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center border border-r-black border-b-black px-2 py-1">
                        LT
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        50%
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        NI
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        2.5 secs Curve
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        3.342 secs
                      </td>
                      <td className="text-center border border-l-black border-b-black px-2 py-1">
                        OK
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-r-black border-b-black px-2 py-1">
                        ST
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        200%
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        DMT
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        100 msecs
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        88 msecs
                      </td>
                      <td className="text-center border border-l-black border-b-black px-2 py-1">
                        OK
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-r-black border-b-black px-2 py-1">
                        GF
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        20%
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        DMT
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        100 msecs
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        78 msecs
                      </td>
                      <td className="text-center border border-l-black border-b-black px-2 py-1">
                        OK
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center border border-r-black border-b-black px-2 py-1">
                        -
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        -
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        -
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        -
                      </td>
                      <td className="text-center border border-x-black border-b-black px-2 py-1">
                        -
                      </td>
                      <td className="text-center border border-l-black border-b-black px-2 py-1">
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>

                <tr className=" border-b border-black">
                  <td className=" pl-4 font-bold text-left align-middle">
                    Recommended Spares for Replacement: Door Bezel.
                  </td>
                </tr>
                <tr className="border-t border-b border-black">
                  <td className=" pl-4  text-left align-middle">
                    <span className="font-bold">Remarks:</span> Door Bezel found
                    damage needs to be replaced. ACB found working Normal.
                  </td>
                </tr>
                <tr className="border-t border-b border-black flex justify-between">
                  <td className=" pl-4 pr-8 text-left align-middle">
                    <span className="font-bold">Client's Repres.:</span> M/s.
                    Baviskar / Parab
                  </td>
                  <td className=" pl-4 pr-8 text-left align-middle">
                    <span className="font-bold">Service Repres.:-</span> M/s. SH
                    / RH.
                  </td>
                </tr>
              </table>
            </div>
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
  );
}

export default ABCReport;
