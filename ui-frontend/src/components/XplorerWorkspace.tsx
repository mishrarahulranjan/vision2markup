import { useBuilder } from "../context/BuilderContext";

export default function XplorerWorkspace() {
  const { files, activeFile, setActiveFile, updateFileContent, downloadUrl } = useBuilder();

  const combinedDoc = `
    <html>
      <head><style>${files.style_css}</style></head>
      <body>${files.index_html}<script>${files.script_js}</script></body>
    </html>
  `;

  return (
    <div className="flex h-[75vh] border border-gray-800 rounded-3xl overflow-hidden bg-[#121214] shadow-2xl animate-slide-up">
      {/* 1. Sidebar Explorer */}
      <div className="w-60 bg-[#0b0b0d] border-r border-gray-800 flex flex-col">
        <div className="p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-800/50">Explorer</div>
        <div className="flex-1 py-2">
          <FileRow name="index.html" active={activeFile === 'index_html'} onClick={() => setActiveFile('index_html')} icon="📄" />
          <FileRow name="style.css" active={activeFile === 'style_css'} onClick={() => setActiveFile('style_css')} icon="🎨" />
          <FileRow name="script.js" active={activeFile === 'script_js'} onClick={() => setActiveFile('script_js')} icon="⚡" />
        </div>
        {downloadUrl && (
          <div className="p-4 border-t border-gray-800">
             <a href={downloadUrl} download="webapp.zip" className="block text-center text-xs bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-500 transition">Download ZIP</a>
          </div>
        )}
      </div>

      {/* 2. Code Editor */}
      <div className="flex-1 flex flex-col bg-[#121214]">
        <div className="h-10 border-b border-gray-800 flex items-center px-6">
          <span className="text-[10px] text-indigo-400 font-mono italic">editing {activeFile.replace('_', '.')}</span>
        </div>
        <textarea
          spellCheck={false}
          className="flex-1 bg-transparent p-6 font-mono text-sm text-gray-300 outline-none resize-none"
          value={files[activeFile]}
          onChange={(e) => updateFileContent(activeFile, e.target.value)}
        />
      </div>

      {/* 3. Browser Preview */}
      <div className="w-[45%] bg-white flex flex-col">
        <div className="h-10 bg-gray-100 border-b border-gray-200 flex items-center px-4">
           <div className="bg-white border border-gray-200 text-[9px] text-gray-400 px-2 py-0.5 rounded flex-1">localhost:3000/vision_preview</div>
        </div>
        <iframe srcDoc={combinedDoc} title="Preview" className="flex-1 w-full" />
      </div>
    </div>
  );
}

function FileRow({ name, active, onClick, icon }: any) {
  return (
    <div onClick={onClick} className={`px-4 py-3 flex items-center gap-3 cursor-pointer transition ${active ? 'bg-indigo-600/10 border-r-2 border-indigo-600 text-white' : 'text-gray-500 hover:bg-white/5'}`}>
      <span>{icon}</span>
      <span className="text-sm">{name}</span>
    </div>
  );
}