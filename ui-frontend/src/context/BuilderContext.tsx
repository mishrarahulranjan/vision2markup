import React, { createContext, useContext, useState } from "react";

export interface WebAppFiles {
  index_html: string;
  style_css: string;
  script_js: string;
}

interface Block {
  id: string;
  type: string;
  content: string; // This stores the AI layout instructions
}

interface BuilderContextType {
  mode: "upload" | "design";
  setMode: (mode: "upload" | "design") => void;
  files: WebAppFiles;
  setFiles: (files: WebAppFiles) => void;
  blocks: Block[];
  addBlock: (type: string, prompt: string) => void;
  removeBlock: (id: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  downloadUrl: string;
  setDownloadUrl: (url: string) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"upload" | "design">("upload");
  const [files, setFiles] = useState<WebAppFiles>({ index_html: "", style_css: "", script_js: "" });
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");

  const addBlock = (type: string, prompt: string) => {
    setBlocks(prev => [...prev, { id: crypto.randomUUID(), type, content: prompt }]);
  };

  const removeBlock = (id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <BuilderContext.Provider value={{
      mode, setMode, files, setFiles, blocks, addBlock, removeBlock, loading, setLoading, downloadUrl, setDownloadUrl
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("useBuilder must be used within BuilderProvider");
  return context;
};