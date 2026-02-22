// client.ts

export async function generateImageZip(file: File, style: string = "modern"): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("style", style);

  const res = await fetch("/api/ui/generate/image", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to generate image zip");
  return await res.blob();
}

export async function generateImagePreview(file: File, style: string = "modern"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("style", style);

  const res = await fetch("/api/ui/generate/image/preview", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Failed to generate image preview");
  return await res.text();
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

export async function generateDesignPreview(blocks: any): Promise<string> {
  const res = await fetch("/api/ui/generate/design/preview", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blocks)
  });
  if (!res.ok) throw new Error("Failed to generate design preview");
  return await res.text();
}