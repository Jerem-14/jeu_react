import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './components/organismes/LoginForm';
import SignupForm from './components/organismes/SignupForm';
import AuthPage from './views/authPage';
import Accueil from './views/Accueil';
import Header from './components/organismes/Header';
import Home from './views/Home';
import Profile from './views/Profile';
import Settings from './views/Settings';
import UserService from './services/UserService';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const handleLogin = async ({email, password}) => {
    
    try {
      const response = await UserService.login({email, password});
      if (response.success) {alert("Connexion reussi.");
        setIsAuthenticated(true);

      } else {
        alert(response.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSignup = async (userData) => {
    try {
      const response = await UserService.register(userData);
      if (response.success) {
        alert("Inscription réussie. Vous pouvez maintenant vous connecter.");
        Navigate
      } else {
        alert(response.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
    }
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
                <Route path="/signup" element={<SignupForm onSubmit={handleSignup}/>} />
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