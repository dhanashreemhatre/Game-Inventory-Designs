import AestheticInventory from "./components/Inventory2";
import { DragProvider } from "./DragContext";
import "./App.css";

function App() {
  return (
    <DragProvider>
      <div className="App" id="app">
        <AestheticInventory />
      </div>
    </DragProvider>
  );
}

export default App;
