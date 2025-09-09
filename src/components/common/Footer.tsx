import React from "react"
import { IoMailOutline } from "react-icons/io5"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"

export const Footer: React.FC = () => {
  const { t } = useTranslation("common")
  const { pathname } = useLocation();    
  const isPdfPage = pathname.includes('pdf')
  
  const phone = t("footer.phone")
  const email = t("footer.email")
  const website = t("footer.website")
  const telHref = `tel:${phone.replace(/\D/g, "")}`
  const mailHref = `mailto:${email}`
  const webHref = website.startsWith("http") ? website : `https://${website}`

  return (
    <>
      {!isPdfPage &&
        <footer className="bg-black text-white border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 text-left">
            <h2 className="text-xl font-semibold">{t("footer.title")}</h2>
            <p className="text-sm mt-1">{t("footer.hours")}</p>

            <address className="not-italic mt-1 space-y-1">
              <p className="text-sm">
                <a
                  href={telHref}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm"
                  aria-label={`${t("footer.title")} - ${phone}`}
                >
                  {phone}
                </a>
              </p>

              <p className="text-sm inline-flex items-center justify-center gap-2">
                <IoMailOutline className="text-[18px]" aria-hidden />
                <a
                  href={mailHref}
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm"
                  aria-label={`${t("footer.title")} - ${email}`}
                >
                  {email}
                </a>
              </p>

              <p className="text-sm">
                <a
                  href={webHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm"
                  aria-label={`${t("footer.title")} - ${website}`}
                >
                  {website}
                </a>
              </p>
            </address>
          </div>
        </footer>
      }
    </>
  )
}
