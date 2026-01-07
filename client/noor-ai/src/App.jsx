import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import { safeGet, safeSet } from "./utils/safeStorage";


const DemoWrapper = ({ children }) => {
  safeSet("demoMode", "true");
  return children;
};

const ProtectedRoute = ({ children }) => {
  const token = safeGet("authToken");
  const isDemo = safeGet("demoMode") === "true";
  
  if (!token && !isDemo) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/demo" 
            element={
              <DemoWrapper>
                <Dashboard />
              </DemoWrapper>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}


export default App;
