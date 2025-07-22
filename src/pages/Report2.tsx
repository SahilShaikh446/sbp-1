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
    padding: 6, // Increased for better spacing (matches previous versions)
    fontSize: 10,
    fontFamily: "Tinos",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 10,
  },
  headerRow: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  logo: {
    width: 100, // Fixed width to control rendering
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
    height: 8, // Reduced for performance
  },
  headerBarBlue: {
    backgroundColor: "#084f88",
    height: 8,
    marginBottom: 8,
  },
  section: {
    marginBottom: 10,
    paddingHorizontal: 40, // Centered content (matches maxWidth: 75%)
  },
  reportTitle: {
    textAlign: "center",
    fontSize: 17,
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
    width: 80, // Fixed width for consistent alignment
  },
  colon: {
    width: 20,
    textAlign: "center",
  },
  value: {
    fontWeight: "bold",
    maxWidth: 320, // Constrain client text
    flex: 1,
    fontFamily: "Tinos.bold",
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 1.3,
    maxWidth: 460, // Matches max-w-[700px] in previous versions
  },
  table: {
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    marginBottom: 4,
  },
  tableLabel: {
    width: 160,
    fontWeight: "medium",
  },
  tableColon: {
    width: 20,
    textAlign: "center",
  },
  tableValue: {
    maxWidth: 300, // Prevent rightward shift
    flex: 1,
  },
  tableTitle: {
    fontSize: 15,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 6,
  },
  footer: {
    bottom: 20, // Space from page bottom
    left: 0,
    right: 0,
    borderTopWidth: 2,
    borderColor: "#084f88",
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

interface ReportData {
  report_date: string;
  client: string;
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

const Report2 = ({ reportData }: { reportData: ReportData }) => {
  console.log("Report Data:", reportData);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={{ width: "40%" }}>
              <Image src="/fonts/oka.png" style={styles.logo} />
            </View>
            <View style={styles.logoRight}>
              <Image src="/fonts/l&k.jpeg" style={styles.logo} />
              <Text style={styles.logoRightText}>
                L&K AUTHORIZED SERVICE CENTER
              </Text>
            </View>
          </View>
          <View style={styles.headerBarYellow} />
          <View style={styles.headerBarBlue} />
        </View>

        <View style={styles.section}>
          {/* Report Info */}
          <View style={styles.row}>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              Report No.: 01/25-26
            </Text>
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              Date: {reportData.report_date || "07.04.2025"}
            </Text>
          </View>

          <Text style={styles.reportTitle}>OIL FILTRATION TEST REPORT</Text>

          {/* Client */}
          <View style={styles.clientRow}>
            <Text style={styles.label}>CLIENT</Text>
            <Text style={styles.colon}>:</Text>
            <View style={styles.value}>
              {reportData.client ? (
                <Text>{reportData.client}</Text>
              ) : (
                <>
                  <Text>Ms. Dr. Acharya Laboratories Pvt. Ltd.</Text>
                  <Text>Anand Nagar, Ambernath (East)</Text>
                </>
              )}
            </View>
          </View>

          {/* Paragraph */}
          <Text style={styles.paragraph}>
            {reportData.report_description ||
              "We have carried out oil filtration work for your transformer oil for dielectric strength in filtration at site & tested the sample after transformer oil for dielectric strength in accordance with 1866-2017 and the results are as under."}
          </Text>

          {/* Table */}
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
                label: "Transformer Oil Quantity",
                value: reportData.transformer_oil_quantity || "1590 LITERS",
              },
              {
                label: "Before Filtration",
                value: reportData.transformer_before_filtration || "36 KV",
              },
              {
                label: "After Filtration",
                value:
                  reportData.transformer_after_filtration ||
                  "Sample withstood at 80 KV for 1 minute",
              },
              {
                label: "OLTC Oil Quantity",
                value: reportData.oltc_oil_quantity || "210 LITERS",
              },
              {
                label: "Before Filtration",
                value: reportData.oltc_before_filtration || "40 KV",
              },
              {
                label: "After Filtration",
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
              {
                label: "Date Of Filtration",
                value: reportData.date_of_filtration || "April 3rd, 2025",
              },
              {
                label: "Client’s Representative",
                value:
                  reportData.clients_representative || "Mr. Sakharam Parab",
              },
              {
                label: "Tested By",
                value: reportData.tested_by || "M/s. OK AGENCIES",
              },
            ].map(({ label, value }, idx) => (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableLabel}>{label}</Text>
                <Text style={styles.tableColon}>:</Text>
                <Text style={styles.tableValue}>{value || "N/A"}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              Address for correspondence:
            </Text>{" "}
            101, Nimesh Industrial Premises, Bhoir Nagar, Mulund(E),
          </Text>
          <Text>
            Mumbai-400081, Email:{" "}
            <Text style={styles.blueText}>okagencies@gmail.com</Text>, Tel:
            022-25693547
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Website:</Text>{" "}
            <Text style={styles.blueText}>www.okagencies.in</Text>,{" "}
            <Text style={{ fontWeight: "bold" }}>GST NO:</Text> 27AAHFO4632H1ZP
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Report2;
