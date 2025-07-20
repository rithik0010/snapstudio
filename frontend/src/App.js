import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./components/HomePage";
import StudioPage from "./components/StudioPage";
import GalleryPage from "./components/GalleryPage";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;