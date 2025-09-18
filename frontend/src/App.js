import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Singlepage from "./pages/Singlepage/Singlepage";
import Payment from "./Components/Payment/Payment.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "react-toastify/dist/ReactToastify.css";
import Addtocart from "./Components/Cart/Addtocart.jsx";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/Login" element={<Login />} />
            <Route path="Addtocart" element={<Addtocart />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/singlepage/:id" element={<Singlepage />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="*" element={<h1>Not Found</h1>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
