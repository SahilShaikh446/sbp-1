import { companyType } from "@/features/company/companySlice";
import { convertReportDate } from "@/features/oilReport/OilReportCreate";
import { Report } from "@/features/oilReport/type";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

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
    padding: 6,
    fontSize: 10,
    fontFamily: "Tinos",
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    flexGrow: 1, // Ensure content takes available space
    flexDirection: "column",
  },
  header: {
    marginBottom: 10,
  },
  headerRow: {
    padding: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  logo: {
    height: 40,
    objectFit: "contain",
  },
  logoRight: {
    width: "40%",
    textAlign: "right",
  },
  logoRightText: {
    fontSize: 10,
    color: "#5c9ed4",
    fontWeight: "bold",
  },
  headerBarYellow: {
    backgroundColor: "#fcae08",
    height: 6, // Further reduced for performance
  },
  headerBarBlue: {
    backgroundColor: "#084f88",
    height: 6,
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 40, // Centered content (75% width)
    position: "relative",
  },
  reportTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    fontSize: 12,
  },
  clientRow: {
    flexDirection: "row",
    marginBottom: 12,
    fontSize: 13,
  },
  label: {
    fontWeight: "bold",
    width: 80,
  },
  colon: {
    width: 5,
    textAlign: "center",
  },
  value: {
    fontWeight: "bold",
    marginLeft: 10,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 1.3,
    maxWidth: 460,
  },
  table: {
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  tableLabel: {
    width: 130,
    fontWeight: "medium",
  },
  tableColon: {
    width: 40,
    textAlign: "center",
  },
  tableValue: {
    maxWidth: 320, // Increased slightly for better wrapping
    flex: 1,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 6,
  },
  footer: {
    bottom: 8, // Space from page bottom
    left: 0,
    right: 0,
    borderTopWidth: 4,
    borderColor: "#fcae08",
    paddingTop: 8,
    paddingHorizontal: 40,
    fontSize: 12,
    lineHeight: 1.3,
    textAlign: "center",
  },
  blueText: {
    color: "#084f88",
    fontWeight: "bold",
  },
});

const OilReport = ({
  reportData,
  companyData,
}: {
  reportData: Report;
  companyData: companyType[];
}) => {
  const PAGE_WIDTH = 510; // A4 width in points
  const STAMP_SIZE = 110;
  const safeX = Math.min(
    Math.max(reportData?.image_data?.x || 0, 0), // never less than 0
    PAGE_WIDTH - STAMP_SIZE // never beyond page
  );
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
                  LK AUTHORIZED SERVICE CENTER
                </Text>
              </View>
            </View>
            <View style={styles.headerBarYellow} />
            <View style={styles.headerBarBlue} />
          </View>

          <View style={[styles.section, { position: "relative" }]}>
            <View style={styles.row}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Report No.: TR -- {reportData.report_number || "--"}
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Date of Filteration:{" "}
                {convertReportDate(reportData.report_date) || ""}
              </Text>
            </View>

            <Text style={styles.reportTitle}>OIL FILTRATION TEST REPORT</Text>

            <View style={styles.clientRow}>
              <Text style={styles.label}>CLIENT</Text>
              <Text style={styles.colon}>:</Text>
              <View style={styles.value}>
                {reportData.company_id ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div>Ms. Dr. Acharya Laboratories Pvt. Ltd.,</div>
                    <div>Anand Nagar, Ambernath (East)</div>
                  </>
                )}
              </View>
            </View>

            <Text style={styles.paragraph}>
              {reportData.report_description ||
                "We have carried out oil filtration work for your transformer oil for dielectric strength in filtration at site & tested the sample after transformer oil for dielectric strength in accordance with 1866-2017 and the results are as under."}
            </Text>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableTitle}>Transformer Details</Text>
                <Text style={styles.tableColon}></Text>
                <Text style={styles.tableValue}></Text>
              </View>
              {[
                { label: "KVA", value: reportData.kva || "1250 KVA" },
                {
                  label: "Voltage",
                  value: reportData.voltage || "22000V / 433V",
                },
                { label: "Make", value: reportData.make || "Voltamp" },
                {
                  label: "Sr. No.",
                  value: reportData.sr_no || "41083/1 Year - 2011",
                },
                {
                  label: "Manufacturing Year",
                  value: reportData.manufacturing_year || "41083/1 Year - 2011",
                },
                {
                  label: "Transformer Oil Qty",
                  value: reportData.transformer_oil_quantity || "1590 LITERS",
                },
                {
                  label: "BDV Before Filtration",
                  value: reportData.transformer_before_filtration || "36 KV",
                },
                {
                  label: "BDV After Filtration",
                  value: reportData.transformer_after_filtration || "--",
                },
                {
                  label: "OLTC Make/Type",
                  value: reportData.oltc_make_type || "--",
                },
                {
                  label: "OLTC Oil Quantity",
                  value: reportData.oltc_oil_quantity || "210 LITERS",
                },
                {
                  label: "BDV Before Filtration",
                  value: reportData.oltc_before_filtration || "40 KV",
                },
                {
                  label: "BDV After Filtration",
                  value:
                    reportData.oltc_after_filtration ||
                    "Sample withstood at 80 KV for 1 minute",
                },
                {
                  label: "Remark",
                  value:
                    reportData.remark ||
                    "Dielectric strength of transformer oil is Satisfactory. Silica Gel Replaced. OLTC Servicing Done. Radiator, Main tank, Cable box, Conservator, Valve OLTC, Top Bottom oil gauge, mog, Total Gasket and Total Gasket Nut Bolt is replaced. OLTC oil new. Filled up and painting Epoxy.",
                },
              ].map(({ label, value }, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <Text style={styles.tableLabel}>{label}</Text>
                  <Text style={styles.tableColon}>:</Text>
                  <Text style={styles.tableValue}>{value || "N/A"}</Text>
                </View>
              ))}
            </View>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                fontWeight: "bold",
                fontSize: 15,
                marginTop: 5,
              }}
            >
              <View
                style={{ display: "flex", flexDirection: "column", gap: 5 }}
              >
                <Text>For Client :</Text>
                <Text>{reportData.for_client || "--"}</Text>
              </View>
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text>For Ok Agencies :</Text>
                <Text>{reportData.for_ok_agency || "--"}</Text>
              </View>
            </View>
            <Image
              src="/stamp.jpg"
              style={{
                objectFit: "contain",
                bottom: 10,
                left: safeX,
                width: 110, // 150px * 0.75
                height: 110, // 150px * 0.75
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
            9619866401 <Text style={{ fontWeight: "bold" }}>Email:</Text>{" "}
            <Text style={styles.blueText}>ok_agencies@yahoo.com</Text>,
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Website:</Text>{" "}
            <Text style={styles.blueText}>www.okagencies.in</Text>,{" "}
            <Text style={{ fontWeight: "bold" }}>GST NO: 27ABDPJ0462B1Z9</Text>
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default OilReport;
