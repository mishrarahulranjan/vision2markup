import { useEffect, useState } from "react";

export default function ProgressStream({ active }: { active: boolean }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!active) return;
    const eventSource = new EventSource("/api/ui/generate/stream");
    eventSource.onmessage = e => {
      setLogs(prev => [...prev.slice(-5), e.data]); // Keep last 5 logs for cleanliness
    };
    return () => eventSource.close();
  }, [active]);

  if (!active) return null;

  return (
    <div className="mt-6 bg-black/40 border border-gray-800 rounded-xl p-4 font-mono text-[11px] text-indigo-400/80 shadow-inner">
      <div className="flex items-center gap-2 mb-2 text-gray-600 border-b border-gray-800 pb-2">
        <span className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
        <span>LIVE ENGINE LOGS</span>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div key={i} className="animate-in fade-in slide-in-from-left-2">
            <span className="text-gray-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        {logs.length === 0 && <div className="text-gray-700">Initialising LLM connection...</div>}
      </div>
    </div>
  );
}