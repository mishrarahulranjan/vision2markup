interface Props {
  downloadUrl: string;
}

export default function ResultPanel({ downloadUrl }: Props) {
  return (
    <div className="result-box">
      <h3>Web App Generated</h3>
      <a href={downloadUrl} download="generated-webapp.zip">
        Download ZIP
      </a>
    </div>
  );
}