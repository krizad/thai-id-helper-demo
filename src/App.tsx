import { useState, useEffect } from "react";
import { validateThaiID, formatThaiID, maskThaiID, generateMockThaiID, extractThaiIDInfo, type ThaiIDInfo } from "@krizad/thai-id-helper";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [formattedID, setFormattedID] = useState("");
  const [maskedID, setMaskedID] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [info, setInfo] = useState<ThaiIDInfo | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  useEffect(() => {
    // Clean input for evaluation
    const cleanInput = inputValue.replace(/-/g, "").trim();

    if (cleanInput.length > 0) {
      setFormattedID(formatThaiID(inputValue));
      setMaskedID(maskThaiID(inputValue));

      if (cleanInput.length === 13) {
        setIsValid(validateThaiID(cleanInput));
        setInfo(extractThaiIDInfo(cleanInput));
      } else {
        setIsValid(null);
        setInfo(null);
      }
    } else {
      setFormattedID("");
      setMaskedID("");
      setIsValid(null);
      setInfo(null);
    }
  }, [inputValue]);

  const handleGenerateMock = () => {
    const mockId = generateMockThaiID();
    setInputValue(mockId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow only digits and hyphens
    if (!/^[\d-]*$/.test(val)) return;

    const cleanVal = val.replace(/-/g, "");
    if (cleanVal.length <= 13) {
      setInputValue(val);
    } else {
      // Truncate if pasted more than 13 digits
      setInputValue(cleanVal.slice(0, 13));
    }
  };

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <div className="app-container">
      <header>
        <h1>Thai ID Kit</h1>
        <p className="subtitle">The complete utility kit for Thai National ID cards</p>
      </header>

      <main>
        {/* Interactive Playground Section */}
        <section className="glass-panel">
          <h2 className="section-title">
            <span>✨</span> Interactive Playground
          </h2>

          <div className="input-group">
            <input type="text" className="input-field" placeholder="Enter 13-digit Thai ID..." value={inputValue} onChange={handleInputChange} maxLength={17} />
            <button className="btn" onClick={handleGenerateMock}>
              🎲 Generate Valid ID
            </button>
            <button className="btn btn-secondary" onClick={() => handleCopy(inputValue, "raw")} disabled={!inputValue}>
              {copiedType === "raw" ? "✓ Copied" : "📋 Copy"}
            </button>
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </div>

          {isValid !== null && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div className={`status-badge ${isValid ? "status-valid" : "status-invalid"}`}>{isValid ? "✓ Valid Thai ID" : "✗ Invalid Thai ID"}</div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            <div>
              <div className="info-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Formatted Output</span>
                {formattedID && (
                  <button className="copy-btn" onClick={() => handleCopy(formattedID, "formatted")} title="Copy to clipboard">
                    {copiedType === "formatted" ? "✓ Copied" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div className="result-box">{formattedID || <span style={{ color: "var(--text-muted)" }}>Waiting for input...</span>}</div>
            </div>

            <div>
              <div className="info-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>PDPA Masked Output</span>
                {maskedID && (
                  <button className="copy-btn" onClick={() => handleCopy(maskedID, "masked")} title="Copy to clipboard">
                    {copiedType === "masked" ? "✓ Copied" : "📋 Copy"}
                  </button>
                )}
              </div>
              <div className="result-box">{maskedID || <span style={{ color: "var(--text-muted)" }}>Waiting for input...</span>}</div>
            </div>
          </div>

          {info && info.isValid && (
            <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Extracted Information</h3>
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-label">Person Type (ประเภทบุคคล)</div>
                  <div className="info-value">{info.personType}</div>
                </div>
                <div className="info-card">
                  <div className="info-label">Province Code (รหัสจังหวัด)</div>
                  <div className="info-value">{info.provinceCode}</div>
                </div>
                <div className="info-card">
                  <div className="info-label">District Code (รหัสอำเภอ)</div>
                  <div className="info-value">{info.districtCode}</div>
                </div>
                <div className="info-card">
                  <div className="info-label">Group/Book No (กลุ่ม/เล่มที่)</div>
                  <div className="info-value">{info.birthCertificateBookNo}</div>
                </div>
                <div className="info-card">
                  <div className="info-label">Sequence (ลำดับที่)</div>
                  <div className="info-value">{info.sequenceNo}</div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Documentation Sections */}
        <section className="glass-panel">
          <h2 className="section-title">
            <span>🛡️</span> Validation
          </h2>
          <p>Easily check if a string is a valid Thai National ID, according to the official mathematical formula (Modulus 11).</p>

          <div className="code-snippet">
            <pre>
              <span className="code-keyword">import</span> {"{\n"}
              {"  "}
              <span className="code-function">validateThaiID</span>
              {"\n"}
              {"}"} <span className="code-keyword">from</span> <span className="code-string">'@krizad/thai-id-helper'</span>;{"\n"}
              {"\n"}
              <span className="code-keyword">const</span> isValid = <span className="code-function">validateThaiID</span>(<span className="code-string">'1100100123456'</span>);{"\n"}
              <span className="code-keyword">console</span>.<span className="code-function">log</span>(isValid); <span className="code-comment">// true</span>
            </pre>
          </div>
        </section>

        <section className="glass-panel">
          <h2 className="section-title">
            <span>📝</span> Formatting
          </h2>
          <p>Format a 13-digit Thai ID into the standard readable pattern (X-XXXX-XXXXX-XX-X).</p>

          <div className="code-snippet">
            <pre>
              <span className="code-keyword">import</span> {"{\n"}
              {"  "}
              <span className="code-function">formatThaiID</span>
              {"\n"}
              {"}"} <span className="code-keyword">from</span> <span className="code-string">'@krizad/thai-id-helper'</span>;{"\n"}
              {"\n"}
              <span className="code-keyword">const</span> formatted = <span className="code-function">formatThaiID</span>(<span className="code-string">'1100100123456'</span>);{"\n"}
              <span className="code-keyword">console</span>.<span className="code-function">log</span>(formatted); <span className="code-comment">// '1-1001-00123-45-6'</span>
            </pre>
          </div>
        </section>

        <section className="glass-panel">
          <h2 className="section-title">
            <span>🔒</span> PDPA Masking
          </h2>
          <p>Mask sensitive digits for privacy and compliance with Thailand's Personal Data Protection Act (PDPA).</p>

          <div className="code-snippet">
            <pre>
              <span className="code-keyword">import</span> {"{\n"}
              {"  "}
              <span className="code-function">maskThaiID</span>
              {"\n"}
              {"}"} <span className="code-keyword">from</span> <span className="code-string">'@krizad/thai-id-helper'</span>;{"\n"}
              {"\n"}
              <span className="code-keyword">const</span> masked = <span className="code-function">maskThaiID</span>(<span className="code-string">'1100100123456'</span>);{"\n"}
              <span className="code-keyword">console</span>.<span className="code-function">log</span>(masked); <span className="code-comment">// '1-1001-XXXXX-XX-6'</span>
            </pre>
          </div>
        </section>

        <section className="glass-panel">
          <h2 className="section-title">
            <span>📊</span> Information Extraction
          </h2>
          <p>Extract meaningful data out of a valid 13-digit Thai ID.</p>

          <div className="code-snippet">
            <pre>
              <span className="code-keyword">import</span> {"{\n"}
              {"  "}
              <span className="code-function">extractThaiIDInfo</span>
              {"\n"}
              {"}"} <span className="code-keyword">from</span> <span className="code-string">'@krizad/thai-id-helper'</span>;{"\n"}
              {"\n"}
              <span className="code-keyword">const</span> info = <span className="code-function">extractThaiIDInfo</span>(<span className="code-string">'1100100123456'</span>);{"\n"}
              <span className="code-keyword">console</span>.<span className="code-function">log</span>(info.provinceCode); <span className="code-comment">// '10'</span>
              {"\n"}
              <span className="code-keyword">console</span>.<span className="code-function">log</span>(info.personType); <span className="code-comment">// 'คนที่เกิดและมีสัญชาติเป็นคนไทย...'</span>
            </pre>
          </div>
        </section>
      </main>

      <footer>
        <p>
          Built with ❤️ by{" "}
          <a href="https://github.com/krizad" target="_blank" rel="noopener noreferrer">
            KriZad
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
