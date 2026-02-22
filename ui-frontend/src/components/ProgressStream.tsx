import { useEffect, useState } from "react";

export default function ProgressStream({ active }: { active: boolean }) {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!active) return;

    const eventSource = new EventSource("/api/ui/generate/stream"); // updated path

    eventSource.onmessage = e => {
      setLogs(prev => [...prev, e.data]);
    };

    return () => eventSource.close();
  }, [active]);

  return (
    <div style={{ marginTop: 20, maxHeight: 200, overflowY: "auto", fontFamily: "monospace" }}>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
}