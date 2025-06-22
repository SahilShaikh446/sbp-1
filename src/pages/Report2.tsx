// Report2.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    maxWidth: "100%",
  },
  header: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  logo: {
    width: "100%",
    height: 40,
    objectFit: "contain",
  },
  headerBarYellow: {
    backgroundColor: "#fcae08",
    height: 10,
    marginBottom: 2,
  },
  headerBarBlue: {
    backgroundColor: "#084f88",
    height: 10,
    marginBottom: 10,
  },
  section: {
    marginBottom: 10,
  },
  reportTitle: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
    textDecoration: "underline",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  clientRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    width: 60,
  },
  paragraph: {
    marginBottom: 10,
  },
  table: {},
  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  tableLabel: {
    width: 150,
    fontWeight: "bold",
  },
  tableColon: {
    width: 20,
  },
  tableValue: {
    flex: 1,
  },
  footer: {
    borderTop: 2,
    borderColor: "#084f88",
    paddingTop: 10,
    fontSize: 8,
    textAlign: "center",
  },
  blueText: {
    color: "#084f88",
  },
});

const Report2 = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={{ width: "40%" }}>
            <Image src="/oka.png" style={styles.logo} />
          </View>
          <View style={{ width: "40%", alignItems: "flex-end" }}>
            <Image src="/l&k.jpeg" style={styles.logo} />
            <Text style={{ color: "#5c9ed4", fontWeight: "bold" }}>
              L&K AUTHORIZED SERVICE CENTER
            </Text>
          </View>
        </View>
        <View style={styles.headerBarYellow} />
        <View style={styles.headerBarBlue} />
      </View>

      <View style={{ maxWidth: "70%", margin: "0 auto" }}>
        {/* Report Info */}
        <View style={styles.row}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Report No.: 01/25-26</Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Date: 07.04.2025</Text>
          </Text>
        </View>

        <Text style={styles.reportTitle}>OIL FILTRATION TEST REPORT</Text>

        {/* Client */}
        <View style={styles.clientRow}>
          <Text style={styles.label}>CLIENT :</Text>
          <View>
            <Text style={{ fontWeight: "bold" }}>
              M/s. Dr. Acharya Laboratories Pvt. Ltd.
            </Text>
            <Text style={{ fontWeight: "bold" }}>
              Anand Nagar, Ambernath (East)
            </Text>
          </View>
        </View>

        {/* Paragraph */}
        <Text style={styles.paragraph}>
          We have the pleasure in informing you that we have carried out
          transformer oil filtration on site & tested the sample of transformer
          oil for dielectric strength in accordance with 1966-2017 and the
          results are as under.
        </Text>

        {/* Table */}
        <View style={styles.table}>
          {[
            ["Transformer Details:", ""],
            ["KVA", "1250 KVA"],
            ["Voltage", "22000V / 433V"],
            ["Volume", "-"],
            ["Sr. No.", "41083/1 Year - 2011"],
            ["Transformer Oil Quantity", "1500 LITERS"],
            ["Before Filtration", "36 KV"],
            ["After Filtration", "Sample withdrawn at 80 KV for 1 minute"],
            ["Oil-Cut Oil Quantity", "240 LITERS"],
            ["Before Filtration", "40 KV"],
            ["After Filtration", "Sample withdrawn at 80 KV for 1 minute"],
          ].map(([label, value], idx) => (
            <View style={styles.tableRow} key={idx}>
              <Text style={styles.tableLabel}>{label}</Text>
              <Text style={styles.tableColon}>:</Text>
              <Text style={styles.tableValue}>{value}</Text>
            </View>
          ))}

          {/* Remark */}
          <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>Remark</Text>
            <Text style={styles.tableColon}>:</Text>
            <Text style={styles.tableValue}>
              Dielectric strength of transformer oil is Satisfactory. Silica Gel
              Replaced. All oil Servicing Completed. Transformer Tested.
              Breather & Valve O.L.T.C. Top Bottom oil gauge, temp. Total Gasket
              and Total Gasket Not Boil is replaced. O.L.T.C. oil new. Filled up
              and painting Epoxy.
            </Text>
          </View>
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
          Mumbai-400081 Email : okagencies@gmail.com Tel : 022-25693547
        </Text>
        <Text>
          <Text style={{ fontWeight: "bold" }}>Website :</Text>{" "}
          <Text style={styles.blueText}>www.okagencies.in</Text>{" "}
          <Text style={{ fontWeight: "bold" }}>GST NO :</Text> 27AAHFO4632H1ZP
        </Text>
      </View>
    </Page>
  </Document>
);

export default Report2;
