import { useTArray } from "@/helper/useTArray";
import { useTranslation } from "react-i18next";
import DocsBody from "./docs-body";

export type DocKey =
  | "product_desc"
  | "exceptional_protect"
  | "snk"
  | "applied_claim_document";

export function useDocItems() {
  const { t } = useTranslation("common");
  const tArr = useTArray(useTranslation("common"));

  const items: Array<{
    key: DocKey;
    label: string;
    render: () => React.ReactNode;
    description?: string;
  }> = [
    {
      key: "product_desc",
      label: t("docs.product_desc.title"),
      render: () => {
        return <DocsBody />;
      },
    },
    {
      key: "exceptional_protect",
      label: t("form.exceptional_protect"),
      render: () => {
        const items = tArr<string>("docs.exceptional_protect.items");
        return (
          <div className="space-y-3 text-sm leading-6">
            <p>{t("docs.exceptional_protect.lead")}</p>
            <ol className="list-decimal ml-5 space-y-2">
              {items?.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
          </div>
        );
      },
    },
    {
      key: "snk",
      label: t("form.snk"),
      render: () => {
        const steps = tArr<string>("docs.snk.how.steps");
        const terms = tArr<string>("docs.snk.terms.items");
        return (
          <div className="space-y-3 text-sm leading-6">
            <h4 className="font-medium">{t("docs.snk.how.title")}</h4>
            <ol className="list-decimal ml-5 space-y-2">
              {steps?.map((s, i) => {
                const subItem = s.split('\n');
                const mainText = subItem[0];
                const hasSubItem = subItem.length > 1;
                return (
                  <li key={i}>
                    {mainText}
                    {hasSubItem && (
                      <ul>
                        {subItem.slice(1).map((sub, subI) => <li key={subI}>{sub}</li>)}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ol>
            <h4 className="font-medium mt-3">{t("docs.snk.terms.title")}</h4>
            <ol className="list-decimal ml-5 space-y-2">
              {terms?.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        );
      },
    },
    {
      key: "applied_claim_document",
      label: t("form.applied_claim_document"),
      render: () => {
        const disItems = tArr<string>(
          "docs.applied_claim_document.disability.items"
        );
        const deathItems = tArr<string>(
          "docs.applied_claim_document.death.items"
        );
        return (
          <div className="space-y-4 text-sm leading-6">
            <section className="space-y-2">
              <p className="font-medium">
                {t("docs.applied_claim_document.disability.title")}
              </p>
              <ol className="list-decimal ml-5 space-y-2">
                {disItems?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </section>

            <section className="space-y-2">
              <p className="font-medium">
                {t("docs.applied_claim_document.death.title")}
              </p>
              <ol className="list-decimal ml-5 space-y-2">
                {deathItems?.map((s, i) => {
                  const subItem = s.split('\n');
                  const mainText = subItem[0];
                  const hasSubItem = subItem.length > 1;
                  return (
                    <li key={i}>
                      {mainText}
                      {hasSubItem && (
                        <ul>
                          {subItem.slice(1).map((sub, subI)=> <li key={subI}>{sub}</li>)}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>
        );
      },
    },
  ];

  return items;
}
