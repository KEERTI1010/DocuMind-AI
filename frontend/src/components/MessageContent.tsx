import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Share2, ThumbsUp, ThumbsDown, RotateCcw, Check } from "lucide-react";
import { useState, useCallback } from "react";

function markdownToPlainText(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        if (codeBlockContent.length > 0) {
          output.push("");
          output.push(...codeBlockContent);
          output.push("");
        }
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (trimmed === "") {
      if (output.length > 0 && output[output.length - 1] !== "") {
        output.push("");
      }
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
      if (output.length > 0 && output[output.length - 1] !== "") {
        output.push("");
      }
      output.push(headingText);
      if (level <= 2) output.push("");
      continue;
    }

    const bulletMatch = trimmed.match(/^[\s]*[-*+]\s+(.*)$/);
    if (bulletMatch) {
      let bulletText = bulletMatch[1];
      bulletText = convertInlineMarkdown(bulletText);
      output.push("• " + bulletText);
      continue;
    }

    const numberedMatch = trimmed.match(/^[\s]*(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      let numText = numberedMatch[2];
      numText = convertInlineMarkdown(numText);
      output.push(numberedMatch[1] + ". " + numText);
      continue;
    }

    const blockquoteMatch = trimmed.match(/^>\s+(.*)$/);
    if (blockquoteMatch) {
      let quoteText = blockquoteMatch[1];
      quoteText = convertInlineMarkdown(quoteText);
      output.push("> " + quoteText);
      continue;
    }

    let processedLine = convertInlineMarkdown(line);
    if (output.length > 0 && output[output.length - 1] !== "") {
      output.push(processedLine);
    } else {
      output.push(processedLine);
    }
  }

  let result = output.join("\n");
  result = result.replace(/\n{3,}/g, "\n\n");
  return result.trim();
}

function convertInlineMarkdown(text: string): string {
  let result = text;

  result = result
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1");

  result = result
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, math) => math.trim())
    .replace(/\$([^$\n]+)\$/g, (_, math) => math.trim());

  const latexMap: Record<string, string> = {
    "\\cdot": "·",
    "\\times": "×",
    "\\div": "÷",
    "\\pm": "±",
    "\\mp": "∓",
    "\\leq": "≤",
    "\\geq": "≥",
    "\\neq": "≠",
    "\\approx": "≈",
    "\\equiv": "≡",
    "\\infty": "∞",
    "\\sqrt": "√",
    "\\sum": "Σ",
    "\\prod": "Π",
    "\\int": "∫",
    "\\partial": "∂",
    "\\nabla": "∇",
    "\\alpha": "α",
    "\\beta": "β",
    "\\gamma": "γ",
    "\\delta": "δ",
    "\\epsilon": "ε",
    "\\varepsilon": "ε",
    "\\zeta": "ζ",
    "\\eta": "η",
    "\\theta": "θ",
    "\\vartheta": "ϑ",
    "\\iota": "ι",
    "\\kappa": "κ",
    "\\lambda": "λ",
    "\\mu": "μ",
    "\\nu": "ν",
    "\\xi": "ξ",
    "\\pi": "π",
    "\\varpi": "ϖ",
    "\\rho": "ρ",
    "\\varrho": "ϱ",
    "\\sigma": "σ",
    "\\varsigma": "ς",
    "\\tau": "τ",
    "\\upsilon": "υ",
    "\\phi": "φ",
    "\\varphi": "ϕ",
    "\\chi": "χ",
    "\\psi": "ψ",
    "\\omega": "ω",
    "\\Gamma": "Γ",
    "\\Delta": "Δ",
    "\\Theta": "Θ",
    "\\Lambda": "Λ",
    "\\Xi": "Ξ",
    "\\Pi": "Π",
    "\\Sigma": "Σ",
    "\\Upsilon": "Υ",
    "\\Phi": "Φ",
    "\\Psi": "Ψ",
    "\\Omega": "Ω",
  };

  for (const [latex, unicode] of Object.entries(latexMap)) {
    result = result.replace(new RegExp(latex.replace(/\\/g, "\\\\"), "g"), unicode);
  }

  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)");
  result = result.replace(/\\sqrt\{([^}]+)\}/g, "√($1)");

  result = result.replace(/\^\{?([^}]+)\}?/g, (_, sup) => {
    const supMap: Record<string, string> = {
      "2": "²", "3": "³", "1": "¹", "0": "⁰",
      "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
      "n": "ⁿ", "i": "ⁱ", "j": "ʲ", "k": "ᵏ", "l": "ˡ", "m": "ᵐ",
      "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    };
    return sup.split("").map((c: string) => supMap[c] || c).join("");
  });

  result = result.replace(/_\{?([^}]+)\}?/g, (_, sub) => {
    const subMap: Record<string, string> = {
      "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
      "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
      "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "l": "ₗ", "m": "ₘ",
      "n": "ₙ", "o": "ₒ", "p": "ₚ", "r": "ᵣ", "s": "ₛ",
      "t": "ₜ", "u": "ᵤ", "v": "ᵥ", "x": "ₓ",
      "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    };
    return sub.split("").map((c: string) => subMap[c] || c).join("");
  });

  result = result.replace(/\\left|\\right|\\,|\\;|\\:|\\!|\\quad|\\qquad|\\,/g, "");
  result = result.replace(/[ \t]+/g, " ").trim();

  return result;
}

interface MessageContentProps {
  content: string;
  sources?: Array<{
    documentName: string;
    pageNumber: number | null;
    chunkIndex: number;
  }>;
}

export function MessageContent({ content, sources }: MessageContentProps) {
  return (
    <div className="theme-markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
        h1: ({ children }) => <h1 className="text-lg font-bold theme-text mt-3 mb-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-semibold theme-text mt-3 mb-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-medium theme-text mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="theme-text mb-2">{children}</p>,
        strong: ({ children }) => <strong className="theme-text">{children}</strong>,
        em: ({ children }) => <em className="theme-text">{children}</em>,
        code: ({ children }) => <code className="bg-theme-surface-alt px-1.5 py-0.5 rounded text-sm font-mono theme-text">{children}</code>,
        pre: ({ children }) => <pre className="bg-theme-surface-alt rounded-lg p-3 overflow-x-auto mt-2 mb-2"><code className="text-sm font-mono theme-text">{children}</code></pre>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 theme-text ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 theme-text ml-2">{children}</ol>,
        li: ({ children }) => <li className="theme-text">{children}</li>,
        a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="theme-primary-text underline hover:theme-primary-hover">{children}</a>,
        blockquote: ({ children }) => <blockquote className="border-l-3 border-theme-primary pl-3 italic theme-text-muted my-2">{children}</blockquote>,
      }}>
        {content}
      </ReactMarkdown>
      {sources && sources.length > 0 && (
        <div className="mt-3 border-t theme-border pt-2 text-xs theme-text-muted">
          Sources:{" "}
          {sources.map((s, i) => (
            <span key={i} className="mr-2">
              {s.documentName}
              {s.pageNumber ? ` (p.${s.pageNumber})` : ""} [chunk {s.chunkIndex}]
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface MessageActionsProps {
  messageId: string;
  content: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function MessageActions({ messageId, content, onRegenerate, isRegenerating }: MessageActionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down">>({});

  const handleCopy = useCallback(async () => {
    const plainText = markdownToPlainText(content);
    try {
      if (navigator.clipboard.write) {
        const html = `<div>${plainText.replace(/\n/g, "<br>")}</div>`;
        const blob = new Blob([html], { type: "text/html" });
        const clipboardItem = new ClipboardItem({ "text/html": blob, "text/plain": new Blob([plainText], { type: "text/plain" }) });
        await navigator.clipboard.write([clipboardItem]);
      } else {
        await navigator.clipboard.writeText(plainText);
      }
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      await navigator.clipboard.writeText(plainText);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, [content, messageId]);

  const handleShare = useCallback(async () => {
    const plainText = markdownToPlainText(content);
    try {
      if (navigator.share) {
        await navigator.share({ text: plainText });
      } else {
        await navigator.clipboard.writeText(plainText);
      }
      setSharedId(messageId);
      setTimeout(() => setSharedId(null), 2000);
    } catch {
      setSharedId(messageId);
      setTimeout(() => setSharedId(null), 2000);
    }
  }, [content, messageId]);

  const handleFeedback = useCallback((type: "up" | "down") => {
    setFeedback(prev => ({ ...prev, [messageId]: type }));
  }, [messageId]);

  const isCopied = copiedId === messageId;
  const isShared = sharedId === messageId;
  const currentFeedback = feedback[messageId];

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t theme-border bg-theme-surface-alt/50 rounded-lg px-2 py-1">
      <button
        onClick={handleCopy}
        disabled={isCopied}
        className="p-1.5 rounded hover:bg-theme-surface-alt transition text-theme-text-muted hover:theme-primary-text"
        title="Copy"
        aria-label="Copy"
      >
        {isCopied ? <Check className="h-3.5 w-3.5 theme-success" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={handleShare}
        disabled={isShared}
        className="p-1.5 rounded hover:bg-theme-surface-alt transition text-theme-text-muted hover:theme-primary-text"
        title="Share"
        aria-label="Share"
      >
        {isShared ? <Check className="h-3.5 w-3.5 theme-success" /> : <Share2 className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => handleFeedback("up")}
        className={`p-1.5 rounded transition ${currentFeedback === "up" ? "bg-theme-primary/10 text-theme-primary" : "text-theme-text-muted hover:bg-theme-surface-alt hover:theme-primary-text"}`}
        title="Helpful"
        aria-label="Helpful"
      >
        <ThumbsUp className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => handleFeedback("down")}
        className={`p-1.5 rounded transition ${currentFeedback === "down" ? "bg-theme-danger/10 text-theme-danger" : "text-theme-text-muted hover:bg-theme-surface-alt hover:theme-danger-text"}`}
        title="Not helpful"
        aria-label="Not helpful"
      >
        <ThumbsDown className="h-3.5 w-3.5" />
      </button>
      {onRegenerate && (
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="p-1.5 rounded hover:bg-theme-surface-alt transition text-theme-text-muted hover:theme-primary-text disabled:opacity-50"
          title="Regenerate"
          aria-label="Regenerate"
        >
          {isRegenerating ? (
            <RotateCcw className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RotateCcw className="h-3.5 w-3.5" />
          )}
        </button>
      )}
    </div>
  );
}