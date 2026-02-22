import { createContext, useContext, useState } from "react";

export type Mode = "upload" | "design";

export interface Block {
  id: string;
  type: string;
  content: string;
}

interface BuilderContextType {
  mode: Mode;
  setMode: (m: Mode) => void;

  blocks: Block[];
  addBlock: (type: string) => void;
  updateBlock: (id: string, content: string) => void;

  selectedImage: File | null;
  setSelectedImage: (f: File | null) => void;

  generatedHtml: string;
  setGeneratedHtml: (html: string) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("upload");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState("");

  const addBlock = (type: string) => {
    setBlocks(prev => [
      ...prev,
      { id: crypto.randomUUID(), type, content: "Edit me" }
    ]);
  };

  const updateBlock = (id: string, content: string) => {
    setBlocks(prev =>
      prev.map(b => (b.id === id ? { ...b, content } : b))
    );
  };

  return (
    <BuilderContext.Provider
      value={{
        mode,
        setMode,
        blocks,
        addBlock,
        updateBlock,
        selectedImage,
        setSelectedImage,
        generatedHtml,
        setGeneratedHtml
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("Missing BuilderContext");
  return ctx;
}