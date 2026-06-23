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
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import SearchResults from "./pages/SearchResults";
import ContractTestPage from "./pages/ContractTestPage.jsx";
import ContactMeCard from "./components/ui/ContactMeCard.jsx";
import Chat from "./pages/Chat.jsx";
import ConversationList from "./pages/ConversationList.jsx";
import SpecialistProfile from "./pages/SpecialistProfile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/specialists" element={<Specialists />} />
            <Route
              path="/auth/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/auth/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="account" replace />} />

              <Route path="account" element={<Account />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />

              <Route path="contracts" element={<ContractTestPage />} />
              <Route path="chat" element={<ConversationList />} />
              <Route path="chat/:professionalId" element={<Chat />} />

              <Route
                path="contact-me"
                element={<ContactMeCard professionalId={1} />}
              />
            </Route>

            <Route path="/search" element={<SearchResults />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/specialist/:id" element={<SpecialistProfile />} />  {/* NOWA LINIA */}
            <Route path="*" element={<NotFound />} />

            <Route path="*" element={<NotFound />} />


          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
