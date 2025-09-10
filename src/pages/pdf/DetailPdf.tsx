import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { pdfFileRiplay } from "@/assets";
import PdfViewer from "./PdfViewer";

export default function ContentPdf() {
  const { pathname } = useLocation(); 
  const [pdfPath, setPdfPath] = useState('')

  useEffect(()=>{
    if(pathname.includes('check-replay')){
      setPdfPath(pdfFileRiplay)
    }
  },[pdfPath])

    return (
      <div className="max-w-max">
        <PdfViewer pdfUrl={pdfPath} />
      </div>
    );
}