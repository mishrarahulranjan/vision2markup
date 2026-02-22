import { useState } from "react";
import { useBuilder, BuilderProvider } from "../context/BuilderContext";
import {
  generateImagePreview,
  generateImageZip,
  generateDesignPreview,
  generateDesignZip
} from "../api/client";

function BuilderPageContent() {
  const {
    mode,
    setMode,
    blocks,
    addBlock,
    updateBlock,
    selectedImage,
    setSelectedImage,
    generatedHtml,
    setGeneratedHtml
  } = useBuilder();

  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleGenerate = async () => {
    if ((mode === "upload" && !selectedImage) || (mode === "design" && blocks.length === 0)) return;

    setLoading(true);
    setDownloadUrl("");
    setGeneratedHtml("");

    try {
      if (mode === "upload" && selectedImage) {
        const html = await generateImagePreview(selectedImage);
        setGeneratedHtml(html);

        const blob = await generateImageZip(selectedImage);
        setDownloadUrl(URL.createObjectURL(blob));
      } else if (mode === "design") {
        const html = await generateDesignPreview(blocks);
        setGeneratedHtml(html);

        const blob = await generateDesignZip(blocks);
        setDownloadUrl(URL.createObjectURL(blob));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate web app. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-indigo-600">Vision2Markup Web Builder</h1>
          <p className="text-gray-600 text-lg">Upload an image or design your app with blocks</p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setMode("upload")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              mode === "upload"
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-white border border-gray-300 hover:bg-indigo-50"
            }`}
          >
            Upload Image
          </button>
          <button
            onClick={() => setMode("design")}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              mode === "design"
                ? "bg-indigo-600 text-white shadow-lg scale-105"
                : "bg-white border border-gray-300 hover:bg-indigo-50"
            }`}
          >
            Design Builder
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          {/* Image Upload */}
          {mode === "upload" && (
            <div className="flex flex-col items-center space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  if (e.target.files?.length) setSelectedImage(e.target.files[0]);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md"
              />
              {selectedImage && (
                <p className="text-gray-700 text-sm font-medium">Selected: {selectedImage.name}</p>
              )}
            </div>
          )}

          {/* Design Builder */}
          {mode === "design" && (
            <div className="flex flex-col space-y-3">
              {/* Block Controls */}
              <div className="flex space-x-3">
                <button
                  onClick={() => addBlock("header")}
                  className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  Add Header
                </button>
                <button
                  onClick={() => addBlock("text")}
                  className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  Add Text
                </button>
                <button
                  onClick={() => addBlock("button")}
                  className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
                >
                  Add Button
                </button>
              </div>

              {/* Block Editor */}
              <div className="border border-gray-200 rounded-lg p-3 max-h-72 overflow-y-auto bg-gray-50">
                {blocks.length === 0 && (
                  <p className="text-gray-400 text-sm">No blocks yet. Use buttons above to add content.</p>
                )}
                {blocks.map(block => (
                  <textarea
                    key={block.id}
                    value={block.content}
                    onChange={e => updateBlock(block.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || (mode === "upload" && !selectedImage)}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg transition disabled:bg-gray-400"
          >
            {loading ? "Generating..." : "Generate Web App"}
          </button>

          {/* Download */}
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="generated-webapp.zip"
              className="block text-center py-3 bg-green-500 text-white font-semibold rounded-2xl hover:bg-green-600 shadow-md transition"
            >
              Download ZIP
            </a>
          )}

          {/* Live Preview */}
          {generatedHtml && (
            <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden shadow-inner">
              <iframe
                srcDoc={generatedHtml}
                title="Live Preview"
                className="w-full h-96"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-4">Powered by vision2markup</p>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <BuilderProvider>
      <BuilderPageContent />
    </BuilderProvider>
  );
}