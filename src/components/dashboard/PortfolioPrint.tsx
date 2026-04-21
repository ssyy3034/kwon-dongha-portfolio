"use client";

import { useProfile } from "@/context/ProfileContext";
import projects from "@/config/projects.json";
import { getProjectDetail } from "@/data/project-details";
import FormattedText from "@/components/common/FormattedText";
import Mermaid from "@/components/common/Mermaid";

/* ── 색상 시스템 ── */
const C = {
  text: "#111827",       // gray-900
  sub: "#6B7280",        // gray-500
  light: "#9CA3AF",      // gray-400
  border: "#E5E7EB",     // gray-200
  bg: "#F9FAFB",         // gray-50
  red: "#DC2626",
  blue: "#2563EB",
  green: "#059669",
  accent: "#D97706",     // amber-600
};

/* ── 트러블슈팅 카드 ── */
function TroubleCard({ section }: { section: any }) {
  return (
    <div style={{ marginBottom: "22px", pageBreakInside: "avoid" }}>
      {/* 제목 */}
      <div
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: C.text,
          borderBottom: `1.5px solid ${C.text}`,
          paddingBottom: "5px",
          marginBottom: "12px",
          lineHeight: 1.3,
          letterSpacing: "-0.015em",
        }}
      >
        {section.title}
        {section.impact && (
          <div style={{ fontSize: "11px", color: C.accent, fontWeight: 600, marginTop: "4px", letterSpacing: 0 }}>
            {section.impact}
          </div>
        )}
      </div>

      {/* Problem / Approach / Result — 좌측 컬러 바 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "11px" }}>
        {/* Problem */}
        <div style={{ display: "flex", gap: "0" }}>
          <div style={{ width: "3px", borderRadius: "2px", backgroundColor: C.red, flexShrink: 0 }} />
          <div style={{ paddingLeft: "12px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.red, marginBottom: "4px", letterSpacing: "0.08em" }}>
              PROBLEM
            </div>
            <div style={{ fontSize: "11.5px", color: "#374151", lineHeight: 1.65 }}>
              <FormattedText noDark text={section.problem || ""} />
            </div>
          </div>
        </div>

        {/* Approach */}
        <div style={{ display: "flex", gap: "0" }}>
          <div style={{ width: "3px", borderRadius: "2px", backgroundColor: C.blue, flexShrink: 0 }} />
          <div style={{ paddingLeft: "12px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.blue, marginBottom: "4px", letterSpacing: "0.08em" }}>
              APPROACH
            </div>
            <div style={{ fontSize: "11.5px", color: "#374151", lineHeight: 1.65 }}>
              <FormattedText noDark text={section.approach || ""} />
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{ display: "flex", gap: "0" }}>
          <div style={{ width: "3px", borderRadius: "2px", backgroundColor: C.green, flexShrink: 0 }} />
          <div style={{ paddingLeft: "12px", flex: 1 }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: C.green, marginBottom: "4px", letterSpacing: "0.08em" }}>
              RESULT
            </div>
            <div style={{ fontSize: "11.5px", color: C.text, lineHeight: 1.65, fontWeight: 600 }}>
              <FormattedText noDark text={section.result || ""} />
            </div>
          </div>
        </div>
      </div>

      {/* Diagram — 섹션 하단, 본문과 충분한 간격 + 분할 방지 */}
      {section.diagram && (
        <div
          style={{
            marginTop: "14px",
            padding: "10px 12px",
            backgroundColor: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: "6px",
            pageBreakInside: "avoid",
            breakInside: "avoid",
          }}
        >
          {section.diagram.type === "mermaid" ? (
            <div style={{ textAlign: "center" }}>
              <Mermaid chart={section.diagram.content} />
            </div>
          ) : section.diagram.type === "svg" || section.diagram.type === "image" ? (
            <div style={{ textAlign: "center" }}>
              {section.diagram.content.startsWith("/") ? (
                <img
                  src={section.diagram.content}
                  alt={section.diagram.caption || "Diagram"}
                  style={{ width: "100%", maxHeight: "12cm", objectFit: "contain", display: "block", margin: "0 auto" }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: section.diagram.content }} />
              )}
            </div>
          ) : null}
          {section.diagram.caption && (
            <div style={{ fontSize: "9.5px", color: C.sub, textAlign: "center", marginTop: "6px", fontStyle: "italic", lineHeight: 1.4 }}>
              {section.diagram.caption}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── 메인 컴포넌트 ── */
export default function PortfolioPrint() {
  const { profile } = useProfile();

  return (
    <div className="print-portfolio" style={{ backgroundColor: "#fff", color: C.text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ====== PAGE 1: 프로필 ====== */}
      <section style={{ paddingBottom: "16px" }}>
        {/* 상단: 사진 + 이름/역할/소개 */}
        <div style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          marginBottom: "20px",
        }}>
          {/* 프로필 사진 */}
          <img
            src="/images/me.jpg"
            alt={profile.name}
            style={{
              width: "120px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              flexShrink: 0,
            }}
          />
          {/* 이름 + 역할 + 한줄 소개 */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "10px" }}>
              <div style={{
                fontSize: "36px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                color: C.text,
              }}>
                {profile.name}
              </div>
              <div style={{
                fontSize: "11px",
                fontWeight: 700,
                color: C.sub,
                letterSpacing: "0.12em",
                textTransform: "uppercase" as const,
              }}>
                Backend Developer
              </div>
            </div>
            <div style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#374151",
              lineHeight: 1.45,
            }}>
              {profile.bio.headline.replace("{name}", profile.name)}
            </div>
          </div>
        </div>

        {/* Contact & Channels */}
        <div style={{
          marginBottom: "22px",
          paddingBottom: "18px",
          borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: C.sub, marginBottom: "10px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Contact &amp; Channels
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "Email", value: profile.social.email },
              { label: "Github", value: profile.social.github },
              { label: "Blog", value: (profile.social as any).blog || "https://velog.io/@ansqhrl3037" },
              { label: "Portfolio", value: "https://www.ssyy3034.dev/" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", fontSize: "11.5px" }}>
                <span style={{ color: C.text, fontWeight: 700, minWidth: "72px" }}>
                  •  {item.label}
                </span>
                <span style={{ color: C.light, margin: "0 10px" }}>|</span>
                <span style={{ color: C.sub }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 자기소개 — paragraphs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {profile.bio.paragraphs?.map((para, idx) => (
            <div
              key={idx}
              style={{
                padding: "12px 16px",
                border: `1px solid ${C.border}`,
                borderRadius: "6px",
                borderLeft: `3px solid ${["#3c78d8", "#f6b800", "#00a388"][idx] || C.sub}`,
              }}
            >
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
                {para.slogan}
              </div>
              <div style={{ fontSize: "11.5px", color: "#374151", lineHeight: 1.65 }}>
                {para.points.map((p, i) => (
                  <div key={i} style={{ marginBottom: i < para.points.length - 1 ? "4px" : 0 }}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== PROJECT PAGES ====== */}
      {projects.map((project) => {
        const detail = getProjectDetail(project.id);
        if (!detail) return null;

        return (
          <div key={project.id} style={{ breakBefore: "page" }}>

            {/* 프로젝트 헤더 */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: `2px solid ${C.text}`,
              paddingBottom: "8px",
              marginBottom: "14px",
            }}>
              <div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  margin: 0,
                  color: C.text,
                }}>
                  {project.title}
                </div>
                <p style={{ fontSize: "11px", color: C.sub, marginTop: "6px", lineHeight: 1.4 }}>
                  {project.subtitle}
                </p>
              </div>
              <div style={{ textAlign: "right", fontSize: "10.5px", color: C.sub, lineHeight: 1.5 }}>
                <div>{project.period}</div>
                <div>{project.role} · {project.team}</div>
              </div>
            </div>

            {/* 프로젝트 설명 */}
            <div style={{
              padding: "12px 14px",
              backgroundColor: C.bg,
              borderRadius: "6px",
              border: `1px solid ${C.border}`,
              marginBottom: "14px",
            }}>
              <div style={{ fontSize: "12.5px", fontWeight: 700, color: C.text, lineHeight: 1.5, marginBottom: "8px" }}>
                <FormattedText noDark text={detail.tagline} />
              </div>
              <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.65 }}>
                <FormattedText noDark text={detail.overview} />
              </div>
            </div>

            {/* Architecture */}
            {(detail.architectureImage || detail.architectureDiagram) && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                  borderRadius: "6px",
                  backgroundColor: "#fff",
                  pageBreakInside: "avoid",
                  breakInside: "avoid",
                }}
              >
                <div style={{ fontSize: "10px", fontWeight: 700, color: C.sub, letterSpacing: "0.1em", marginBottom: "8px", textTransform: "uppercase" }}>
                  Architecture
                </div>
                <div style={{ textAlign: "center" }}>
                  {detail.architectureDiagram?.type === "mermaid" ? (
                    <Mermaid chart={detail.architectureDiagram.content} />
                  ) : detail.architectureDiagram?.type === "svg" ? (
                    detail.architectureDiagram.content.startsWith("/") ? (
                      <img
                        src={detail.architectureDiagram.content}
                        alt="Project Architecture"
                        style={{ width: "100%", maxHeight: "13cm", objectFit: "contain", display: "block", margin: "0 auto" }}
                      />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: detail.architectureDiagram.content }} />
                    )
                  ) : detail.architectureImage ? (
                    <img
                      src={detail.architectureImage}
                      alt="Project Architecture"
                      style={{ width: "100%", maxHeight: "13cm", objectFit: "contain", display: "block", margin: "0 auto" }}
                    />
                  ) : null}
                </div>
                {detail.architectureCaption && (
                  <div style={{ fontSize: "9.5px", color: C.sub, textAlign: "center", marginTop: "6px", fontStyle: "italic" }}>
                    {detail.architectureCaption}
                  </div>
                )}
              </div>
            )}

            {/* Achievements */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `repeat(${detail.achievements.length}, 1fr)`,
              gap: "10px",
              marginBottom: "22px",
            }}>
              {detail.achievements.map((a, idx) => (
                <div
                  key={idx}
                  style={{
                    textAlign: "center",
                    padding: "10px 8px",
                    border: `1px solid ${C.border}`,
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ fontSize: "18px", fontWeight: 900, color: C.accent, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    {a.metric}
                  </div>
                  <div style={{ fontSize: "9.5px", color: C.sub, marginTop: "4px", letterSpacing: "0.03em", lineHeight: 1.35 }}>
                    {a.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Backend */}
            {detail.sections.backend && detail.sections.backend.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: C.text,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "-0.015em",
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: C.text,
                  }} />
                  Backend
                </div>
                {detail.sections.backend.map((section, idx) => (
                  <TroubleCard key={idx} section={section} />
                ))}
              </div>
            )}

            {/* Frontend */}
            {detail.sections.frontend && detail.sections.frontend.length > 0 && (
              <div style={{ breakBefore: "page" }}>
                <div style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: C.text,
                  paddingBottom: "6px",
                  marginBottom: "16px",
                  borderBottom: `1px solid ${C.border}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "-0.015em",
                }}>
                  <span style={{
                    display: "inline-block",
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: C.text,
                  }} />
                  Frontend
                </div>
                {detail.sections.frontend.map((section, idx) => (
                  <TroubleCard key={idx} section={section} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
