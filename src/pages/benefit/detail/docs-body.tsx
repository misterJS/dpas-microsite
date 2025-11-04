import { pdfFileCheckRiplay } from "@/assets";
import PdfViewer from "@/pages/pdf/PdfViewer";

export default function DocsBody() {
  return (
    <div className="max-w-max">
      <PdfViewer pdfUrl={pdfFileCheckRiplay} />
    </div>
  );
}
