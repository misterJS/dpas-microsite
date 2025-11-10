import BenefitCard from "@/components/cards/BenefitCards"
import { useTranslation } from "react-i18next"
import { useProducts } from "@/hooks/useProducts"
import { useNavigate, useParams } from "react-router-dom"
import { LoadingComponent } from "@/components/common/LoadingComponent"
import { useSubmissionStore } from "@/lib/store/submissionDataStore"
import { ProductListItem, SubmissionReq } from "@/api/types"
import { IoArrowForwardOutline } from "react-icons/io5"

export default function BenefitPage() {
  const { brand } = useParams()
  const { t } = useTranslation("common")
  const { data: products, isLoading, isError } = useProducts("uob")
  const { submission, setSubmissionData } = useSubmissionStore();
  const navigate = useNavigate();

  const handleNavigation = (productItem: ProductListItem) => {
    const data: SubmissionReq = {
      ...submission,
      product: {
        ...submission.product,
        product_image: productItem.image
      }
    };
    setSubmissionData(data);
    navigate(`/${brand}/products/${productItem.product_code}?type=check-riplay`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">{t("content.products")}</h1>
      {isError && <div className="p-2 text-red-600">{t("status.loadProductsFailed")}</div>}
      {products?.map((p) => (
        <BenefitCard
          key={p.product_code}
          title={p.product_name}
          description={p.desc}
          imageSrc={p.image}
          onClick={() => handleNavigation(p)}
          buttonTitle={t("actions.readMore")}
          className="border-none"
          icon={<IoArrowForwardOutline
            aria-hidden
            className="text-[#E30613] text-[20px] shrink-0 transition-transform group-hover:translate-x-0.5"
          />}
        />
      ))}
      <LoadingComponent open={isLoading} />
    </div>
  )
}
