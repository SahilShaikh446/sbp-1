import { PDFViewer } from "@react-pdf/renderer";
import Report from "./Report";

const PdfPreview = () => (
  <PDFViewer width="100%" height="1000px">
    <Report />
  </PDFViewer>
);
export default PdfPreview;
