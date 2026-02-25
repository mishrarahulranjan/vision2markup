import { useBuilder } from "../context/BuilderContext";

export default function Toolbar() {
  const { addBlock } = useBuilder();

  const library = [
    { type: 'Navbar', icon: '💎', prompt: 'Sticky dark glassmorphism navbar with logo and 4 links.' },
    { type: 'Hero', icon: '🚀', prompt: 'Modern hero section with split layout, big heading, and primary CTA.' },
    { type: 'Features', icon: '⚡', prompt: '3-column feature grid with hover effects and Lucide icons.' },
    { type: 'Pricing', icon: '💳', prompt: 'Tiered pricing cards with a highlighted "Pro" plan.' },
    { type: 'Testimonials', icon: '💬', prompt: 'Customer review section with star ratings and avatars.' },
    { type: 'Footer', icon: '⚓', prompt: 'Multi-column footer with newsletter signup and social links.' },
  ];

  return (
    <div className="bg-[#121214] border border-gray-800 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">UI Library</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {library.map((item) => (
          <button
            key={item.type}
            onClick={() => addBlock(item.type, item.prompt)}
            className="group flex flex-col items-start p-4 bg-black/40 border border-gray-800 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
          >
            <span className="text-xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-xs font-bold text-gray-300 group-hover:text-white">{item.type}</span>
          </button>
        ))}
      </div>
    </div>
  );
}