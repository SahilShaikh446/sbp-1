import { PDFViewer } from "@react-pdf/renderer";
import Report from "../features/oilReport/OilReportCreate";

const PdfPreview = () => (
  <PDFViewer width="100%" height="1000px">
    <Report />
  </PDFViewer>
);
export default PdfPreview;
