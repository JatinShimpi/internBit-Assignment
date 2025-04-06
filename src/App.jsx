import React from "react";
import Notes from "./notes";
import { BrowserRouter, Route, Router, Routes } from "react-router";
import SignIn from "./signinpage";
import ProtectedRoute from "./PRotectedRoute";
import Signup from "./Signup";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
