import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { waiting, sucess, failed } from "@/assets";
import { useTranslation } from "react-i18next";
import { usePayment, useProposalStatus } from "@/hooks/useProposal";

export default function ContentPdf() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const [progress, setProgress] = useState('2:00')
  const [status, setStatus] = useState('waiting')
  const [images, setImages] = useState(waiting)
  const [wording, setWording] = useState({
    title: t("progressStatus.waiting.title"),
    desc: t("progressStatus.waiting.desc")
  })

  const [params] = useSearchParams()
  const spaj_number = params.get("spaj_number") || ""
  const { data, isLoading, isError } = useProposalStatus(spaj_number)
  const { mutate, isSuccess: successPayment, isError: errorPayment } = usePayment();

  useEffect(() => {
    let timer = 120;
    const countdownInterval = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      let seconds: string | number = timer % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      setProgress(`${minutes}:${seconds}`);

      if (data?.success) {
        clearInterval(countdownInterval);
        setStatus("success");
        setImages(sucess);
        setWording({
          title: t("progressStatus.success.title"),
          desc: t("progressStatus.success.desc"),
        });
        setProgress(t("progressStatus.success.paymentButton"));
      }

      if (--timer < 0 && !data?.success) {
        timer = 120; // reset jadi 2 menit lagi
        setProgress("2:00");
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [data?.success]);

  const handleNextRoute = () => {

    const paramsPayment = {
      allow_reg: false,
      allow_pay: true,
      cart: {
          prm: 1200000
      },
      cust_no: "972222772222",
      main_insured_name: "Bambang Sugeng",
      cust_name: "Bambang Sugeng",
      pay_option: "pruworks",
      source_app: "dpas Microsite",
      currency: "IDR",
      premium_amount: 51282000,
      email: "bambangsugeng@gmail.com",
      mobile_no: "+62878787878787",
      is_sharia: false,
      redirect_url: "https://somesite.net",
      source_bill: "somebill-12344"
    }
    if(status === "success"){
      mutate(paramsPayment, {
        onSuccess: (res) => { window.location.href = res.url },
        onError: (err) => console.log(err)
      });
    }else{
      navigate("/")
    }
  }

  return (
      <>
        <div className="bg-[#E5EAEF] text-center py-10">
          <div className="font-bold text-4xl">{t("progressStatus.header.preparation")}</div>
          <div className="text-4xl font-thin">{t("progressStatus.header.payment")}</div>
        </div>

          <div className="mt-12 px-3 flex justify-center">
            <img
              src={images}
              loading="eager"
            />
          </div>

        <div className="text-center mt-5">
          <div className="font-bold text-3xl">{wording.title}</div>
          <div className="text-2xl font-thin px-10">{wording.desc}</div>
          <button 
            className="text-white bg-[#ED1B2E] font-medium rounded-full text-xl px-5 py-2.5 text-center mt-5"
            onClick={() => handleNextRoute()}
          >
            {progress}
          </button>
        </div>
      </>
  );
}