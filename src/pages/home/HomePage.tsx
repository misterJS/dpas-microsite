import { bannerLanding, itemLanding } from "@/assets"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"
import { IoArrowForwardOutline } from "react-icons/io5"
import { Link } from "react-router-dom"
export default function HomePage() {

  const Tittle = (props: { color?: string }) => {
    return (
      <div className="text-4xl font-light font-sans">
        <span className={`font-extrabold ${props.color}`}>PRU</span>
        <span>Lindungi</span>
        <p>Syariah</p>
      </div>
    );
  };

  return (
    <div className="">
      <div className="relative">
        <img
          src={bannerLanding}
          alt={'imageAlt'}
          className="block w-full object-cover"
          loading="lazy"
        />
        <div className="relative w-full h-32 bg-cover bg-center bg-[#F7F7F7]"></div>
        <div className="absolute right-0 bottom-[70px]">
          <div className="bg-white pl-5 pr-16 py-10 rounded-l-lg">
            <div className="font-semibold">Asuransi Jiwa</div>
            <Tittle color="text-red-600" />
            <div className="text-base leading-7 text-foreground/80">Asuransi Kecelakaan Syariah</div>
            <Button
              className={cn("text-white bg-red-600 font-medium rounded-full text-lg px-5 py-2.5 text-center me-2 mb-2 mt-5")}
            >
              Daftar sekarang
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-0">
        <div style={{ background: "linear-gradient(to left, #F7F7F7 50%, #E5EAEF 50%)"}} className="h-5"></div>
        <div className="mb-10">
          <img
            src={itemLanding}
            alt={'imageAlt'}
            className="block w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="p-4">
        <Tittle />
        <p className="text-base leading-7 text-foreground/80 mt-3">
          Asuransi Jiwa PRULindungi Syariah (PRULindungi Syariah) adalah produk asuransi jiwa tradisional dari PT Prudential
          Sharia Life Assurance (Prudential Syariah) dengan perlindungan Manfaat Dasar Meninggal Dunia yang dilengkapi dengan
          tambahan Manfaat Pilihan untuk melengkapi perlindungan jiwa Anda atas risiko Kecelakaan.
        </p>
        <div className="mt-5 mb-5">
          <Link
              to={''}
              className="inline-flex items-center gap-2 font-semibold group"
              aria-label={`Selengkapnya`}
          >
              <span>Cek RIPLAY Umum</span>
              <IoArrowForwardOutline
                  aria-hidden
                  className="text-[#E30613] text-[20px] shrink-0 transition-transform group-hover:translate-x-0.5"
              />
          </Link>
        </div>
      </div>
    </div>
  )
}
