"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [hasContent, setHasContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      setSummaryText(data.summary);
      setHasContent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const charCount = inputText.length;
  const wordCount =
    inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div className="masthead">
            <p className="masthead-label">AI-Powered Intelligence</p>
            <h1 className="masthead-title">
              Dialogue<span>Summarizer</span>
            </h1>
          </div>
        </div>
      </header>

      <hr className="rule-double" style={{ margin: "0 24px" }} />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 24px",
          borderBottom: "1px solid var(--border-color)",
          maxWidth: "860px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <span className="col-label">Input</span>
        <span className="col-label" style={{ color: "var(--accent-red)" }}>
          ✦ Live Editor
        </span>
        <span className="col-label">Output</span>
      </div>

      <main
        style={{
          flex: 1,
          maxWidth: "860px",
          margin: "0 auto",
          width: "100%",
          padding: "32px 24px 40px",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingBottom: "10px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <h2 className="section-head">Paste Your Dialogue</h2>
          </div>

          <textarea
            id="dialogue-input"
            className="input-textarea"
            placeholder={`Paste or type any dialogue or conversation here…\n\nExample:\nAlice: Did you finish the report?\nBob: Yes, I sent it over this morning.\nAlice: Great, I'll review it before noon.`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            aria-label="Dialogue to summarize"
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "8px",
            }}
          >
            <p className="char-counter">
              {wordCount.toLocaleString()} words &nbsp;·&nbsp;{" "}
              {charCount.toLocaleString()} characters
            </p>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "16px 0",
            borderTop: "1px solid var(--border-color)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <button
            id="summarize-btn"
            className="btn-summarize"
            onClick={handleSummarize}
            disabled={!inputText.trim() || isLoading}
            style={{
              opacity: inputText.trim() && !isLoading ? 1 : 0.45,
              cursor: inputText.trim() && !isLoading ? "pointer" : "not-allowed",
            }}
            aria-label="Summarize the dialogue"
          >
            {/* Lightning bolt / spinner icon */}
            <svg
              className="btn-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={isLoading ? { animation: "spin 0.8s linear infinite" } : {}}
            >
              {isLoading ? (
                <>
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </>
              ) : (
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              )}
            </svg>
            {isLoading ? "Analyzing…" : "Summarize"}
          </button>

          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
          >
            {inputText.trim()
              ? `Ready to condense ${wordCount.toLocaleString()} words into key insights.`
              : "Paste a dialogue above to enable summarization."}
          </p>
        </div>

        <section>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              marginBottom: "12px",
              paddingBottom: "10px",
              borderBottom: "1px solid var(--border-color)",
            }}
          >
            <h2 className="section-head">Summary</h2>
            <span className="col-label" style={{ fontSize: "9px" }}>
              AI-Generated · Concise · Accurate
            </span>
          </div>

          <div
            id="summary-output"
            className={`output-box ${hasContent ? "has-content" : ""}`}
            role="region"
            aria-label="Summary output"
            aria-live="polite"
          >
            {hasContent && <div className="output-accent-bar" />}

            <div className="output-box-header">
              <span className="output-box-label">Output</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {hasContent && summaryText && (
                  <button
                    id="copy-btn"
                    onClick={handleCopy}
                    aria-label="Copy summary to clipboard"
                    title="Copy to clipboard"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      background: copied
                        ? "rgba(74, 222, 128, 0.15)"
                        : "rgba(255,255,255,0.06)",
                      border: copied
                        ? "1px solid rgba(74, 222, 128, 0.5)"
                        : "1px solid var(--border-color)",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono, monospace)",
                      color: copied ? "rgb(74, 222, 128)" : "var(--text-muted)",
                      letterSpacing: "0.04em",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {copied ? (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                )}
                <div className={`output-dot ${hasContent ? "active" : ""}`} />
              </div>
            </div>

            <div className="output-body">
              {isLoading ? (
                <div className="skeleton-wrap">
                  <div className="skeleton-line" style={{ width: "92%" }} />
                  <div className="skeleton-line" style={{ width: "78%" }} />
                  <div className="skeleton-line" style={{ width: "85%" }} />
                  <div className="skeleton-line" style={{ width: "60%" }} />
                  <div
                    style={{
                      marginTop: "18px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div className="dot-pulse">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontStyle: "italic",
                        letterSpacing: "0.05em",
                      }}
                    >
                      AI is reading the dialogue…
                    </span>
                  </div>
                </div>
              ) : hasContent && summaryText ? (
                <p className="output-text animate-in">{summaryText}</p>
              ) : (
                <div className="output-placeholder">
                  <span className="output-placeholder-icon">💬</span>
                  <p className="output-placeholder-text">
                    Your summary will appear here.
                    <br />
                    Paste a dialogue above and press{" "}
                    <strong style={{ color: "var(--text-secondary)" }}>
                      Summarize
                    </strong>
                    .
                  </p>
                </div>
              )}
            </div>
          </div>

          {hasContent && summaryText && (
            <div
              className="stats-strip animate-in"
              style={{ marginTop: "16px" }}
            >
              <div className="stat-item">
                <div className="stat-value">
                  {summaryText.trim().split(/\s+/).length}
                </div>
                <div className="stat-label">Words</div>
              </div>

              <div className="stat-item">
                <div className="stat-value">
                  {wordCount > 0
                    ? Math.round(
                        (1 -
                          summaryText.trim().split(/\s+/).length / wordCount) *
                          100,
                      )
                    : 0}
                  %
                </div>
                <div className="stat-label">Reduced</div>
              </div>

              <div className="stat-item">
                <div className="stat-value">
                  ~{Math.ceil(summaryText.trim().split(/\s+/).length / 200)}m
                </div>
                <div className="stat-label">Read Time</div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer style={{ padding: "0 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div className="page-footer">
            <span className="footer-brand">
              Dialogue<span>Summarizer</span>
            </span>
            <span className="footer-note">
              AI Dialogue Summarization Engine
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
