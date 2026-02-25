interface Props {
  downloadUrl: string;
}

export default function ResultPanel({ downloadUrl }: Props) {
  if (!downloadUrl) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 mt-6 animate-zoom-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">Build Complete! 🚀</h3>
          <p className="text-indigo-300/70 text-sm">Your production-ready files are ready for deployment.</p>
        </div>
        <a
          href={downloadUrl}
          download="vision-project.zip"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <span>📥</span> Download ZIP
        </a>
      </div>
    </div>
  );
}