import { useTArray } from "@/helper/useTArray";
import { useTranslation } from "react-i18next";
import DocsBody from "./docs-body";

export type DocKey =
  | "product_desc"
  | "exceptional_benefit"
  | "snk"
  | "applied_claim_document";

export interface TableRow {
  jenis: string;
  dokumen: string[];
}

export interface ClaimDocumentItem {
  text: string;
  table?: TableRow[];
}

function highlightPRU(text: string) : React.ReactNode {
  const items = text.split(/(PRU)/g);
  return items.map((part, index) =>
    part === "PRU" ? (
      <span key={index} className="text-red-600 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
}

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
      key: "exceptional_benefit",
      label: t("form.exceptional_benefit"),
      render: () => {
        const items = tArr<string>("docs.exceptional_benefit.items");
        return (
          <div className="space-y-3 text-sm leading-6">
            <p>{highlightPRU(t("docs.exceptional_benefit.lead"))}</p>
            <ol className="list-decimal ml-5 space-y-2">
              {items?.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ol>
            <p>{highlightPRU(t("docs.exceptional_benefit.information"))}</p>
          </div>
        );
      },
    },
    {
      key: "snk",
      label: t("form.snk"),
      render: () => {
        const terms = tArr<string>("docs.snk.items");
        return (
          <div className="space-y-3 text-sm leading-6">
            <ol className="list-disc ml-5 space-y-2">
              {terms?.map((it, i) => (
                <li key={i}>{highlightPRU(it)}</li>
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
        const claimItems = tArr<ClaimDocumentItem>("docs.applied_claim_document.items");
        return (
          <div className="space-y-4 text-sm leading-6">
            <section className="space-y-2">
              <ol className="list-decimal ml-6 space-y-2">
                {claimItems.map((it, index) => (
                  <li key={index}>
                    <p>{it.text}</p>
                    {it.table && (
                      <table className="table-auto border-collapse border w-full mt-4">
                        <thead>
                          <tr className="bg-gray-400">
                            <th className="text-white border p-2 w-1/3">{t("docs.applied_claim_document.thead1")}</th>
                            <th className="text-white border p-2">{t("docs.applied_claim_document.thead2")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {it.table.map((row, idx) => (
                            <tr key={idx}>
                              <td className="border p-4 align-top">{row.jenis}</td>
                              <td className="border p-4">
                                <ol className="list-[lower-alpha] pl-4 space-y-2">
                                  {row.dokumen.map((doc, i) =><li key={i}>{doc}</li>)}
                                </ol>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          </div>
        );
      },
    },
  ];

  return items;
}
