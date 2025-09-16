import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pdfFileCheckRiplay } from "@/assets";
import PdfViewer from "./PdfViewer";
import { useDocument } from "@/hooks/useDocument";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";

export default function ContentPdf() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const [pdf, setPdf] = useState('')
  const [params] = useSearchParams()
  const { submission } = useSubmissionStore();
  const type = params.get("type") || "check-replay"
  const slug = params.get("slug") || "uob"
  const productCode = params.get("product") || "ACC"

  const body = {
    nama: submission.client.fullName,
    dob: submission.client.dob,
    gender: submission.client.sex,
    beneficiary: '',
    email: submission.client.email ?? '',
    packageName: submission.product.package.packageName,
    term: submission.product.package.term.term,
  }
  
  const { data, isLoading, isError } = useDocument(type, slug, productCode, body)

  useEffect(()=>{
    if(type === "check-riplay"){
      setPdf(pdfFileCheckRiplay)
    }else if(type === "riplay"){
      data && setPdf(data.riplayURL)
    }
  }, [data])

  const handleNextRoute = () => {
    if(type === "riplay"){
      navigate("/consent")
    }
  }

  return (
    <div className="max-w-max">
      {isLoading && <div className="p-2">{t("status.loading")}</div>}
      {isError && <div className="p-2 text-red-600">{t("status.loadFailed")}</div>}
      {!isLoading && !isError && 
      <>
        <PdfViewer pdfUrl={pdf} />
        {type !== "check-riplay" &&
        <>
          <Button
            disabled={false}
            className="w-full h-12 rounded-[14px] text-base font-semibold disabled:bg-[#BDBDBD] bg-[#2A504E] text-white"
            onClick={() => handleNextRoute()}
          >
            {t("form.next")}
          </Button>

          <div className="text-center text-[#4B4B4B] mt-5">
            <Link to={-1 as unknown as string} className="font-medium">
              {t("health.back")}
            </Link>
          </div>
        </>
        }
      </>
      }
    </div>
  );
}