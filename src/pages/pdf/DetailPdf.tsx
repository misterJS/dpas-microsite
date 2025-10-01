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
  const [shouldFetch, setShouldFetch] = useState(false)
  const [params] = useSearchParams()
  const { submission } = useSubmissionStore();
  const type = params.get("type") || "check-riplay"
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
  
  const { data, isLoading, isError } = useDocument(slug, productCode, body, shouldFetch)

  useEffect(()=>{
    if(type === "check-riplay"){
      setPdf(pdfFileCheckRiplay)
    }else if(type === "riplay"){
      setShouldFetch(true)
      data && setPdf(`data:application/pdf;base64,${data.riplayURL}`)
    }
  }, [data])

  const handleNextRoute = () => {
    if(type === "riplay"){
      navigate("/consent")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
    {isLoading && <div className="p-2">{t("status.loading")}</div>}
    {isError && <div className="p-2 text-red-600">{t("status.loadFailed")}</div>}

    {!isLoading && !isError && (
      <>
        <div className="flex-1">
          <PdfViewer pdfUrl={pdf} />
        </div>

        {type !== "check-riplay" && (
          <div className="p-4 mt-auto">
            <Button
              disabled={false}
              className="w-full h-12 rounded-[14px] text-base font-semibold disabled:bg-[#BDBDBD] bg-[#69C8C3] text-white"
              onClick={() => handleNextRoute()}
            >
              {t("form.next")}
            </Button>

            <div className="text-center text-[#4B4B4B] mt-5">
              <Link to={-1 as unknown as string} className="font-medium">
                {t("health.back")}
              </Link>
            </div>
          </div>
        )}
      </>
    )}
  </div>
  );
}