export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-6 animate-fade-in">
      <div className="relative">
        {/* Outer pulsing ring */}
        <div className="w-16 h-16 border-4 border-indigo-500/20 rounded-full animate-ping absolute" />
        {/* Inner spinning ring */}
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold text-white tracking-tight">AI is Architecting...</h3>
        <p className="text-gray-500 text-sm mt-2 italic font-mono">Converting pixels to clean code</p>
      </div>
    </div>
  );
}