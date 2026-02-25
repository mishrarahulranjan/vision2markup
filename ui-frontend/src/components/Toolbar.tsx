import { useBuilder } from "../context/BuilderContext";

export default function Toolbar() {
  const { addBlock } = useBuilder();

  const toolButtons = [
    { type: 'header', label: 'Header', icon: '📝' },
    { type: 'text', label: 'Text Block', icon: '📄' },
    { type: 'button', label: 'Action Button', icon: '🔘' },
  ];

  return (
    <div className="flex items-center justify-center gap-4 p-4 bg-[#121214] border border-gray-800 rounded-2xl shadow-xl mb-8">
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mr-2">Components</span>
      {toolButtons.map((tool) => (
        <button
          key={tool.type}
          onClick={() => addBlock(tool.type)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-indigo-600 hover:text-white text-gray-300 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-indigo-400"
        >
          <span>{tool.icon}</span>
          {tool.label}
        </button>
      ))}
    </div>
  );
}