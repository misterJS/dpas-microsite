import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { pdfFileCheckRiplay } from "@/assets";
import { useDocument } from "@/hooks/useDocument";
import { useTranslation } from "react-i18next";
import { useSubmissionStore } from "@/lib/store/submissionDataStore";
import PdfViewer from "@/pages/pdf/PdfViewer";

export default function DocsBody() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const [pdf, setPdf] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [params] = useSearchParams();
  const { submission } = useSubmissionStore();
  const type = params.get("type") || "check-replay";
  const slug = params.get("slug") || "uob";
  const productCode = params.get("product") || "ACC";

  const body = {
    nama: submission.client.fullName,
    dob: submission.client.dob,
    gender: submission.client.sex,
    beneficiary: "",
    email: submission.client.email ?? "",
    packageName: submission.product.package.packageName,
    term: submission.product.package.term.term,
  };

  const { data, isLoading, isError } = useDocument(
    slug,
    productCode,
    body,
    shouldFetch
  );

  useEffect(() => {
    if (type === "check-riplay") {
      setPdf(pdfFileCheckRiplay);
    } else if (type === "riplay") {
      setShouldFetch(true);
      data && setPdf(`data:application/pdf;base64,${data.riplayURL}`);
    }
  }, [data]);

  return (
    <div className="max-w-max">
      {isLoading && <div className="p-2">{t("status.loading")}</div>}
      {isError && (
        <div className="p-2 text-red-600">{t("status.loadFailed")}</div>
      )}
      {!isLoading && !isError && <PdfViewer pdfUrl={pdf} />}
    </div>
  );
}
