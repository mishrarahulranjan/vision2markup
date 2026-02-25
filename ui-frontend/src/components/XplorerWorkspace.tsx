import { useState, useMemo } from "react";
import { useBuilder } from "../context/BuilderContext";

export default function XplorerWorkspace() {
  const { files, setFiles } = useBuilder();
  const [activeFile, setActiveFile] = useState<"html" | "css" | "js">("html");

  // Injects the CSS and JS into the HTML for the iframe preview
  const combinedDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${files.style_css}</style>
        </head>
        <body>
          ${files.index_html}
          <script>${files.script_js}</script>
        </body>
      </html>
    `;
  }, [files]);

  const updateContent = (val: string) => {
    const key = activeFile === "html" ? "index_html" : activeFile === "css" ? "style_css" : "script_js";
    setFiles({ ...files, [key]: val });
  };

  const getActiveContent = () => {
    if (activeFile === "html") return files.index_html;
    if (activeFile === "css") return files.style_css;
    return files.script_js;
  };

  return (
    <div className="flex h-[750px] bg-[#0b0b0d] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-6">

      {/* 1. LEFT SIDEBAR: File Explorer */}
      <div className="w-64 bg-[#121214] border-r border-gray-800 p-6">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Explorer</h3>
        <div className="space-y-2">
          {[
            { id: "html", label: "index.html", icon: "🌐", color: "text-orange-400" },
            { id: "css", label: "style.css", icon: "🎨", color: "text-blue-400" },
            { id: "js", label: "script.js", icon: "📜", color: "text-yellow-400" }
          ].map((file) => (
            <button
              key={file.id}
              onClick={() => setActiveFile(file.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                activeFile === file.id ? "bg-indigo-600/10 text-white border border-indigo-500/20" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <span className={file.color}>{file.icon}</span>
              <span className="font-medium">{file.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE: Code Editor */}
      <div className="flex-1 flex flex-col bg-[#121214]/50">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#121214]">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-tighter italic">Editor — {activeFile.toUpperCase()}</span>
          <span className="text-[10px] text-gray-600 font-mono italic">Read-only preview mode</span>
        </div>
        <textarea
          value={getActiveContent()}
          onChange={(e) => updateContent(e.target.value)}
          className="flex-1 p-8 bg-transparent text-gray-300 font-mono text-sm outline-none resize-none custom-scrollbar"
          spellCheck={false}
        />
      </div>

      {/* 3. RIGHT: Live Preview */}
      <div className="flex-1 bg-white flex flex-col">
        <div className="p-3 bg-gray-100 border-b border-gray-300 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded px-3 py-1 text-[10px] text-gray-400 font-mono truncate border border-gray-200">
            localhost:3000/preview
          </div>
        </div>
        <iframe title="preview" srcDoc={combinedDoc} className="flex-1 w-full h-full border-none" />
      </div>
    </div>
  );
}