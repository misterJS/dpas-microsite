import React from "react";
import { marked } from "marked";

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const html = marked(content || "", { breaks: true })
    return (
        <div
            className="prose max-w-none text-[13px] text-[#4B4B4B] mt-2"
            dangerouslySetInnerHTML={{ __html: html}}
        />

    )
}

export default MarkdownRenderer;