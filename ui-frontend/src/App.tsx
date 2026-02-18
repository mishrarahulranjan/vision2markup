import { useState, useRef } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [style, setStyle] = useState<string>('modern');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setDownloadUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleGenerate = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setDownloadUrl(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', style);

    try {
      const response = await axios.post('http://localhost:8080/api/ui/generate', formData, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate UI. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setDownloadUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Image to HTML / CSS / JS
          </h1>
          <p className="text-indigo-100 opacity-90">
            Upload a design → Get clean, responsive code in a ZIP file
          </p>
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-10 space-y-8">
          {/* Upload Area */}
          <div
            className={`border-3 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer
              ${file
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {file ? (
              <div className="space-y-4">
                <div className="text-xl font-medium text-gray-800">{file.name}</div>
                <div className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); clearFile(); }}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-5xl mb-4">📤</div>
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop your design image here
                </p>
                <p className="text-sm text-gray-500">or click to browse</p>
                <p className="text-xs text-gray-400 mt-4">
                  PNG, JPG, WebP • Max 10MB
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Style Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Design Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            >
              <option value="modern">Modern / Clean</option>
              <option value="minimal">Minimal / Simple</option>
              <option value="retro">Retro / Vintage</option>
              <option value="corporate">Corporate / Professional</option>
              <option value="playful">Playful / Colorful</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!file || loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-md
              ${!file || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating UI Code...
              </span>
            ) : (
              'Generate UI Code & Download ZIP'
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Download Link */}
          {downloadUrl && (
            <div className="mt-6 text-center">
              <a
                href={downloadUrl}
                download="generated-ui.zip"
                className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download ZIP Now
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t">
          Powered by Spring Boot + Spring AI + Claude
        </div>
      </div>
    </div>
  );
}

export default App;