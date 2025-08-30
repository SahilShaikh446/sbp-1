import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ACBInspectionForm } from "@/features/acbReport/ACBReportCreate";
import { companyType } from "@/features/company/companySlice"; // Adjust import path
import { reportFormSchema } from "@/features/earthReport/EarthReportCreate";
import { z } from "zod";

// Register Tinos fonts (regular and bold)
Font.register({
  family: "Tinos",
  fonts: [
    { src: "/fonts/Tinos-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/Tinos-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 8, // Matches px-8
    fontSize: 10,
    fontFamily: "Tinos",
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    flexGrow: 1,
    flexDirection: "column",
  },
  header: {
    padding: 2, // Matches p-2
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  logo: {
    width: "100%",
    height: 40,
    objectFit: "contain",
  },
  logoRight: {
    width: "40%",
    textAlign: "right",
  },
  logoRightText: {
    fontSize: 10, // Matches text-xs
    color: "#2563eb", // Matches text-blue-600
    fontWeight: "bold",
  },
  headerBarYellow: {
    backgroundColor: "#fcae08",
    height: 4, // Matches py-1
  },
  headerBarBlue: {
    backgroundColor: "#084f88",
    height: 4, // Matches py-1
    marginBottom: 8,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14, // text-xl (~18px, adjusted for PDF)
    marginBottom: 16,
  },
  headerText: {
    fontWeight: "bold",
  },
  title: {
    textAlign: "center",
    fontSize: 16, // text-2xl (~24px, adjusted)
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 16,
  },
  clientInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  clientLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  clientDetails: {
    display: "flex",
    flexDirection: "column",
  },
  textSection: {
    marginBottom: 8,
    fontSize: 12,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 4,
  },
  labelWidth: {
    width: 100, // w-40 (40 * 2.5 = 100px, approximate)
    flexShrink: 0,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginTop: 16,
  },
  tableHeader: {
    borderWidth: 1,
    borderColor: "#000000",
    padding: 4,
    fontWeight: "bold",
    fontSize: 14, // text-xl
    textAlign: "center",
    textDecoration: "underline",
  },
  tableSubHeader: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 10, // text-sm
    fontWeight: "bold",
    textAlign: "center",
  },
  tableSubHeaderSmall: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 8, // text-xs
    textAlign: "center",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 10, // text-sm
    textAlign: "center",
    flex: 1,
  },
  tableCellLeft: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 10,
    textAlign: "left",
    flex: 1,
  },
  tableCellNoData: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 16,
    textAlign: "center",
    color: "#6B7280", // text-gray-500
    fontSize: 12,
  },
  footerRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  footerText: {
    fontSize: 10,
  },
  footerLabel: {
    fontWeight: "bold",
  },

  footer: {
    borderTopWidth: 8, // Matches border-t-8
    borderColor: "#fcae08",
    paddingTop: 12, // Matches p-3
    paddingHorizontal: 9,
    fontSize: 12, // Matches text-md
    lineHeight: 1.3,
    textAlign: "center",
  },
  blueText: {
    color: "#1e3a8a", // Matches text-blue-900
    fontWeight: "bold",
  },
});

interface EarthReportProps {
  reportData: z.infer<typeof reportFormSchema> & {
    image_data: { x: number };
  };
  companyData: companyType[];
}

const EarthReport = ({ reportData, companyData }: EarthReportProps) => {
  const PAGE_WIDTH = 510; // A4 width in points
  const STAMP_SIZE = 110;
  const safeX = Math.min(
    Math.max(reportData?.image_data?.x || 0, 0), // never less than 0
    PAGE_WIDTH - STAMP_SIZE // never beyond page
  );

  const groupedData = reportData?.earth_pit_list?.reduce((acc, item) => {
    if (!acc[item.location]) {
      acc[item.location] = [];
    }
    acc[item.location].push(item);
    return acc;
  }, {} as Record<string, typeof reportData.earth_pit_list>);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Main Content */}
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={{ width: "40%" }}>
                <Image src="/oka.png" style={styles.logo} />
              </View>
              <View style={styles.logoRight}>
                <Image src="/l&k.jpeg" style={styles.logo} />
                <Text style={styles.logoRightText}>
                  L&K AUTHORIZED SERVICE CENTER
                </Text>
              </View>
            </View>
            <View style={styles.headerBarYellow} />
            <View style={styles.headerBarBlue} />
          </View>
          <View style={{ paddingHorizontal: 18 }}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Report No.: {reportData?.report_number || "--"}
              </Text>
              <Text style={styles.headerText}>
                Date: {reportData?.report_date || "--/--/----"}
              </Text>
            </View>

            <Text style={styles.title}>EARTH TEST REPORT</Text>

            <View style={styles.clientInfo}>
              <Text style={styles.clientLabel}>Client Name:</Text>
              <View style={styles.clientDetails}>
                <Text style={styles.headerText}>
                  {companyData?.find(
                    (i) => `${i.id}` === `${reportData?.company_id}`
                  )?.name || ""}
                </Text>
                <Text>
                  {companyData?.find(
                    (i) => `${i.id}` === `${reportData?.company_id}`
                  )?.address || ""}
                </Text>
              </View>
            </View>

            <Text style={styles.textSection}>
              We certify that we have carried out the Earth Resistance Test at
              site and the results are as under:
            </Text>

            <View style={styles.textSection}>
              <View style={styles.flexRow}>
                <Text style={styles.labelWidth}>Weather Condition</Text>
                <Text style={{ marginHorizontal: 16 }}>:</Text>
                <Text>{reportData?.weather_condition || "--"}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.labelWidth}>Soil</Text>
                <Text style={{ marginHorizontal: 16 }}>:</Text>
                <Text>{reportData?.soil || "--"}</Text>
              </View>
            </View>

            <Text style={styles.textSection}>
              The test was carried out on 3 pin method spacing the probes at
              approximately 15 to 30 meters from test electrodes.
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, { flex: 6 }]}>
                  Earth Pit List
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableSubHeader, { flex: 1 }]}>
                  Sr. No.
                </Text>
                <Text style={[styles.tableSubHeader, { flex: 2 }]}>
                  Description
                </Text>
                <Text style={[styles.tableSubHeader, { flex: 2 }]}>
                  Location
                </Text>
                <Text style={[styles.tableSubHeader, { flex: 1 }]}>
                  Earth Resistance 2025
                </Text>
                <Text style={[styles.tableSubHeader, { flex: 1 }]}></Text>
                <Text style={[styles.tableSubHeader, { flex: 1 }]}>Remark</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableSubHeaderSmall, { flex: 3 }]}></Text>
                <Text style={[styles.tableSubHeaderSmall, { flex: 1 }]}>
                  Open Pit
                </Text>
                <Text style={[styles.tableSubHeaderSmall, { flex: 1 }]}>
                  Connected
                </Text>
                <Text style={[styles.tableSubHeaderSmall, { flex: 1 }]}></Text>
              </View>

              {reportData?.earth_pit_list?.length > 0 ? (
                Object.entries(groupedData).map(
                  ([location, items], groupIndex) =>
                    items.map((item, itemIndex) => {
                      const isFirstInGroup = itemIndex === 0;
                      return (
                        <View
                          style={styles.tableRow}
                          key={`${groupIndex}-${itemIndex}`}
                        >
                          <Text style={[styles.tableCell, { flex: 1 }]}>
                            {groupIndex * items.length + itemIndex + 1}
                          </Text>
                          <Text style={[styles.tableCellLeft, { flex: 2 }]}>
                            {item.description}
                          </Text>
                          {isFirstInGroup ? (
                            <Text
                              style={[
                                styles.tableCellLeft,
                                { flex: 2, fontWeight: "bold" },
                              ]}
                            >
                              {location === "No Location" ? "" : location}
                            </Text>
                          ) : (
                            // Empty View to maintain table structure for non-first items
                            <View style={[styles.tableCell, { flex: 2 }]} />
                          )}
                          <Text style={[styles.tableCell, { flex: 1 }]}>
                            {item.earth_resistance.open_pit}
                          </Text>
                          <Text style={[styles.tableCell, { flex: 1 }]}>
                            {item.earth_resistance.Connected}
                          </Text>
                          <Text style={[styles.tableCell, { flex: 1 }]}>
                            {item.remark}
                          </Text>
                        </View>
                      );
                    })
                )
              ) : (
                <View style={styles.tableRow}>
                  <Text style={[styles.tableCellNoData, { flex: 6 }]}>
                    No earth pits added yet
                  </Text>
                </View>
              )}

              <View style={styles.tableRow}>
                <View style={[styles.footerRow, { flex: 6 }]}>
                  <View>
                    <Text style={styles.footerText}>
                      <Text style={styles.footerLabel}>For Client:</Text>{" "}
                      {reportData?.clients_representative || "--"}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.footerText}>
                      <Text style={styles.footerLabel}>For Ok Agencies.:-</Text>{" "}
                      M/s.
                      {reportData?.tested_by || "--"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ maxWidth: "90%" }}>
            <Image
              src="/stamp.jpg"
              style={{
                objectFit: "contain",
                bottom: 10,
                left: safeX,
                width: 110, // 150px * 0.75
                height: 110, // 150px * 0.75
                marginLeft: 25,
              }}
            />
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              Address for correspondence:
            </Text>{" "}
            101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
          </Text>
          <Text>
            Mumbai-400081, <Text style={{ fontWeight: "bold" }}>Contact:</Text>{" "}
            9619866401, <Text style={{ fontWeight: "bold" }}>Email:</Text>{" "}
            <Text style={styles.blueText}>ok_agencies@yahoo.com</Text>,
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Website:</Text>{" "}
            <Text style={styles.blueText}>www.okagencies.in</Text>;{" "}
            <Text style={{ fontWeight: "bold" }}>GST NO.: 27ABDPJ0462B1Z9</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default EarthReport;
