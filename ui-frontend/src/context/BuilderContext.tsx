import { createContext, useContext, useState, ReactNode } from "react";

export interface WebAppFiles {
  index_html: string;
  style_css: string;
  script_js: string;
}

export type Mode = "upload" | "design";
export interface Block { id: string; type: string; content: string; }

interface BuilderContextType {
  mode: Mode;
  setMode: (m: Mode) => void;
  loading: boolean;
  setLoading: (l: boolean) => void;
  blocks: Block[];
  addBlock: (type: string) => void;
  updateBlock: (id: string, content: string) => void;
  selectedImage: File | null;
  setSelectedImage: (f: File | null) => void;
  files: WebAppFiles;
  setFiles: (files: WebAppFiles) => void;
  activeFile: keyof WebAppFiles;
  setActiveFile: (file: keyof WebAppFiles) => void;
  updateFileContent: (file: keyof WebAppFiles, content: string) => void;
  downloadUrl: string;
  setDownloadUrl: (url: string) => void;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("upload");
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [activeFile, setActiveFile] = useState<keyof WebAppFiles>("index_html");
  const [files, setFiles] = useState<WebAppFiles>({ index_html: "", style_css: "", script_js: "" });

  const addBlock = (type: string) => setBlocks(prev => [...prev, { id: crypto.randomUUID(), type, content: `New ${type}` }]);
  const updateBlock = (id: string, content: string) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, content } : b));
  const updateFileContent = (file: keyof WebAppFiles, content: string) => setFiles(prev => ({ ...prev, [file]: content }));

  return (
    <BuilderContext.Provider value={{
      mode, setMode, loading, setLoading, blocks, addBlock, updateBlock,
      selectedImage, setSelectedImage, files, setFiles, activeFile,
      setActiveFile, updateFileContent, downloadUrl, setDownloadUrl
    }}>
      {children}
    </BuilderContext.Provider>
  );
}

export const useBuilder = () => {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within a BuilderProvider");
  return ctx;
};