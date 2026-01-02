import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
