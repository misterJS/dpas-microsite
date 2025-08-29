import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { IoArrowForwardOutline } from "react-icons/io5"

type BenefitCardProps = {
    title: string
    description: string
    imageSrc?: string
    imageAlt?: string
    href?: string
    className?: string
    buttonTitle: string
}

export default function BenefitCard({
    title,
    description,
    imageSrc,
    imageAlt = title,
    href = "#",
    className,
    buttonTitle
}: BenefitCardProps) {
    return (
        <Card
            className={cn(
                "overflow-hidden rounded border bg-card text-card-foreground transition-shadow shadow-[0_18.54px_21.4px_0_rgba(0,0,0,0.05)] hover:shadow-[0_22px_26px_0_rgba(0,0,0,0.08)]",
                className
            )}
        >
            {imageSrc &&
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="block w-full aspect-[16/9] object-cover"
                    loading="lazy"
                />
            }

            <CardContent className="p-6">
                <h3 className="text-2xl font-semibold tracking-tight mb-3">{title}</h3>
                <p className="text-base leading-7 text-foreground/80">{description}</p>

                <div className="mt-5">
                    <Link
                        to={href}
                        className="inline-flex items-center gap-2 font-semibold group"
                        aria-label={`${title} - Selengkapnya`}
                    >
                        <span>{buttonTitle}</span>
                        <IoArrowForwardOutline
                            aria-hidden
                            className="text-[#E30613] text-[20px] shrink-0 transition-transform group-hover:translate-x-0.5"
                        />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
