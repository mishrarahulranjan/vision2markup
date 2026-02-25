import { useBuilder, BuilderProvider } from "../context/BuilderContext";
import { generateImagePreview, generateImageZip, generateDesignPreview, generateDesignZip } from "../api/client";
import XplorerWorkspace from "../components/XplorerWorkspace";

function BuilderContent() {
  const { mode, setMode, blocks, addBlock, updateBlock, selectedImage, setSelectedImage, files, setFiles, setDownloadUrl, loading, setLoading } = useBuilder();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let result;
      if (mode === "upload" && selectedImage) {
        // result is now the WebAppFiles object { index_html, style_css, script_js }
        result = await generateImagePreview(selectedImage);
      } else {
        result = await generateDesignPreview(blocks);
      }

      // CRITICAL: result is already an object, don't use JSON.parse(result)
      setFiles(result);

      // Now handle the ZIP (this remains a separate call)
      const zip = mode === "upload"
        ? await generateImageZip(selectedImage)
        : await generateDesignZip(blocks);
      setDownloadUrl(URL.createObjectURL(zip));

    } catch (e) {
      console.error("Analysis Error:", e); // This will tell you EXACTLY what's wrong in the console
      alert("Error generating code. Check the console for details.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-gray-200">
      <nav className="h-16 border-b border-gray-800 bg-[#121214] flex items-center justify-between px-8">
        <h1 className="font-bold text-lg text-white tracking-widest uppercase">Vision<span className="text-indigo-500">2</span>Markup</h1>
        <div className="flex bg-black rounded-full p-1 border border-gray-800">
          <button onClick={() => setMode("upload")} className={`px-4 py-1 rounded-full text-xs ${mode==='upload' ? 'bg-indigo-600' : ''}`}>IMAGE</button>
          <button onClick={() => setMode("design")} className={`px-4 py-1 rounded-full text-xs ${mode==='design' ? 'bg-indigo-600' : ''}`}>DESIGN</button>
        </div>
        <button onClick={handleGenerate} disabled={loading} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-500 transition">
          {loading ? "AI CODING..." : "GENERATE"}
        </button>
      </nav>

      <main className="p-8">
        {!files.index_html ? (
          <div className="max-w-xl mx-auto mt-20 text-center">
            {mode === "upload" ? (
              <div className="border-2 border-dashed border-gray-800 rounded-[2rem] p-20 bg-[#121214]">
                <input type="file" onChange={e => e.target.files && setSelectedImage(e.target.files[0])} />
                <p className="mt-4 text-gray-500 text-sm italic">{selectedImage ? selectedImage.name : "Upload UI Screenshot"}</p>
              </div>
            ) : (
              <div className="bg-[#121214] p-8 rounded-[2rem] border border-gray-800">
                <button onClick={() => addBlock("text")} className="bg-indigo-600 px-4 py-2 rounded text-xs">Add Text Block</button>
                {blocks.map(b => <textarea key={b.id} value={b.content} onChange={e => updateBlock(b.id, e.target.value)} className="w-full mt-4 bg-black border border-gray-800 p-2" />)}
              </div>
            )}
          </div>
        ) : (
          <XplorerWorkspace />
        )}
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return <BuilderProvider><BuilderContent /></BuilderProvider>;
}