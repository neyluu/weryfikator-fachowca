import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Specialists from "./pages/Specialists";
import NotFound from "./pages/NotFound";
import Account from "./pages/Account";
import Activity from "./pages/Activity";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="account" replace />} />

              <Route path="account" element={<Account />} />
              <Route path="activity" element={<Activity />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
