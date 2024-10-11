import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Singlepage from "./pages/Singlepage/Singlepage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/singlepage/:id" element={<Singlepage />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
