import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  companyType,
  fetchCompanyAsync,
  selectCompany,
} from "@/features/company/companySlice";
import { reportFormSchema } from "@/features/oilReport/OilReportCreate";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { useEffect } from "react";
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
    marginBottom: 10,
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
    paddingVertical: 4,
    marginBottom: 4,
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

interface ImageConstraints {
  left: string | number;
  top: string | number;
}

const OilReport = ({
  reportData,
  companyData,
  imageConstraints = { left: 0, top: 0 },
}: {
  reportData: z.infer<typeof reportFormSchema>;
  companyData: companyType[];
  imageConstraints?: ImageConstraints;
}) => {
  const pixelsToPoints = (value: string | number): number => {
    if (typeof value === "number") return value * 0.75;
    if (typeof value === "string" && value.endsWith("px"))
      return parseFloat(value) * 0.75;
    return parseFloat(value) * 0.75; // treat bare numbers as px too
  };
  console.log(
    pixelsToPoints(imageConstraints.left),
    pixelsToPoints(imageConstraints.top)
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
                  L&K AUTHORIZED SERVICE CENTER
                </Text>
              </View>
            </View>
            <View style={styles.headerBarYellow} />
            <View style={styles.headerBarBlue} />
          </View>

          <View style={[styles.section, { position: "relative" }]}>
            <View style={styles.row}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Report No.: 01/25-26
              </Text>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                Date: {reportData.report_date || "07.04.2025"}
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
                  label: "Transformer Oil Quantity",
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
            <Image
              src={"/stamp.jpg"}
              style={{
                position: "absolute",
                objectFit: "contain",
                left: pixelsToPoints(imageConstraints.left) /* px -> pt */,
                top: pixelsToPoints(imageConstraints.top) /* px -> pt */,
                width: "150px",
                height: "150px",
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
