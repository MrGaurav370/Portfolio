import "./App.css";
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { PortfolioProvider } from "./context/PortfolioContext";
import Portfolio from "./pages/Portfolio";
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Elearning = lazy(() => import("./pages/Elearning"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Shop = lazy(() => import("./pages/Shop"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Jarvis = lazy(() => import("./pages/Jarvis"));
const Tasks = lazy(() => import("./pages/Tasks"));
const Healthcare = lazy(() => import("./pages/Healthcare"));
const Weather = lazy(() => import("./pages/Weather"));
import CommandPalette from "./components/CommandPalette";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
    <h1 className="text-7xl font-black text-[#00d9ff]">404</h1>
    <p className="text-gray-400">That page doesn't exist.</p>
    <Link to="/" className="px-6 py-3 bg-[#00d9ff] text-black font-semibold hover:bg-[#00b8e6]">Back to Portfolio</Link>
  </div>
);

function App() {
  return (
    <div className="App">
      <PortfolioProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CommandPalette />
          <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#00d9ff] animate-pulse">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/elearning" element={<Elearning />} />
            <Route path="/elearning/course/:id" element={<CourseDetail />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/checkout" element={<Checkout />} />
            <Route path="/jarvis" element={<Jarvis />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/healthcare" element={<Healthcare />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </PortfolioProvider>
    </div>
  );
}

export default App;
