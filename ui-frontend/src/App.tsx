import { BuilderProvider } from "./context/BuilderContext";
import BuilderPage from "./pages/BuilderPage";
import "./styles.css";

function App() {
  return (
    // Everything inside this Provider can now use useBuilder()
    <BuilderProvider>
      <BuilderPage />
    </BuilderProvider>
  );
}

export default App;