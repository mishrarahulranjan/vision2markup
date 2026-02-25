// Define the interface to match your Spring DTO
export interface WebAppFiles {
  index_html: string;
  style_css: string;
  script_js: string;
}

export async function generateImagePreview(file: File): Promise<WebAppFiles> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/ui/generate/image/preview", { method: "POST", body: formData });

  if (!res.ok) throw new Error("Backend failed");

  return await res.json();
}

export async function generateDesignPreview(blocks: any): Promise<WebAppFiles> {
  const res = await fetch("/api/ui/generate/design/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blocks)
  });

  if (!res.ok) throw new Error("Failed to generate design preview");
  return await res.json();
}

export async function generateImageZip(file: File, style: string = "modern"): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("style", style);

  const res = await fetch("/api/ui/generate/image", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to generate image zip");
  return await res.blob();
}

export async function generateDesignZip(blocks: any): Promise<Blob> {
  const res = await fetch("/api/ui/generate/design", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blocks)
  });
  if (!res.ok) throw new Error("Failed to generate design zip");
  return await res.blob();
}