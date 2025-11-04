import React, { useMemo } from "react";
import { marked } from "marked";
import DOMpurify from "dompurify";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const cleanHtml = useMemo(() => {
        content = content.replace(/\n/g, '<br>');
        const rawHtml = marked(content || "", { breaks: true }) as string;

        return DOMpurify.sanitize(rawHtml);
    }, [content])

    return (
        <div
            className="prose max-w-none text-[13px] text-[#4B4B4B] mt-2 consent-body"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />

    )
}

export default MarkdownRenderer;