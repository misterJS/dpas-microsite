import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { waiting, sucess, failed } from "@/assets";
import { useTranslation } from "react-i18next";
import { usePayment, useProposalStatus } from "@/hooks/useProposal";

export default function WaitingPage() {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const [progress, setProgress] = useState('2:00')
  const [status, setStatus] = useState('waiting')
  const [images, setImages] = useState(waiting)
  const [wording, setWording] = useState({
    title: t("progressStatus.waiting.title"),
    desc: t("progressStatus.waiting.desc")
  })
  const [stopPolling, setStopPolling] = useState(true)

  const [params] = useSearchParams()
  const { brand } = useParams();
  const spaj_number = params.get("spaj_number") || ""
  const { data } = useProposalStatus(spaj_number, stopPolling)
  const { mutate } = usePayment();

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
        setStopPolling(false) 
      }

      if (data?.inforce) {
        clearInterval(countdownInterval);
        setStatus("inforce");
        setImages(sucess);
        setWording({
          title: t("progressStatus.inforce.title"),
          desc: t("progressStatus.inforce.desc"),
        });
        setProgress(t("progressStatus.inforce.paymentButton"));
        setStopPolling(false) 
      }

      if (data?.failed) {
        clearInterval(countdownInterval);
        setStatus("failed");
        setImages(failed);
        setWording({
          title: t("progressStatus.failed.title"),
          desc: t("progressStatus.failed.desc"),
        });
        setProgress(t("progressStatus.failed.paymentButton"));
        setStopPolling(false) 
      }

      if (--timer < 0 && !data?.success) {
        timer = 120; // reset jadi 2 menit lagi
        setProgress("2:00");
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [data?.success, data?.failed, data?.inforce]);

  const handleNextRoute = () => {
    if (status === "waiting") return;
    if(status === "success"){
      mutate(spaj_number, {
        onSuccess: (res) => { window.location.href = res.url },
        onError: (err) => console.log(err)
      });
    }else{
      navigate(`/${brand}?reset_session=true`)
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