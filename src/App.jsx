import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/organismes/LoginForm';
import SignupForm from './components/organismes/SignupForm';
import AuthPage from './views/authPage';
import Accueil from './views/Accueil';
import Header from './components/organismes/Header';
import Home from './views/Home';
import Profile from './views/Profile';
import Settings from './views/Settings';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hardcodedEmail = "test@test.fr";
  const hardcodedPassword = "azerty";

  const handleLogin = (values) => {
    const { email, password } = values;
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
      <Header 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout} 
        />
        <main className="container mx-auto px-4 pt-4">
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/login" element={<LoginForm onSubmit={handleLogin} />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/" element={<Accueil />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;