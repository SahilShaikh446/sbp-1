import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import { companyType } from "@/features/company/companySlice";
import { Report } from "@/features/earthReport/type";
import { convertReportDate } from "@/features/oilReport/OilReportCreate";

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
        combined: item.earth_resistance?.combined || "",
        groupLocation: item.location || "",
        groupArea: item.area || "",
        groupType: item.type_earthing || "",
        groupEP: item.ep_tag || "",
        isMiddleInGroup: idx === Math.floor(groupSize / 2), // ✅ only middle row shows location
      });
    });

    i = j;
  }

  return groupedData;
}

const PAGE_WIDTH = 520;

const getTableColumns = (reportData: any) => {
  const columns: any[] = [
    { key: "srNo", label: "Sr. No.", weight: 0.6, fixed: 35 },

    { key: "area", label: "Area", weight: 1.2 },
    { key: "location", label: "Location", weight: 2.2 },
    { key: "type", label: "Type of Earthing", weight: 1.8 },

    { key: "equipment", label: "Equipment", weight: 4.5 },

    { key: "ep", label: "EP Tag", weight: 1.5 },
    { key: "pit", label: "Pit Resis.", weight: 1.2 },
    { key: "grid", label: "Grid Resis.", weight: 1.2 },

    { key: "remark", label: "Remark", weight: 2.0, fixed: 65 },
  ];
  const toBool = (v: any) => v === true || v === "true";

  // remove columns based on flags
  const activeCols = columns.filter((col) => {
    if (col.key === "area") return toBool(reportData.is_area);
    if (col.key === "location") return toBool(reportData.is_location);
    if (col.key === "type") return toBool(reportData.is_type_earthing);
    if (col.key === "ep") return toBool(reportData.is_ep_tag);
    if (col.key === "pit") return toBool(reportData.is_pit);
    if (col.key === "grid") return toBool(reportData.is_grid);
    return true;
  });


  const fixedWidth = activeCols.reduce(
    (sum, c) => sum + (c.fixed || 0),
    0
  );

  const flexibleCols = activeCols.filter((c) => !c.fixed);
  const totalWeight = flexibleCols.reduce(
    (sum, c) => sum + c.weight,
    0
  );

  const remainingWidth = PAGE_WIDTH - fixedWidth;

  return activeCols.map((c) => ({
    ...c,
    width: c.fixed || (c.weight / totalWeight) * remainingWidth,
  }));
};

const HeaderCell = ({ width, text, last }: any) => (
  <View
    style={{
      width,
      borderRightWidth: last ? 0 : 1,
      borderColor: "black",
      padding: 4,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 10, fontWeight: "bold", textAlign: "center" }}>
      {text}
    </Text>
  </View>
);

const BodyCell = ({ width, text, last }: any) => (
  <View
    style={{
      width,
      borderRightWidth: last ? 0 : 1,
      borderColor: "black",
      padding: 4,
      borderBottomWidth: 1,
    }}
  >
    <Text style={{ fontSize: 9, textAlign: "center" }}>
      {text || "--"}
    </Text>
  </View>
);

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
  console.log(reportData);
  const columns = getTableColumns(reportData);

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
                      LK AUTHORIZED SERVICE CENTER
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
                      Report No.: EP - {reportData?.report_number || "-"}
                    </Text>
                    <Text style={tw("font-bold")}>
                      DATE OF EP TESTING:{" "}
                      {convertReportDate(reportData?.report_date) ||
                        "--/--/----"}
                    </Text>
                  </View>

                  <Text style={tw("text-center text-xl font-bold underline")}>
                    EARTH TEST REPORT
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 6,
                    }}
                  >
                    {/* Label */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        marginRight: 6,
                        width: 90, // 👈 fixed label width
                      }}
                    >
                      Client Name:
                    </Text>

                    {/* Value (WRAPS properly) */}
                    <View style={{ width: 420 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          flexWrap: "wrap",
                          lineHeight: 1.2,
                        }}
                      >
                        {companyData?.find(
                          (i) => `${i.id}` === `${reportData?.company_id}`
                        )?.name || "--"}
                      </Text>

                      <Text
                        style={{
                          fontSize: 10,
                          marginTop: 2,
                          flexWrap: "wrap",
                          lineHeight: 1.2,
                        }}
                      >
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

                  <Text style={tw("text-base mb-1")}>
                    The test was carried out on 3 pin method spacing the probes
                    at approximately 15 to 30 meters from test electrodes.
                  </Text>
                </>
              )}

              {/* Table starts on the first page and continues on subsequent pages */}
              <View style={{ borderWidth: 1, borderColor: "black" }}>
                {/* Title */}
                {pageIndex === 0 && (
                  <View style={{ borderBottomWidth: 1, padding: 6 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        textAlign: "center",
                        textDecoration: "underline",
                      }}
                    >
                      Earth Pit List
                    </Text>
                  </View>
                )}

                {/* Header */}
                {pageIndex === 0 && (
                  <View style={{ flexDirection: "row", borderBottomWidth: 1 }}>
                    {columns.map((col, i) => (
                      <HeaderCell
                        key={col.key}
                        width={col.width}
                        text={col.label}
                        last={i === columns.length - 1}
                      />
                    ))}
                  </View>
                )}

                {/* Rows */}
                {pageData.map((item: any) => (
                  <View
                    key={item.srNo}
                    style={{ flexDirection: "row" }}
                  >
                    {columns.map((col: any, i: number) => {
                      const valueMap: any = {
                        srNo: item.srNo,
                        area: item.area,
                        location: item.location,
                        type: item.type_earthing,
                        equipment: item.equipment || item.description,
                        ep: item.ep_tag,
                        pit: item.pit_resistance,
                        grid: item.grid_resistance,
                        remark: item.remark,
                      };

                      return (
                        <BodyCell
                          key={col.key}
                          width={col.width}
                          text={valueMap[col.key]}
                          last={i === columns.length - 1}
                        />
                      );
                    })}
                  </View>
                ))}
                {pageIndex === pages.length - 1 && (
                  <>
                    <View style={tw("border-black px-3 py-2")}>
                      <View style={tw("flex flex-row justify-between")}>
                        <Text style={tw("text-sm")}>
                          <Text style={tw("font-bold")}>Remark</Text>
                          {reportData?.remark || "--"}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
                {pageIndex === pages.length - 1 && (
                  <View style={tw("border-t border-black px-3 py-2")}>
                    <View style={tw("flex flex-row justify-between")}>
                      <Text style={tw("text-sm")}>
                        <Text style={tw("font-bold")}>For Client: </Text>
                        {reportData?.for_client || "--"}
                      </Text>
                      <Text style={tw("text-sm")}>
                        <Text style={tw("font-bold")}>For Ok Agencies.:- </Text>
                        M/s. {reportData?.for_ok_agency || "--"}
                      </Text>
                    </View>
                  </View>
                )}
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
