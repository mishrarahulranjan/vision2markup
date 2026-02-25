import { useState, useRef } from "react";
import { useBuilder } from "../context/BuilderContext";
import {
  generateImagePreview,
  generateDesignPreview,
  generateImageZip,
  generateDesignZip
} from "../api/client";

import ModeSwitcher from "../components/ModeSwitcher";
import Toolbar from "../components/Toolbar";
import XplorerWorkspace from "../components/XplorerWorkspace";
import Loader from "../components/Loader";
import ProgressStream from "../components/ProgressStream";
import ResultPanel from "../components/ResultPanel";

export default function BuilderPage() {
  const {
    mode, loading, setLoading,
    files, setFiles,
    blocks, removeBlock,
    downloadUrl, setDownloadUrl
  } = useBuilder();

  // New state: Tracks if we should show the code editor or the configuration screen
  const [showWorkspace, setShowWorkspace] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (mode === "upload" && !selectedFile) return alert("Please upload a screenshot first.");
    if (mode === "design" && blocks.length === 0) return alert("Please add at least one component.");

    setLoading(true);
    // Reset workspace view while generating new code
    setShowWorkspace(false);

    try {
      let result;
      let zipBlob;

      if (mode === "upload" && selectedFile) {
        result = await generateImagePreview(selectedFile);
        zipBlob = await generateImageZip(selectedFile);
      } else {
        const designData = {
          blocks: blocks.map(b => ({ id: b.id, type: b.type, content: b.content })),
          style: "modern"
        };
        result = await generateDesignPreview(designData);
        zipBlob = await generateDesignZip(designData);
      }

      setFiles(result);
      setDownloadUrl(URL.createObjectURL(zipBlob));
      setShowWorkspace(true); // Switch to IDE view automatically after success
    } catch (error) {
      console.error(error);
      alert("Build Error. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-workspace-darkest text-white selection:bg-indigo-500/30">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

      <nav className="border-b border-workspace-border p-6 flex justify-between items-center bg-workspace-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">⚡</div>
          <div>
            <h1 className="text-lg font-black tracking-tighter leading-none italic">VISION AI</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">v2.0 Architecture</p>
          </div>
        </div>

        {/* Persist Mode Switcher - Switching modes won't clear files now */}
        <ModeSwitcher />

        <div className="flex gap-4">
          {/* Allow user to jump back into the code if it exists */}
          {files.index_html && !loading && (
            <button
              onClick={() => setShowWorkspace(!showWorkspace)}
              className="px-6 py-3 rounded-2xl font-bold text-xs border border-gray-700 hover:bg-gray-800 transition-all"
            >
              {showWorkspace ? "VIEW DRAFT" : "VIEW CODE"}
            </button>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-white text-black px-10 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
          >
            {loading ? "GENERATING..." : "BUILD SITE"}
          </button>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto p-10">

        {/* VIEW 1: LOADING */}
        {loading && (
          <div className="max-w-xl mx-auto py-24">
            <Loader />
            <ProgressStream active={loading} />
          </div>
        )}

        {/* VIEW 2: IDE WORKSPACE (Only if code exists AND toggle is ON) */}
        {!loading && showWorkspace && files.index_html && (
          <div className="space-y-10 animate-in">
            <XplorerWorkspace />
            <ResultPanel downloadUrl={downloadUrl} />
          </div>
        )}

        {/* VIEW 3: DRAFTING (Show if not loading AND (no code exists OR toggle is OFF)) */}
        {!loading && (!showWorkspace || !files.index_html) && (
          <div className="animate-in">
            {mode === "upload" ? (
              /* Upload drafting area */
              <div onClick={handleUploadClick} className="group cursor-pointer border-2 border-dashed border-workspace-border hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-[3.5rem] p-32 text-center transition-all">
                {imagePreview ? (
                   <div className="flex flex-col items-center">
                    <img src={imagePreview} alt="Preview" className="w-64 h-auto rounded-2xl shadow-2xl mb-6 border border-gray-800" />
                    <h3 className="text-xl font-bold text-indigo-400 italic uppercase tracking-tighter">Ready for analysis</h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-workspace-dark rounded-3xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📸</div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Drop UI Screenshot</h3>
                  </div>
                )}
              </div>
            ) : (
              /* Design drafting area */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-4"><Toolbar /></div>
                <div className="lg:col-span-8 bg-workspace-dark border border-workspace-border rounded-[3rem] p-10 min-h-[550px]">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-8">Active Stack</h3>
                  <div className="space-y-4">
                    {blocks.map((block, i) => (
                      <div key={block.id} className="group flex items-center justify-between p-6 bg-black/40 border border-workspace-border rounded-[2rem] hover:border-indigo-500/40 transition-all">
                        <div className="flex items-center gap-6">
                          <span className="w-8 h-8 rounded-full bg-workspace-dark flex items-center justify-center text-[10px] font-mono text-gray-600">{i+1}</span>
                          <h4 className="text-sm font-black text-indigo-400 uppercase italic tracking-tighter">{block.type}</h4>
                        </div>
                        <button onClick={() => removeBlock(block.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}