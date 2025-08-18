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
  section: {
    paddingVertical: 2, // Matches py-2
    borderTop: 1,
    borderLeft: 1,
    borderRight: 1,
    maxWidth: "90%",
    margin: "0 auto", // Center the section
  },
  reportTitle: {
    textAlign: "center",
    fontSize: 18, // Matches text-2xl (approximately 18pt in PDF)
    fontWeight: "bold",
    textDecoration: "underline",
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 12, // Matches pr-8
    paddingLeft: 12, // Matches pl-4
    fontSize: 10, // Matches text-sm
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingVertical: 3,
  },
  clientRow: {
    flexDirection: "row",
    paddingRight: 8,
    paddingLeft: 12,
    fontSize: 10,
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingVertical: 3,
  },
  label: {
    fontWeight: "bold",
    paddingLeft: 4,
    width: "60%",
    flexWrap: "nowrap",
    paddingVertical: 1, // Matches py-1
  },
  value: {
    fontWeight: "normal",
    paddingVertical: 1,
  },
  table: {
    fontSize: 10, // Matches text-sm
  },
  tableRow: {
    flexDirection: "row",
    width: "100%",
    paddingLeft: 12,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableRowSplit: {
    flexDirection: "row",
    paddingRight: 8,
    paddingLeft: 4,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableLabel: {
    display: "flex",
    flexDirection: "row",
    width: "66%", // Matches w-2/2
    fontWeight: "bold",
    borderRightWidth: 1,
    borderColor: "#000000",
    paddingRight: 4,
    paddingLeft: 9, // Matches px-2
  },
  tableValue: {
    display: "flex",
    flexDirection: "row",
    width: "34%", // Matches w-1/2
    paddingLeft: 2, // Matches px-2
  },
  tableSingle: {
    width: "100%",
    paddingLeft: 4,
    display: "flex",
    flexDirection: "row",
  },
  tableSingleLabel: {
    width: "60%", // Matches w-[60%]
    fontWeight: "bold",
  },
  tableSingleValue: {},
  tableTriple: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 8,
    paddingLeft: 14,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderColor: "#000000",
    fontWeight: "bold",
    gap: 16, // Matches gap-16
  },
  tableHeader: {
    fontSize: 10, // Matches text-sm
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    borderColor: "#000000",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  tableCell: {
    fontSize: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#000000",
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  tableCellLast: {
    fontSize: 10,
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18, // Matches text-2xl
    fontWeight: "bold",
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#000000",
    paddingVertical: 2,
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

interface ACBReportProps {
  reportData: ACBInspectionForm;
  companyData: companyType[];
  imageConstraints?: number;
}

const ACBReport = ({
  reportData,
  companyData,
  imageConstraints,
}: ACBReportProps) => {
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

          <View style={styles.section}>
            <Text style={styles.reportTitle}>ACB SERVICE REPORT</Text>

            <View style={styles.row}>
              <Text
                style={{
                  fontWeight: "bold",
                  paddingLeft: 4,
                  flexWrap: "nowrap",
                }}
              >
                Test Report No.: 12/25-26
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  paddingLeft: 4,
                  flexWrap: "nowrap",
                }}
              >
                Date: {reportData.report_date || "--"}
              </Text>
            </View>

            <View style={styles.clientRow}>
              <Text style={styles.label}>
                Name of Client:
                {companyData?.find(
                  (i) => `${i.id}` === `${reportData.company_id}`
                )?.address
                  ? `; ${
                      companyData.find(
                        (i) => `${i.id}` === `${reportData.company_id}`
                      )?.address
                    }`
                  : "Ambernath (E)"}
              </Text>
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text
                  style={{ fontWeight: "bold", paddingLeft: 4, width: "38%" }}
                >
                  Location:{" "}
                </Text>
                <Text style={{ fontWeight: "bold" }}>
                  {reportData.location || "--"}
                </Text>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={[styles.label]}>Type of ACB: </Text>
                  <Text style={{ paddingRight: 32, fontWeight: "normal" }}>
                    {reportData.type_of_acb || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Closing Coil Voltage: </Text>
                  <Text style={styles.value}>
                    {reportData.closing_coil_voltage || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>ACB Sr. No.: </Text>
                  <Text style={styles.value}>
                    {reportData.acb_sr_no || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Shunt Release: </Text>
                  <Text style={styles.value}>
                    {reportData.shunt_release || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>Feeder Designation: </Text>
                  <Text style={styles.value}>
                    {reportData.feeder_designation || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Motor Voltage: </Text>
                  <Text style={styles.value}>
                    {reportData.motor_voltage || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>Current Rating: </Text>
                  <Text style={styles.value}>
                    {reportData.current_rating || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>U/V Release: </Text>
                  <Text style={styles.value}>
                    {reportData.u_v_release || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>Type of Release: </Text>
                  <Text style={styles.value}>
                    {reportData.type_of_release || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Setting: </Text>
                  <Text style={styles.value}>{reportData.setting || "--"}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>INSPECTION</Text>
            <View style={styles.table}>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>ON/OFF Operations Manual: </Text>
                  <Text style={styles.value}>
                    {reportData.on_off_operations_manual || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Moving: </Text>
                  <Text style={styles.value}>
                    {reportData.electrical || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>
                    Condition of Arcing Contacts (Fixed):{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_arcing_contacts_fixed || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Moving: </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_arcing_contacts_moving || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>
                    Condition of Main Contacts (Fixed):{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_main_contacts_fixed || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Moving: </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_main_contacts_moving || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRowSplit}>
                <View style={styles.tableLabel}>
                  <Text style={styles.label}>Condition of SIC (Fixed): </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_sic_fixed || "--"}
                  </Text>
                </View>
                <View style={styles.tableValue}>
                  <Text style={styles.label}>Moving: </Text>
                  <Text style={styles.value}>
                    {reportData.condition_of_sic_moving || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View
                  style={{
                    width: "50%", // Matches w-[60%]
                    fontWeight: "bold",
                  }}
                >
                  <Text style={styles.label}>Condition of Jaw Contact: </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.condition_of_jaw_contact || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.label}>
                    Condition of Cradle Terminals:{" "}
                  </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.condition_of_cradle_terminals || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.label}>
                    Condition of Earthing Terminals:{" "}
                  </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.condition_of_earthing_terminals || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.label}>Arcing Contact Gap: </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.arcing_contact_gap || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={{ width: "50%" }}>
                  <Text style={styles.label}>Condition of Arc Chute: </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.condition_of_arc_chute || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableTriple}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "30%",
                  }}
                >
                  <Text style={{ paddingRight: 8 }}>a) Dusty Housing: </Text>
                  <Text style={styles.value}>
                    {reportData.dusty_housing || "--"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "30%" }}>
                  <Text style={{ paddingRight: 8 }}>b) Broken Housing: </Text>
                  <Text style={styles.value}>
                    {reportData.broken_housing || "--"}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", width: "30%" }}>
                  <Text style={{ paddingRight: 8 }}>c) Clean: </Text>
                  <Text style={styles.value}>{reportData.clean || "--"}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableSingleLabel}>
                  <Text style={styles.label}>
                    Operation Of Auxiliary Contacts:{" "}
                  </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.operation_of_auxiliary_contacts || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableSingleLabel}>
                  <Text style={styles.label}>
                    Condition of Current Transformers:{" "}
                  </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.condition_of_current_transformers || "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableSingleLabel}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      paddingLeft: 4,
                      width: "80%",
                      flexWrap: "nowrap",
                    }}
                  >
                    Check control wiring of ACB for proper connections:{" "}
                  </Text>
                </View>
                <View style={styles.tableSingleValue}>
                  <Text style={styles.value}>
                    {reportData.check_control_wiring_of_acb_for_proper_connections ||
                      "--"}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>GREASING SCHEDULE</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableSingle}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      paddingRight: 8,
                      paddingLeft: 4,
                      paddingVertical: 1,
                      flexWrap: "nowrap",
                    }}
                  >
                    Greasing of moving parts in pole assembly:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.greasing_of_moving_parts_in_pole_assembly ||
                      "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableSingle}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      paddingRight: 8,
                      paddingLeft: 4,
                      flexWrap: "nowrap",
                      paddingVertical: 1,
                    }}
                  >
                    Greasing of moving parts of mechanism & rails:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.greasing_of_moving_parts_of_mechanism_and_rails ||
                      "--"}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>ACB RELEASE TESTING</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCell,
                    {
                      width: "16.67%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text>Protection</Text>
                </View>

                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCell,
                    {
                      width: "16.67%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text>Setting</Text>
                </View>
                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCell,
                    {
                      width: "16.67%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text>Characteristics</Text>
                </View>
                <Text
                  style={[
                    styles.tableHeader,
                    styles.tableCell,
                    { width: "16.67%" },
                  ]}
                >
                  TMS as per Relay Setting
                </Text>

                <View
                  style={[
                    styles.tableHeader,
                    styles.tableCell,
                    {
                      width: "16.67%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text>Actual TMS (Sec.)</Text>
                </View>
                <View
                  style={[
                    styles.tableHeader,
                    {
                      fontSize: 10,
                      textAlign: "center",
                      borderColor: "#000000",
                      paddingVertical: 6,
                      paddingHorizontal: 2,
                      width: "16.67%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text>Actual TMS (Sec.)</Text>
                </View>
              </View>
              {reportData.acb_testing_list?.map((test, id) => (
                <View style={styles.tableRow} key={id}>
                  <Text style={[styles.tableCell, { width: "16.67%" }]}>
                    {test.protection}
                  </Text>
                  <Text style={[styles.tableCell, { width: "16.67%" }]}>
                    {test.setting || "--"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "16.67%" }]}>
                    {test.characteristics || "--"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "16.67%" }]}>
                    {test.tms_as_per_relay_setting || "--"}
                  </Text>
                  <Text style={[styles.tableCell, { width: "16.67%" }]}>
                    {test.actual_tms || "--"}
                  </Text>
                  <Text style={[styles.tableCellLast, { width: "16.67%" }]}>
                    {test.result || "--"}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableSingle}>
                  <Text
                    style={[styles.label, { fontSize: 12, paddingVertical: 1 }]}
                  >
                    Recommended Spares for Replacement:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.recommended_spares_for_replacement || "--"}
                  </Text>
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableSingle}>
                  <Text
                    style={[styles.label, { fontSize: 12, paddingVertical: 1 }]}
                  >
                    Remarks:{" "}
                  </Text>
                  <Text style={styles.value}>{reportData.remarks || "--"}</Text>
                </Text>
              </View>
              <View style={styles.row}>
                <Text>
                  <Text style={[styles.label, { fontSize: 12 }]}>
                    Client's Repres.:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.client_repres || "--"}
                  </Text>
                </Text>
                <Text>
                  <Text style={[styles.label, { fontSize: 12 }]}>
                    Service Repres.:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {reportData.service_repres || "--"}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <Image
            src="/stamp.jpg"
            style={{
              objectFit: "contain",
              bottom: 10,
              left: 0,
              transform: `translateX(${imageConstraints || 0}px)`,
              width: 110,
              height: 110,
              maxWidth: "90%",
            }}
          />
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

export default ACBReport;
