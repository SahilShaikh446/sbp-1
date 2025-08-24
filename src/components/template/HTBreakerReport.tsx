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
    padding: 6,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: "90%",
    marginHorizontal: "auto",
  },
  headerText: {
    fontSize: 10,
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
    padding: 1,
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
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  specialCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#000000",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
  },
  subRowDescription: {
    paddingLeft: 2,
    textAlign: "left",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingHorizontal: 3,
    fontWeight: "bold",
    fontSize: 10,
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
});

// Inspection data structure to map form fields to table rows
const inspectionData = [
  {
    srNo: 1,
    description: "PANEL NO/FEEDER NAME PLATE",
    fieldName: "panel_no_feeder_name_plate",
  },
  { srNo: 2, description: "CB TYPE", fieldName: "cb_type" },
  { srNo: 3, description: "VOLTAGE/AMPS/KA", fieldName: "voltage_amps_ka" },
  { srNo: 4, description: "VCB SERIAL NO.", fieldName: "vcb_sr_no_year" },
  {
    srNo: 5,
    description: "SPRING CHARGE MOTOR VOLTS",
    fieldName: "spring_charge_motor_volts",
  },
  {
    srNo: 6,
    description: "CLOSING COIL VOLTAGE",
    fieldName: "closing_coil_voltage",
  },
  { srNo: 7, description: "TRIP COIL VOLTAGE", fieldName: "trip_coil_voltage" },
  { srNo: 8, description: "COUNTER READING", fieldName: "counter_reading" },
  {
    srNo: 9,
    description: "VISUAL INSPECTION FOR DAMAGED",
    fieldName: "visual_inspection_for_damaged",
  },
  { srNo: 10, description: "REPLACEMENT", fieldName: "replacement" },
  { srNo: 11, description: "THOROUGH CLEANING", fieldName: "through_cleaning" },
  {
    srNo: 12,
    description: "LUBRICATION OF MOVING PARTS",
    fieldName: "lubricant_oil_moving_parts",
  },
  { srNo: 13, description: "TORQUE", fieldName: "torque" },
  {
    srNo: 14,
    description: "ON/OFF OPERATION ELECT/MANUAL",
    fieldName: "on_off_operation_elect_manual",
  },
  { srNo: 15, description: "SF6 CHECKING", fieldName: "sp6_checking" },
  {
    srNo: 16,
    description: "RACK IN/OUT CHECKING",
    fieldName: "rack_in_out_checking",
  },
  {
    srNo: 17,
    description: "SHUTTER MOVEMENT CHECKING",
    fieldName: "shutter_movement_checking",
  },
  {
    srNo: 18,
    description: "DRIVE MECHANISM CHECKING",
    fieldName: "drive_mechanism_checkin",
  },
  {
    srNo: 19,
    description: "CHECKING CB/DOOR INTERLOCK",
    fieldName: "checking_cb_door_interlock",
  },
  {
    srNo: 20,
    description: "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )",
    fieldName: "insulation_resistance_check_using_5kv_insulation_tester",
    observationReport: "special",
  },
  {
    srNo: 21,
    description: "CHECKING CB TIMING",
    fieldName: "checking_cb_timing",
    observationReport: "special",
  },
  {
    srNo: 22,
    description: "CONTACT RESISTANCE ( MICRO OHM )",
    fieldName: "contact_resistance",
    observationReport: "special",
  },
  { srNo: 23, description: "REPAIR", fieldName: "repair" },
  { srNo: 24, description: "REMARK", fieldName: "remark" },
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
      | { description: string; r: string; y: string; b: string }[]
      | undefined;
    let rValue: string | undefined;
    let yValue: string | undefined;
    let bValue: string | undefined;

    if (item.observationReport === "special") {
      observationReport = "special";
      if (
        item.fieldName ===
        "insulation_resistance_check_using_5kv_insulation_tester"
      ) {
        subRows =
          reportData.insulation_resistance_check_using_5kv_insulation_tester
            .subrows;
      } else if (item.fieldName === "checking_cb_timing") {
        subRows = reportData.checking_cb_timing.subrows;
      } else if (item.fieldName === "contact_resistance") {
        observationReport = "special";
        rValue = reportData.contact_resistance || "--";
        yValue = reportData.contact_resistance || "--";
        bValue = reportData.contact_resistance || "--";
        subRows = [
          {
            description: "Contact Resistance Values",
            r: reportData.contact_resistance || "--",
            y: reportData.contact_resistance || "--",
            b: reportData.contact_resistance || "--",
          },
        ];
      }
    } else {
      const value = reportData[item.fieldName as keyof Report];
      observationReport = typeof value === "string" ? value : "--";
    }

    return {
      ...item,
      observationReport,
      subRows,
      rValue,
      yValue,
      bValue,
    };
  });

  // Get company details
  const company = companyData.find(
    (c) => `${c.id}` === `${reportData.company_id}`
  );

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
                  L&K AUTHORIZED SERVICE CENTER
                </Text>
              </View>
            </View>
            <View style={styles.headerBarYellow} />
            <View style={styles.headerBarBlue} />
          </View>

          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Client:{" "}
                <View style={{ flexDirection: "column" }}>
                  <Text>
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
              </Text>
              <Text style={styles.headerText}>
                Date: {convertReportDate(reportData?.report_date)}
              </Text>
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
                    { flex: 0.5, padding: 1.5 },
                  ]}
                >
                  <Text>Sr No.</Text>
                </View>
                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCellLeft,
                    { flex: 2, padding: 3.1 },
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
                <View key={index}>
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
                        { flex: 2, fontWeight: "medium" },
                      ]}
                    >
                      <Text>{item.description}</Text>
                    </View>
                    <View
                      style={[
                        styles.tableCell,
                        { flex: 2, borderRightWidth: 0, padding: 0 },
                      ]}
                    >
                      {item.observationReport === "special" ? (
                        <View style={styles.specialCellContainer}>
                          <View
                            style={[
                              styles.specialCell,
                              {
                                padding:
                                  item.description ===
                                  "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                    ? 8
                                    : item.description === "CHECKING CB TIMING"
                                    ? 1
                                    : 0,
                              },
                            ]}
                          >
                            <Text>
                              {item.description ===
                              "CONTACT RESISTANCE ( MICRO OHM )"
                                ? item.rValue || "--"
                                : "R"}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.specialCell,
                              {
                                padding:
                                  item.description ===
                                  "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                    ? 8
                                    : item.description === "CHECKING CB TIMING"
                                    ? 1
                                    : 0,
                              },
                            ]}
                          >
                            <Text>
                              {item.description ===
                              "CONTACT RESISTANCE ( MICRO OHM )"
                                ? item.yValue || "--"
                                : "Y"}
                            </Text>
                          </View>
                          <View
                            style={[
                              styles.specialCell,
                              {
                                padding:
                                  item.description ===
                                  "INSULATION RESISTANCE CHECK USING 5KV MEGGER ( GΩ )"
                                    ? 8
                                    : item.description === "CHECKING CB TIMING"
                                    ? 1
                                    : 0,
                                borderRightWidth: 0,
                              },
                            ]}
                          >
                            <Text>
                              {item.description ===
                              "CONTACT RESISTANCE ( MICRO OHM )"
                                ? item.bValue || "--"
                                : "B"}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text style={{ padding: 3, textAlign: "left" }}>
                          {item.observationReport}
                        </Text>
                      )}
                    </View>
                  </View>

                  {item.subRows &&
                    item.subRows.map((subRow, subIndex) => (
                      <View style={styles.tableRow} key={subIndex}>
                        <View style={[styles.tableCell, { flex: 0.5 }]} />
                        <View
                          style={[
                            styles.tableCell,
                            styles.subRowDescription,
                            { flex: 2, padding: 0 },
                          ]}
                        >
                          <Text>{subRow.description}</Text>
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
                bottom: 10,
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
