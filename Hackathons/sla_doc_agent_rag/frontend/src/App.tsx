import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { FileProvider } from "./contexts/FileContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import { useAuth } from "./contexts/AuthContext";

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <>
          <Dashboard />
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center px-4">
          <LoginForm />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div
    style={{
      height: '100vh',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}
    >
    <AuthProvider>
      <FileProvider>
        <AppContent />
      </FileProvider>
    </AuthProvider>
    </div>
  );
}

export default App;
