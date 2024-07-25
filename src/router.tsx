import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard.tsx";
import LandingPage from "./LandingPage.tsx";
import Login from "./Login.tsx";
import SignUp from "./SignUp.tsx";
import Terms from "./Terms of Service.tsx";
import Policy from "./Privacy Policy.tsx";
import Links from "./Links.tsx";
import Profile from "./profile.tsx";
import Settings from "./Settings.tsx";
import NotFound from "./NotFound.tsx";
import Loading from "./Loading.tsx";
import CreateLink from "./CreateLink.tsx";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/terms-of-service" element={<Terms />} />
        <Route path="/privacy-policy" element={<Policy />} />
        <Route path="/links" element={<Links />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/create-link" element={<CreateLink />} />
        <Route path="/loading" element={<Loading />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
