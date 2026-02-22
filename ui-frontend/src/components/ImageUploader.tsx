import { useBuilder } from "../context/BuilderContext";

export default function ImageUploader() {
  const { selectedImage, setSelectedImage } = useBuilder();

  return (
    <div style={{ marginBottom: 20 }}>
      <input
        type="file"
        accept="image/*"
        onChange={e => {
          if (e.target.files?.length) {
            setSelectedImage(e.target.files[0]);
          }
        }}
      />

      {selectedImage && <p>Selected Image: {selectedImage.name}</p>}
    </div>
  );
}