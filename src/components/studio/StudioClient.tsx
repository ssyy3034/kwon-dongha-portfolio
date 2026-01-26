"use client";

import { useProfile } from "@/context/ProfileContext";
import { useState, useEffect, useRef } from "react";
import {
  Save,
  Download,
  RotateCcw,
  ChevronRight,
  Settings,
  User,
  Share2,
  Target,
  CheckCircle2,
  Lock,
  Unlock,
  AlertCircle,
  Monitor,
  Smartphone,
  Eye,
  PenTool,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import Nav from "../dashboard/Nav";
import { DashboardData } from "@/lib/graph-loader";

export default function StudioClient({
  initialData,
}: {
  initialData: DashboardData;
}) {
  const { profile, updateProfile, resetProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("identity");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  // Security & Gate State
  const [securityKey, setSecurityKey] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [gatePassword, setGatePassword] = useState("");
  const [gateError, setGateError] = useState(false);

  // Split View Config
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("studio_key");
    if (savedKey) {
      setSecurityKey(savedKey);
      setIsAuthorized(true);
    }
  }, []);

  // Sync profile changes to the preview iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "UPDATE_PROFILE",
          profile,
        },
        "*",
      );
    }
  }, [profile]);

  // Initial data sync when iframe is ready
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === "PREVIEW_READY" &&
        iframeRef.current?.contentWindow
      ) {
        iframeRef.current.contentWindow.postMessage(
          {
            type: "INITIAL_DATA",
            data: initialData,
          },
          "*",
        );
        // Also send current profile immediately
        iframeRef.current.contentWindow.postMessage(
          {
            type: "UPDATE_PROFILE",
            profile,
          },
          "*",
        );
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [initialData, profile]);

  const handleGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gatePassword === "admin123") {
      setIsAuthorized(true);
      setSecurityKey(gatePassword);
      setGateError(false);
    } else {
      setGateError(true);
    }
  };

  const handleSaveToSource = async () => {
    setIsSaving(true);
    setSaveStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-studio-password": securityKey,
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (response.ok) {
        setSaveStatus("success");
        localStorage.setItem("studio_key", securityKey);
      } else {
        setSaveStatus("error");
        setErrorMessage(result.error || "Persistence failed");
      }
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage("Network error occurred");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // Case 1: Unauthorized Gate
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-stone-50 selection:bg-amber-500 selection:text-white">
        <Nav />
        <main className="flex items-center justify-center p-6 min-h-[calc(100vh-80px)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 blur-[120px] rounded-full" />
          </div>
          <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
            <div className="bg-white border border-stone-200 p-10 rounded-[40px] shadow-2xl text-center space-y-8">
              <div className="w-20 h-20 bg-amber-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Lock size={40} className="text-amber-500" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-stone-900 tracking-tighter mb-2 underline decoration-amber-500 decoration-4 underline-offset-4">
                  Studio Gate
                </h1>
                <p className="text-stone-400 text-sm font-medium tracking-tight mt-4">
                  개발자 전용 편집 모드입니다.
                  <br />
                  보안 키를 입력하여 입장하세요.
                </p>
              </div>
              <form onSubmit={handleGateSubmit} className="space-y-4">
                <input
                  type="password"
                  placeholder="Security Key..."
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                  className={`w-full bg-stone-50 border ${gateError ? "border-rose-500" : "border-stone-200"} rounded-2xl px-6 py-4 text-stone-900 font-bold outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-center tracking-[0.3em]`}
                />
                <button
                  type="submit"
                  className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-stone-900/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  Open Identity Studio
                  <ChevronRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen bg-stone-100 flex flex-col font-sans overflow-hidden">
      {/* Studio Header */}
      <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-widest text-stone-900 flex items-center gap-2"
          >
            <div className="w-7 h-7 bg-stone-900 rounded-lg flex items-center justify-center text-[11px] text-white italic">
              PK
            </div>
            Identity Architect
          </Link>
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest ${previewDevice === "desktop" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400"}`}
            >
              <Monitor size={14} /> Wide
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest ${previewDevice === "mobile" ? "bg-white text-stone-900 shadow-sm" : "text-stone-400"}`}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="p-2 text-stone-400 hover:text-stone-900 transition-colors"
            onClick={() => {
              if (iframeRef.current)
                iframeRef.current.src = iframeRef.current.src;
            }}
            title="Reload Preview"
          >
            <RefreshCcw size={16} />
          </button>
          <button
            onClick={resetProfile}
            className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleSaveToSource}
            disabled={isSaving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all shadow-lg ${
              saveStatus === "success"
                ? "bg-emerald-500 text-white"
                : "bg-stone-900 text-white hover:bg-stone-800"
            }`}
          >
            {isSaving ? (
              <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
            ) : saveStatus === "success" ? (
              <CheckCircle2 size={14} />
            ) : (
              <Save size={14} />
            )}
            {saveStatus === "success" ? "Pushed" : "Commit Changes"}
          </button>
        </div>
      </header>

      {/* Main Content Area: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: EDITOR PANEL */}
        <aside className="w-[450px] bg-white border-r border-stone-200 flex flex-col shrink-0">
          <nav className="flex border-b border-stone-100 shadow-sm relative z-10">
            {["identity", "persona", "skills", "connectivity", "manifesto"].map(
              (t, idx) => {
                const tabIds = ["identity", "bio", "skills", "cta", "goals"];
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(tabIds[idx])}
                    className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${
                      activeTab === tabIds[idx]
                        ? "text-stone-900"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    {t}
                    {activeTab === tabIds[idx] && (
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500" />
                    )}
                  </button>
                );
              },
            )}
          </nav>

          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar bg-stone-50/30">
            {activeTab === "identity" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-black text-xl shadow-sm"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Professional Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => updateProfile({ role: e.target.value })}
                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl font-bold text-lg shadow-sm"
                  />
                </div>
              </div>
            )}
            {activeTab === "bio" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Main Badge
                  </label>
                  <input
                    value={profile.bio.badge}
                    onChange={(e) =>
                      updateProfile({
                        bio: { ...profile.bio, badge: e.target.value },
                      })
                    }
                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium shadow-sm"
                  />
                </div>
                {profile.bio.paragraphs.map((p, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white border border-stone-200 rounded-[32px] space-y-4 shadow-sm"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
                      <PenTool size={12} /> Persona Module {i + 1}
                    </label>
                    <textarea
                      value={p.text}
                      rows={4}
                      onChange={(e) => {
                        const newP = [...profile.bio.paragraphs];
                        newP[i].text = e.target.value;
                        updateProfile({
                          bio: { ...profile.bio, paragraphs: newP },
                        });
                      }}
                      className="w-full bg-stone-50/50 p-4 rounded-xl border-none text-sm font-medium leading-relaxed resize-none"
                    />
                    <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                      <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                        Accent Key
                      </span>
                      <input
                        value={p.highlight}
                        onChange={(e) => {
                          const newP = [...profile.bio.paragraphs];
                          newP[i].highlight = e.target.value;
                          updateProfile({
                            bio: { ...profile.bio, paragraphs: newP },
                          });
                        }}
                        className="flex-1 bg-amber-50/50 px-3 py-2 rounded-lg border border-amber-100/50 text-xs font-bold text-amber-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "skills" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-12">
                {profile.skills?.map((category, catIdx) => (
                  <div key={catIdx} className="space-y-6">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                      <input
                        value={category.category}
                        onChange={(e) => {
                          const newSkills = [...profile.skills];
                          newSkills[catIdx].category = e.target.value;
                          updateProfile({ skills: newSkills });
                        }}
                        className="text-xs font-black uppercase tracking-widest text-stone-900 bg-transparent outline-none w-full"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      {category.items.map((skill, skillIdx) => (
                        <div key={skillIdx} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                          <div className="flex gap-3">
                             <div className="flex-1 space-y-1">
                               <label className="text-[9px] font-bold text-stone-400 uppercase">Skill Name</label>
                               <input 
                                 value={skill.name}
                                 onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[catIdx].items[skillIdx].name = e.target.value;
                                    updateProfile({ skills: newSkills });
                                 }}
                                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-bold"
                               />
                             </div>
                             <div className="w-1/3 space-y-1">
                               <label className="text-[9px] font-bold text-stone-400 uppercase">Badge Slug</label>
                               <input 
                                 value={skill.slug}
                                 onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[catIdx].items[skillIdx].slug = e.target.value;
                                    updateProfile({ skills: newSkills });
                                 }}
                                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-500"
                               />
                             </div>
                              <div className="w-20 space-y-1">
                               <label className="text-[9px] font-bold text-stone-400 uppercase">Color</label>
                               <input 
                                 value={skill.color}
                                 onChange={(e) => {
                                    const newSkills = [...profile.skills];
                                    newSkills[catIdx].items[skillIdx].color = e.target.value;
                                    updateProfile({ skills: newSkills });
                                 }}
                                 className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-500"
                               />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <label className="text-[9px] font-bold text-stone-400 uppercase">Fact-Based Description</label>
                             <textarea 
                               rows={2}
                               value={skill.description}
                               onChange={(e) => {
                                  const newSkills = [...profile.skills];
                                  newSkills[catIdx].items[skillIdx].description = e.target.value;
                                  updateProfile({ skills: newSkills });
                               }}
                               className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs leading-relaxed resize-none"
                             />
                          </div>
                           <div className="pt-2 flex justify-end">
                             <button 
                               onClick={() => {
                                 const newSkills = [...profile.skills];
                                 newSkills[catIdx].items = newSkills[catIdx].items.filter((_, i) => i !== skillIdx);
                                 updateProfile({ skills: newSkills });
                               }}
                               className="text-[9px] font-bold text-rose-500 hover:text-rose-700 uppercase"
                             >
                               Remove Skill
                             </button>
                           </div>
                        </div>
                      ))}
                      
                      <button 
                        onClick={() => {
                           const newSkills = [...profile.skills];
                           newSkills[catIdx].items.push({
                             name: "New Skill",
                             slug: "github",
                             color: "000000",
                             description: "Description of your capability..."
                           });
                           updateProfile({ skills: newSkills });
                        }}
                        className="w-full py-3 border-2 border-dashed border-stone-200 rounded-2xl text-[10px] font-bold text-stone-400 uppercase hover:border-amber-400 hover:text-amber-500 transition-colors"
                      >
                        + Add Skill to {category.category}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "cta" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Primary CTA Strategy
                  </label>
                  <div className="grid gap-3">
                    <input
                      placeholder="Label"
                      value={profile.cta.primary.text}
                      onChange={(e) =>
                        updateProfile({
                          cta: {
                            ...profile.cta,
                            primary: {
                              ...profile.cta.primary,
                              text: e.target.value,
                            },
                          },
                        })
                      }
                      className="px-5 py-4 bg-white border border-stone-200 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm"
                    />
                    <input
                      placeholder="URL"
                      value={profile.cta.primary.href}
                      onChange={(e) =>
                        updateProfile({
                          cta: {
                            ...profile.cta,
                            primary: {
                              ...profile.cta.primary,
                              href: e.target.value,
                            },
                          },
                        })
                      }
                      className="px-5 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-medium text-stone-500 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            {activeTab === "goals" && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    Manifesto Quote
                  </label>
                  <input
                    value={profile.goals.quote}
                    onChange={(e) =>
                      updateProfile({
                        goals: { ...profile.goals, quote: e.target.value },
                      })
                    }
                    className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl italic font-bold text-stone-700 shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: REAL VIEWPORT PREVIEW (Iframe + Real Scaling) */}
        <main className="flex-1 bg-stone-200/50 p-6 md:p-12 overflow-hidden flex flex-col relative transition-all duration-500">
          <div className="flex items-center justify-between mb-4 px-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
              <Eye size={14} /> Real Viewport Mirror
            </div>
            <div className="text-[9px] font-bold text-stone-400 uppercase bg-white/50 px-3 py-1 rounded-full border border-stone-200 shadow-sm">
              Viewport:{" "}
              {previewDevice === "mobile"
                ? "375 x 812 (iPhone X)"
                : "Auto-Adaptive Canvas"}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {/* The Container that simulates the device */}
            <div
              className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] bg-white shadow-[0_60px_120px_-20px_rgba(0,0,0,0.25)] relative overflow-hidden ${
                previewDevice === "mobile"
                  ? "w-[375px] h-[812px] rounded-[60px] border-[14px] border-stone-900 ring-4 ring-stone-900/10"
                  : "w-full h-full rounded-3xl border border-stone-300"
              }`}
            >
              {/* Mobile Device UI Elements */}
              {previewDevice === "mobile" && (
                <div className="absolute top-0 left-0 w-full h-8 bg-white z-20 flex items-center justify-between px-8 text-[11px] font-black text-stone-900 pointer-events-none">
                  <span>9:41</span>
                  <div className="w-24 h-6 bg-stone-900 rounded-b-[20px] absolute left-1/2 -translate-x-1/2 top-0 shadow-inner" />
                </div>
              )}

              {/* THE MAGIC: IFRAME provides a real, isolated viewport */}
              <iframe
                ref={iframeRef}
                src="/customize/preview"
                className="w-full h-full border-none pointer-events-auto"
                title="Real Viewport Preview"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
