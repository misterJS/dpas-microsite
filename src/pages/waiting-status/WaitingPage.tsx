import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { waiting, sucess, failed } from "@/assets";
import { useTranslation } from "react-i18next";

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
  
  const startCountdown = (durationInSeconds: number) => {
    let timer = durationInSeconds;

    const countdownInterval = setInterval(function () {
      const minutes = Math.floor(timer / 60);
      let seconds: string | number = timer % 60;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      setProgress(`${minutes}:${seconds}`)

      if (--timer < 0) {
        clearInterval(countdownInterval);
        setStatus('sucess')
        setImages(sucess)
        setWording({ title: t("progressStatus.sucess.title"), desc: t("progressStatus.sucess.desc")})
        setProgress(t("progressStatus.sucess.paymentButton"))
      }
    }, 1000);
  }

  useEffect(() => {
    startCountdown(120)
  }, [])

  const handleNextRoute = () => {
    if(status === "sucess"){
      navigate("/payment")
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