import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Dashboard from "./pages/Dashboard";
import Elearning from "./pages/Elearning";
import CourseDetail from "./pages/CourseDetail";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/elearning" element={<Elearning />} />
          <Route path="/elearning/course/:id" element={<CourseDetail />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
