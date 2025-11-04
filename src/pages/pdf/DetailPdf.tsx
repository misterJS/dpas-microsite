import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pdfFileCheckRiplay } from "@/assets";
import PdfViewer from "./PdfViewer";
import { useDocument } from "@/hooks/useDocument";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { IoMdDownload } from "react-icons/io"
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import moment from "moment";
import { LoadingComponent } from "@/components/common/LoadingComponent";

export default function ContentPdf() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { brand } = useParams()
  const [pdf, setPdf] = useState('')
  const [shouldFetch, setShouldFetch] = useState(false)
  const [params] = useSearchParams()
  const { submission } = useSubmissionStore();
  const type = params.get("type") || "check-riplay"
  const product_code = params.get("product") || "ACC"

  const body = {
    full_name: submission.client.full_name,
    dob: moment(submission.client.dob).format('YYYY-MM-DD'),
    pob: submission.client.pob,
    sex: submission.client.sex === "M" ? "MEN" : submission.client.sex === "F" ? "WOMEN" : "",
    benef_name: submission.client.benef_name,
    email: submission.client.email ?? "",
    package_code: submission.product.package.package_code ?? "",
    product_code: submission.product.product_code ?? "",
    term: submission.product.package.term.term ?? 0,
    term_unit: submission.product.package.term.term_unit ?? "",
  }

  const { data, isLoading, isError } = useDocument(brand, product_code, body, shouldFetch)
  const filename = "riplay-personal.pdf"
  
  useEffect(() => {
    if (type === "check-riplay") {
      setPdf(pdfFileCheckRiplay)
    } else if (type === "riplay") {
      setShouldFetch(true)
      data && setPdf(`data:application/pdf;base64,${data.fileBase64}`)
    }
  }, [data])

  const handleNextRoute = () => {
    if (type === "riplay") {
      navigate(`/${brand}/consent?product=${submission.product.product_code}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {isError && <div className="p-2 text-red-600">{t("status.loadFailed")}</div>}
      {!isLoading && !isError && (
        <>
          <div className="flex-1">
            <PdfViewer pdfUrl={pdf} />
          </div>

          {type !== "check-riplay" && (
            <div className="p-4 mt-auto">
              <a href={pdf} download={filename}>
                <Button variant={"ghost"} className="w-full py-8">
                  <span className="text-black">{t("consent.ctaDownload")} </span><IoMdDownload className="text-red-600" />
                </Button>
              </a>
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
            </div>
          )}
        </>
      )}
      <LoadingComponent open={isLoading} />
    </div>
  );
}