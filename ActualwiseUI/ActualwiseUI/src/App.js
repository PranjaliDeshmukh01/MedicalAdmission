import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import "./App.css";
import LoginRegister from "./pages/register";
import { AuthProvider } from "./AuthContext"; // Import AuthProvider
import FileFetch from "./pages/FileFetch";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* Wrap your entire application with AuthProvider */}
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<LoginRegister />} />
          <Route path="/fileFetch" element={<FileFetch />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
