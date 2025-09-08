import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { reportFormSchema } from "@/features/earthReport/EarthReportCreate";
import { companyType } from "@/features/company/companySlice";
import { z } from "zod";
import { Report } from "@/features/earthReport/type";

const tw = createTw({
  theme: {
    extend: {
      colors: {
        custom: "cornflowerblue",
        brandYellow: "#fcae08",
        brandBlue: "#084f88",
        blue600: "#2563eb",
        blue900: "#1e3a8a",
        gray500: "#6B7280",
      },
    },
  },
});

try {
  Font.register({
    family: "Tinos",
    fonts: [
      { src: "/fonts/Tinos-Regular.ttf", fontWeight: "normal" },
      { src: "/fonts/Tinos-Bold.ttf", fontWeight: "bold" },
    ],
  });
} catch (error) {
  console.error("Failed to register Tinos fonts:", error);
}

interface EarthReportProps {
  reportData: Report;
  companyData: companyType[];
}

function groupByLocation(data: Array<any>) {
  const groupedData: any[] = [];
  let i = 0;

  while (i < data.length) {
    const location = data[i].location;
    const groupItems: any[] = [];
    let j = i;

    while (j < data.length && data[j].location === location) {
      groupItems.push(data[j]);
      j++;
    }

    const groupSize = groupItems.length;

    groupItems.forEach((item, idx) => {
      groupedData.push({
        ...item,
        srNo: groupedData.length + 1,
        openPit: item.earth_resistance?.open_pit || "",
        connected: item.earth_resistance?.Connected || "",
        groupLocation: item.location || "",
        isMiddleInGroup: idx === Math.floor(groupSize / 2), // ✅ only middle row shows location
      });
    });

    i = j;
  }

  return groupedData;
}

const EarthReport = ({ reportData, companyData }: EarthReportProps) => {
  const PAGE_WIDTH = 510;
  const STAMP_SIZE = 110;
  const safeX = Math.min(
    Math.max(reportData?.image_data?.x || 0, 0),
    PAGE_WIDTH - STAMP_SIZE
  );

  const processedData = groupByLocation(reportData?.earth_pit_list || []);

  // Define row limits
  const firstPageRowLimit = 20;
  const subsequentPageRowLimit = 37;

  // Split data into pages
  const pages = [];
  let remainingData = [...processedData];
  let currentPage = 1;

  while (remainingData.length > 0) {
    const rowLimit =
      currentPage === 1 ? firstPageRowLimit : subsequentPageRowLimit;
    const pageData = remainingData.splice(0, rowLimit);
    pages.push(pageData);
    currentPage++;
  }

  return (
    <Document style={{ fontFamily: "Tinos" }}>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={tw("flex flex-col gap-4 p-2")}>
          {/* Render header and initial content only on the first page */}
          {pageIndex === 0 && (
            <View style={tw("w-full")}>
              <View style={tw("")}>
                <View
                  style={tw("flex flex-row justify-between items-center mb-2")}
                >
                  <View style={tw("w-[40%]")}>
                    <Image
                      src="/oka.png"
                      style={tw("w-full h-[40pt] object-contain")}
                    />
                  </View>
                  <View style={tw("w-[40%] text-right")}>
                    <Image
                      src="/l&k.jpeg"
                      style={tw("w-full h-[40pt] object-contain")}
                    />
                    <Text style={tw("text-xs text-blue-600 font-bold")}>
                      L&K AUTHORIZED SERVICE CENTER
                    </Text>
                  </View>
                </View>
                <View style={tw("bg-[#fcae08] h-[4pt] py-1")} />
                <View style={tw("bg-[#084f88] h-[4pt] py-1 mb-2")} />
              </View>
            </View>
          )}

          <View style={tw("max-w-[90%] mx-auto w-full")}>
            <View style={tw("px-4")}>
              {/* Render report details only on the first page */}
              {pageIndex === 0 && (
                <>
                  <View style={tw("flex flex-row justify-between text-lg")}>
                    <Text style={tw("font-bold")}>
                      Report No.: {reportData?.report_number || "--"}
                    </Text>
                    <Text style={tw("font-bold")}>
                      Date: {reportData?.report_date || "--/--/----"}
                    </Text>
                  </View>

                  <Text style={tw("text-center text-xl font-bold underline")}>
                    EARTH TEST REPORT
                  </Text>

                  <View style={tw("flex flex-row items-start mb-4")}>
                    <Text style={tw("font-bold text-xl mr-2")}>
                      Client Name:
                    </Text>
                    <View style={tw("flex flex-col")}>
                      <Text style={tw("font-bold")}>
                        {companyData?.find(
                          (i) => `${i.id}` === `${reportData?.company_id}`
                        )?.name || "--"}
                      </Text>
                      <Text>
                        {companyData?.find(
                          (i) => `${i.id}` === `${reportData?.company_id}`
                        )?.address || "--"}
                      </Text>
                    </View>
                  </View>

                  <Text style={tw("text-base")}>
                    We certify that we have carried out the Earth Resistance
                    Test at site and the results are as under:
                  </Text>

                  <View style={tw("text-base")}>
                    <View style={tw("flex flex-row mb-1")}>
                      <Text style={tw("w-[100pt] flex-shrink-0")}>
                        Weather Condition
                      </Text>
                      <Text style={tw("mx-4")}>:</Text>
                      <Text>{reportData?.weather_condition || "--"}</Text>
                    </View>
                    <View style={tw("flex flex-row")}>
                      <Text style={tw("w-[100pt] flex-shrink-0")}>Soil</Text>
                      <Text style={tw("mx-4")}>:</Text>
                      <Text>{reportData?.soil || "--"}</Text>
                    </View>
                  </View>

                  <Text style={tw("text-base mb-1")}>
                    The test was carried out on 3 pin method spacing the probes
                    at approximately 15 to 30 meters from test electrodes.
                  </Text>
                </>
              )}

              {/* Table starts on the first page and continues on subsequent pages */}
              <View style={tw("w-full")}>
                <View style={tw("border border-black")}>
                  {/* Table Header (only on the first page) */}
                  {pageIndex === 0 && (
                    <>
                      <View
                        style={tw(
                          "border-b border-black flex flex-row justify-center items-center -py-2"
                        )}
                      >
                        <Text
                          style={tw(
                            "text-xl mt-2 font-bold text-center underline"
                          )}
                        >
                          Earth Pit List
                        </Text>
                      </View>
                      <View style={tw("flex flex-row")}>
                        <View
                          style={tw(
                            "border-r border-black px-2 py-1 w-[60pt] flex flex-col justify-center"
                          )}
                        >
                          <Text style={tw("text-sm font-semibold text-center")}>
                            Sr. No.
                          </Text>
                        </View>
                        <View
                          style={tw(
                            "border-r border-black px-2 py-1 flex-1 flex flex-col justify-center"
                          )}
                        >
                          <Text style={tw("text-sm font-semibold text-center")}>
                            Description
                          </Text>
                        </View>
                        <View
                          style={tw(
                            "border-r border-black px-2 py-1 w-[120.5pt] flex flex-col justify-center"
                          )}
                        >
                          <Text style={tw("text-sm font-semibold text-center")}>
                            Location
                          </Text>
                        </View>
                        <View style={tw("border-r border-black w-[151.5pt]")}>
                          <Text
                            style={tw("text-sm font-semibold text-center py-1")}
                          >
                            Earth Resistance 2025
                          </Text>
                          <View style={tw("flex flex-row")}>
                            <View
                              style={tw(
                                "border-t border-r border-black py-1 flex-1"
                              )}
                            >
                              <Text style={tw("text-xs text-center")}>
                                Open Pit
                              </Text>
                            </View>
                            <View
                              style={tw("border-t border-black py-1 flex-1")}
                            >
                              <Text style={tw("text-xs text-center")}>
                                Connected
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={tw(
                            "px-2 py-1 w-[58.5pt] flex flex-col justify-center"
                          )}
                        >
                          <Text style={tw("text-sm font-semibold text-center")}>
                            Remark
                          </Text>
                        </View>
                      </View>
                    </>
                  )}

                  {/* Body (continued on subsequent pages without header) */}
                  {/* ---------- Table Body (page-local grouping + merged Location) ---------- */}
                  {(() => {
                    // annotate pageData per-page (groups of consecutive same location)
                    const annotated: any[] = [];
                    let i = 0;
                    while (i < pageData.length) {
                      const loc = (
                        pageData[i].groupLocation ||
                        pageData[i].location ||
                        ""
                      ).toString();
                      let j = i;
                      while (
                        j < pageData.length &&
                        (
                          pageData[j].groupLocation ||
                          pageData[j].location ||
                          ""
                        ).toString() === loc
                      ) {
                        j++;
                      }
                      const groupSize = j - i;

                      for (let k = 0; k < groupSize; k++) {
                        const row = pageData[i + k];
                        const isFirst = k === 0;
                        const isLast = k === groupSize - 1;
                        // choose middle row: single row -> that row; odd -> exact middle; even -> upper-middle (adjust if you want lower)
                        let isMiddle: boolean;
                        if (groupSize === 1) isMiddle = true;
                        else if (groupSize % 2 === 1)
                          isMiddle = k === Math.floor(groupSize / 2);
                        else isMiddle = k === Math.floor((groupSize - 1) / 2);

                        annotated.push({
                          ...row,
                          isPageFirst: isFirst,
                          isPageLast: isLast,
                          isPageMiddle: isMiddle,
                          pageGroupSize: groupSize,
                        });
                      }

                      i = j;
                    }

                    // render annotated rows
                    return annotated.map((item) => (
                      <View
                        key={item.srNo || `${item.location}-${Math.random()}`}
                        style={tw("flex flex-row")}
                      >
                        {/* Sr. No. */}
                        <View
                          style={tw(
                            "border-r border-t border-black px-2 py-1 w-[60pt]"
                          )}
                        >
                          <Text style={tw("text-sm text-center")}>
                            {item.srNo}
                          </Text>
                        </View>

                        {/* Description */}
                        <View
                          style={tw(
                            "border-r border-t border-black px-2 py-1 flex-1"
                          )}
                        >
                          <Text style={tw("text-sm")}>{item.description}</Text>
                        </View>

                        {/* Location column: show borders only on first/last of page-group, text only on middle */}
                        <View
                          style={[
                            // keep basic layout from tailwind for spacing/alignment
                            tw(
                              "px-2 w-[120pt] flex justify-center items-center"
                            ),
                            {
                              // always keep right border for the column edge
                              borderRightWidth: 1,
                              borderRightColor: "black",

                              // conditional top/bottom borders for merged look
                              borderTopWidth: item.isPageFirst ? 1 : 0,
                              borderBottomWidth: item.isPageLast ? 1 : 0,
                              borderTopColor: "black",
                              borderBottomColor: "black",
                            },
                          ]}
                        >
                          {item.isPageMiddle && (
                            <Text
                              style={{
                                fontSize: 10,
                                fontWeight: "500",
                                textAlign: "center",
                              }}
                            >
                              {item.groupLocation || "--"}
                            </Text>
                          )}
                        </View>

                        {/* Open Pit */}
                        <View
                          style={tw(
                            "border-r border-t border-black px-2 py-1 w-[76pt]"
                          )}
                        >
                          <Text style={tw("text-sm text-center")}>
                            {item.openPit}
                          </Text>
                        </View>

                        {/* Connected */}
                        <View
                          style={tw(
                            "border-r border-t border-black px-2 py-1 w-[75pt]"
                          )}
                        >
                          <Text style={tw("text-sm text-center")}>
                            {item.connected}
                          </Text>
                        </View>

                        {/* Remark */}
                        <View
                          style={tw(
                            "border-l border-t border-black px-2 py-1 w-[59pt]"
                          )}
                        >
                          <Text style={tw("text-sm text-center")}>
                            {item.remark || "--"}
                          </Text>
                        </View>
                      </View>
                    ));
                  })()}

                  {pageIndex === pages.length - 1 && (
                    <View style={tw("border-t border-black px-3 py-2")}>
                      <View style={tw("flex flex-row justify-between")}>
                        <Text style={tw("text-sm")}>
                          <Text style={tw("font-bold")}>For Client: </Text>
                          {reportData?.for_client || "--"}
                        </Text>
                        <Text style={tw("text-sm")}>
                          <Text style={tw("font-bold")}>
                            For Ok Agencies.:-{" "}
                          </Text>
                          M/s. {reportData?.for_ok_agency || "--"}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Footer and stamp only on the last page */}
              <>
                {pageIndex === pages.length - 1 && (
                  <View style={tw("max-w-[90%]")}>
                    <Image
                      src="/stamp.jpg"
                      style={{
                        objectFit: "contain",
                        bottom: 10,
                        left: safeX,
                        width: 110,
                        height: 110,
                      }}
                    />
                  </View>
                )}
              </>
            </View>
          </View>
          <View
            style={tw(
              "border-t-8 border-[#fcae08] text-center p-3 text-md mt-auto text-sm"
            )}
            fixed
          >
            <Text>
              <Text style={tw("font-bold")}>Address for correspondence:</Text>{" "}
              101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
            </Text>
            <Text>
              Mumbai-400081, <Text style={tw("font-bold")}>Contact:</Text>{" "}
              9619866401, <Text style={tw("font-bold")}>Email:</Text>{" "}
              <Text style={tw("text-blue-900 font-bold")}>
                ok_agencies@yahoo.com
              </Text>
              ,
            </Text>
            <Text>
              <Text style={tw("font-bold")}>Website:</Text>{" "}
              <Text style={tw("text-blue-900 font-bold")}>
                www.okagencies.in
              </Text>
              ; <Text style={tw("font-bold")}>GST NO.: 27ABDPJ0462B1Z9</Text>
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default EarthReport;
