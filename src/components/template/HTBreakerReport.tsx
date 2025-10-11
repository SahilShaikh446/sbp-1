import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { companyType } from "@/features/company/companySlice"; // Adjust import path
import { ReportType } from "@/features/HTBreakerReport/HTBreakerReportCreate";
import { Report } from "@/features/HTBreakerReport/type";

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
    padding: 8,
    fontSize: 10,
    fontFamily: "Tinos",
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    flexGrow: 1,
    flexDirection: "column",
  },
  header: {
    padding: 2,
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
    fontSize: 10,
    color: "#2563eb",
    fontWeight: "bold",
  },
  headerBarYellow: {
    backgroundColor: "#fcae08",
    height: 4,
  },
  headerBarBlue: {
    backgroundColor: "#084f88",
    height: 4,
    marginBottom: 8,
  },
  container: {
    // padding: 2,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    paddingVertical: 6,
    fontSize: 33,
    fontWeight: "bold",
    gap: 4,
  },
  headerText: {
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
  },
  tableHeader: {
    borderRightWidth: 1,
    borderRightColor: "#000000",
    padding: 2,
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  tableCell: {
    borderRightWidth: 1,
    borderRightColor: "#000000",
    fontSize: 10,
    flex: 1,
    textAlign: "left",
  },
  tableCellLeft: {
    textAlign: "left",
  },
  specialCellContainer: {
    flexDirection: "row",
    flex: 1,
    textAlign: "center",
    justifyContent: "center", // horizontal alignment
    alignItems: "center", // vertical alignment
  },
  specialCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },
  subRowDescription: {
    paddingLeft: 4,
    textAlign: "left",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 3,
    fontWeight: "bold",
    fontSize: 10,
    marginTop: 2,
  },
  footerColumn: {
    flexDirection: "column",
  },
  footer: {
    borderTopWidth: 8,
    borderColor: "#fcae08",
    paddingTop: 12,
    paddingHorizontal: 9,
    fontSize: 12,
    lineHeight: 1.3,
    textAlign: "center",
  },
  blueText: {
    color: "#1e3a8a",
    fontWeight: "bold",
  },
  special1SubRow: {
    textSize: 8,
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

// Inspection data structure to map form fields to table rows
const inspectionData = [
  {
    srNo: 1,
    description: "PANEL NO/FEEDER NAME PLATE",
    fieldName: "panel_no_feeder_name_plate",
    observationReport: "01 / 100s FTL II",
  },
  {
    srNo: 2,
    description: "CIRCUIT BREAKERTYPE",
    fieldName: "circuit_breakertype",
    observationReport: "HPA 24 / 1225C ( SF6)",
  },
  {
    srNo: 3,
    description: "VOLTAGE/AMPS/KA",
    fieldName: "voltage_amps_ka",
    observationReport: "24KV / 1250A / 26.3KA",
  },
  {
    srNo: 4,
    description: "SERIALNO./MANUFACTURED YEAR",
    fieldName: "serial_no_manufactured_year",
    observationReport: "1VYN020411001007 / 2011",
  },
  {
    srNo: 5,
    description: "SPRING CHARGING MOTOR VOLTS",
    fieldName: "spring_charge_motor_volts",
    hide: "is_spring_charge_motor_volts",
    fieldName1: "spring_charge_motor_volts_resistance",
    observationReport: "special1",
    desciption1: "MOTAR RESISTANCE",
  },
  {
    srNo: 6,
    description: "CLOSING COIL VOLTAGE/RESISTANCE",
    fieldName: "closing_coil_voltage",
    hide: "is_closing_coil_voltage",
    fieldName1: "closing_coil_voltage_resistance",
    observationReport: "special1",
    desciption1: "RESISTANCE",
  },
  {
    srNo: 7,
    description: "TRIP COIL VOLTAGE/ RESISTANCE",
    fieldName: "trip_coil_voltage",
    hide: "is_trip_coil_voltage",
    fieldName1: "trip_coil_voltage_resistance",
    observationReport: "special1",
    desciption1: "RESISTANCE",
  },
  {
    srNo: 8,
    description: "COUNTER READING/ ANTIPUMPING(K1)",
    fieldName: "counter_reading_antipumping",
    observationReport: "0382",
  },
  {
    srNo: 9,
    description: "VISUALINSPECTION FOR DAMAGED",
    fieldName: "visual_inspection_for_damaged",
    observationReport: "OK",
  },
  {
    srNo: 11,
    description: "THOROUGH CLEANING",
    fieldName: "through_cleaning",
    observationReport: "YES DONE CRC SPRAY / SCOTCH BRITE",
  },
  {
    srNo: 12,
    description: "LUBRICATION OF MOVING PARTS/COIL",
    fieldName: "lubricant_oil_moving_parts",
    observationReport: "Done to all moving parts",
  },
  {
    srNo: 14,
    description: "ON/OFF OPERATION ELECT/MANUAL",
    fieldName: "on_off_operation_elect_manual",
    observationReport: "Manual and Electrical Operation checked OK",
  },
  {
    srNo: 15,
    description: "RACK IN/OUT CHECKING",
    fieldName: "rack_in_out_checking",
    observationReport: "OK",
  },
  {
    srNo: 16,
    description: "DRIVE MECHANISM CHECKING",
    fieldName: "drive_mechanism_checking",
    observationReport: "OK",
  },
  {
    srNo: 17,
    description: "CHECKING C.B./DOOR INTERLOCK",
    fieldName: "checking_cb_door_interlock",
    observationReport: "OK",
  },
  {
    srNo: 18,
    description: "INSULATION RESISTANCE CHECK(Ω)",
    fieldName: "insulation_resistance_check_using_5kv_insulation_tester",
    observationReport: "special",
    subRows: [
      {
        description: "BETWEEN UPPER AND LOWER CONTACT",
        r: "1 TΩ",
        y: "1 TΩ",
        b: "1 TΩ",
      },
      { description: "PHASE TO EARTH", r: "1 TΩ", y: "1 TΩ", b: "1 TΩ" },
      { description: "PHASE TO PHASE", r: ">1 TΩ", y: ">1 TΩ", b: ">1 TΩ" },
    ],
  },
  {
    srNo: 19,
    description: "CHECKING CB TIMING",
    fieldName: "checking_cb_timing",
    observationReport: "special",
    subRows: [
      { description: "CLOSE (ms)", r: "60", y: "59", b: "62" },
      { description: "OPEN (ms)", r: "46", y: "44", b: "44" },
    ],
  },
  {
    srNo: 20,
    description: "CONTACT RESISTANCE ( MICRO OHM )",
    fieldName: "contact_resistance",
    subRows: [{ r: "60", y: "59", b: "62" }],
  },
  {
    srNo: 21,
    description: "REPLACEMENT",
    fieldName: "replacement",
    observationReport: "NIL",
  },
  {
    srNo: 22,
    description: "REPAIR",
    fieldName: "repair",
    observationReport: "NIL",
  },
  {
    srNo: 23,
    description: "REMARK",
    fieldName: "remark",
    observationReport: "Breaker found working satisfactory.",
  },
  {
    srNo: 24,
    description: "Panel/VCB Spares Required",
    fieldName: "panel_vc_spares",
    observationReport: "Panel/VCB Spares Required.",
  },
  {
    srNo: 25,
    description: "Vaccum Bottle Test",
    fieldName: "vaccum_bottle_test",
    observationReport: "Vaccum Bottle Test.",
  },
];

interface HTBreakerReportProps {
  reportData: Report;
  companyData: companyType[];
}

const convertReportDate = (dateStr: string | null): string => {
  if (!dateStr) return "--.--.----";
  try {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  } catch (error) {
    console.error("Invalid date:", dateStr);
    return "--.--.----";
  }
};

const HTBreakerReport = ({ reportData, companyData }: HTBreakerReportProps) => {
  const PAGE_WIDTH = 510; // A4 width in points
  const STAMP_SIZE = 110;
  const safeX = Math.min(
    Math.max(reportData?.image_data?.x || 0, 0),
    PAGE_WIDTH - STAMP_SIZE
  );

  // Map reportData to inspectionData structure
  const tableData = inspectionData.map((item) => {
    let observationReport: string;
    let subRows:
      | { description?: string; r?: string; y?: string; b?: string }[]
      | undefined;
    let rValue: string | undefined;
    let yValue: string | undefined;
    let bValue: string | undefined;

    if (item.fieldName === "contact_resistance") {
      observationReport = "special";
      const contactData = reportData.contact_resistance || {
        subrows: [{ r: "--", y: "--", b: "--" }],
      };
      rValue = contactData.subrows[0]?.r || "--";
      yValue = contactData.subrows[0]?.y || "--";
      bValue = contactData.subrows[0]?.b || "--";
      subRows = [
        {
          description: "Contact Resistance Values",
          r: contactData.subrows[0]?.r || "--",
          y: contactData.subrows[0]?.y || "--",
          b: contactData.subrows[0]?.b || "--",
        },
      ];
    } else if (
      item.observationReport === "special" &&
      item.fieldName ===
        "insulation_resistance_check_using_5kv_insulation_tester"
    ) {
      observationReport = "special";
      subRows =
        reportData.insulation_resistance_check_using_5kv_insulation_tester
          ?.subrows || [];
    } else if (
      item.observationReport === "special" &&
      item.fieldName === "checking_cb_timing"
    ) {
      observationReport = "special";
      subRows = reportData.checking_cb_timing?.subrows || [];
    } else {
      const value = reportData[item.fieldName as keyof Report];
      observationReport = typeof value === "string" ? value : "--";
    }

    console.log("tableData item:", {
      fieldName: item.fieldName,
      observationReport,
      subRows,
      rValue,
      yValue,
      bValue,
    });

    return {
      ...item,
      observationReport,
      subRows,
      rValue,
      yValue,
      bValue,
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentWrapper}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <View style={{ width: "40%" }}>
                <Image src="/oka.png" style={styles.logo} />
              </View>
              <View style={styles.logoRight}>
                <Image src="/l&k.jpeg" style={styles.logo} />
                <Text style={styles.logoRightText}>
                  LK AUTHORIZED SERVICE CENTER
                </Text>
              </View>
            </View>
            <View style={styles.headerBarYellow} />
            <View style={styles.headerBarBlue} />
          </View>

          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  margin: "auto",
                  width: "100%",
                  fontSize: 33,
                  fontWeight: "bold",
                }}
              >
                <View style={styles.headerText}>
                  <Text>Client: </Text>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 4,
                    }}
                  >
                    <Text style={{}}>
                      {
                        companyData?.find(
                          (i) => `${i.id}` == `${reportData.company_id}`
                        )?.name
                      }
                    </Text>
                    <Text>
                      {
                        companyData?.find(
                          (i) => `${i.id}` == `${reportData.company_id}`
                        )?.address
                      }
                    </Text>
                  </View>
                </View>
                <View style={styles.headerText}>
                  <Text>
                    {" "}
                    Report No: HTCB{reportData?.report_number || "--"}
                  </Text>
                </View>

                <Text style={styles.headerText}>
                  Service Date: {convertReportDate(reportData?.report_date)}
                </Text>
              </View>
              <Text style={styles.headerText}>
                Location: {reportData?.location || "--"}
              </Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCellLeft,
                    { flex: 0.5, padding: 0.5 },
                  ]}
                >
                  <Text>Sr No.</Text>
                </View>
                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCellLeft,
                    { flex: 2, padding: 2 },
                  ]}
                >
                  <Text>Description</Text>
                </View>
                <View
                  style={[styles.tableHeader, { flex: 2, borderRightWidth: 0 }]}
                >
                  <Text>Observation Report</Text>
                </View>
              </View>

              {tableData.map((item, index) => (
                <View key={index} style={{ fontWeight: "medium" }}>
                  {item.fieldName === "contact_resistance" ? (
                    <>
                      {/* First Row: Sr No., Description, and R/Y/B Headers */}
                      <View style={[styles.tableRow]}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              flex: 0.5,
                              justifyContent: "center",
                              alignItems: "center",
                            },
                          ]}
                        >
                          <Text>{item.srNo}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              flex: 2,
                              fontWeight: "medium",
                              borderBottomWidth: 0,
                              borderBottomColor: "transparent",
                              marginLeft: 5,
                              maxWidth: 233.7,
                            },
                          ]}
                        >
                          <Text>{item.description}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            { flex: 2, borderRightWidth: 0 },
                          ]}
                        >
                          <View style={styles.specialCellContainer}>
                            <View style={styles.specialCell}>
                              <Text>R</Text>
                            </View>
                            <View style={styles.specialCell}>
                              <Text>Y</Text>
                            </View>
                            <View
                              style={[
                                styles.specialCell,
                                { borderRightWidth: 0 },
                              ]}
                            >
                              <Text>B</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      {/* Second Row: Empty Sr No. and Description, subRows Values */}
                      {item.subRows &&
                        item.subRows.map((subRow, subIndex) => (
                          <View style={[styles.tableRow]} key={subIndex}>
                            <View
                              style={[
                                styles.tableCell,
                                { flex: 0.5, paddingVertical: 8 },
                              ]}
                            />
                            <View
                              style={[
                                styles.tableCell,
                                styles.subRowDescription,
                                {
                                  flex: 2,
                                  padding: 0,
                                  borderTopWidth: 0,
                                  borderTopColor: "transparent",
                                },
                              ]}
                            />
                            <View
                              style={[
                                styles.tableCell,
                                { flex: 2, padding: 0, borderRightWidth: 0 },
                              ]}
                            >
                              <View style={styles.specialCellContainer}>
                                <View style={styles.specialCell}>
                                  <Text>{subRow.r || "--"}</Text>
                                </View>
                                <View style={styles.specialCell}>
                                  <Text>{subRow.y || "--"}</Text>
                                </View>
                                <View
                                  style={[
                                    styles.specialCell,
                                    { borderRightWidth: 0 },
                                  ]}
                                >
                                  <Text>{subRow.b || "--"}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                    </>
                  ) : (
                    <>
                      <View style={styles.tableRow}>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              flex: 0.5,
                              justifyContent: "center",
                              alignItems: "center",
                            },
                          ]}
                        >
                          <Text>{item.srNo}</Text>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            {
                              flex: 2,
                              fontWeight: "medium",
                              justifyContent: "center",
                              alignItems: "flex-start",
                            },
                          ]}
                        >
                          <View style={{ marginLeft: 5 }}>
                            <Text>{item.description}</Text>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.tableCell,
                            { flex: 2, borderRightWidth: 0, padding: 0 },
                          ]}
                        >
                          {item.observationReport === "special" ? (
                            <View style={styles.specialCellContainer}>
                              <View style={styles.specialCell}>
                                <Text>R</Text>
                              </View>
                              <View style={styles.specialCell}>
                                <Text>Y</Text>
                              </View>
                              <View
                                style={[
                                  styles.specialCell,
                                  { borderRightWidth: 0 },
                                ]}
                              >
                                <Text>B</Text>
                              </View>
                            </View>
                          ) : item.srNo === 5 ||
                            item.srNo === 6 ||
                            item.srNo === 7 ? (
                            <View
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                height: "13",
                                paddingHorizontal: 4,
                              }}
                            >
                              <Text>
                                {(reportData as Record<string, any>)[
                                  item.fieldName
                                ] || "--"}
                              </Text>
                              {reportData[item?.hide] && (
                                <View
                                  style={{
                                    fontSize: 8,
                                    borderLeft: "1px solid black",
                                    minWidth: "50%",
                                    padding: 0,
                                  }}
                                >
                                  <Text
                                    style={[
                                      styles.special1SubRow,
                                      {
                                        gap: 6,
                                        paddingHorizontal: 4,
                                        display: "flex",
                                        flexDirection: "row",
                                        textAlign: "left",
                                      },
                                    ]}
                                  >
                                    <View>
                                      <Text style={{ marginRight: 6 }}>
                                        {item.desciption1 || "RESISTANCE"}:
                                      </Text>
                                    </View>
                                    <View style={{ marginLeft: 6 }}>
                                      <Text>
                                        {reportData[item.fieldName1] || "--"}Ω
                                      </Text>
                                    </View>
                                  </Text>
                                </View>
                              )}
                            </View>
                          ) : (
                            <Text style={{ padding: 3, textAlign: "center" }}>
                              {item.observationReport}
                            </Text>
                          )}
                        </View>
                      </View>

                      {item.subRows &&
                        item.subRows.map((subRow, subIndex) => (
                          <View style={styles.tableRow} key={subIndex}>
                            <View
                              style={[
                                styles.tableCell,
                                { flex: 0.5, paddingVertical: 8 },
                              ]}
                            />
                            <View
                              style={[
                                styles.tableCell,
                                styles.subRowDescription,
                                {
                                  flex: 2,
                                  padding: 0,
                                  marginLeft: 5,
                                  maxWidth: 233.7,
                                },
                              ]}
                            >
                              <Text>{subRow.description || "N/A"}</Text>
                            </View>
                            <View
                              style={[
                                styles.tableCell,
                                { flex: 2, padding: 0, borderRightWidth: 0 },
                              ]}
                            >
                              <View style={styles.specialCellContainer}>
                                <View style={styles.specialCell}>
                                  <Text>{subRow.r || "--"}</Text>
                                </View>
                                <View style={styles.specialCell}>
                                  <Text>{subRow.y || "--"}</Text>
                                </View>
                                <View
                                  style={[
                                    styles.specialCell,
                                    { borderRightWidth: 0 },
                                  ]}
                                >
                                  <Text>{subRow.b || "--"}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        ))}
                    </>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.footerContainer}>
              <View style={styles.footerColumn}>
                <Text>For Client: {reportData.for_client || "--"}</Text>
              </View>
              <View style={styles.footerColumn}>
                <Text>For Ok Agencies: {reportData.for_ok_agency || "--"}</Text>
              </View>
            </View>
          </View>
          <View style={{ maxWidth: "90%" }}>
            <Image
              src="/stamp.jpg"
              style={{
                objectFit: "contain",
                left: safeX,
                width: 90,
                height: 90,
                marginLeft: 25,
              }}
            />
          </View>
        </View>

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

export default HTBreakerReport;
