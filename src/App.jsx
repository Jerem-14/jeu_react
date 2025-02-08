import './App.css';
import { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/organismes/LoginForm.jsx';
import SignupForm from './components/organismes/SignupForm.jsx';
import Accueil from './views/Accueil.jsx';
import Header from './components/organismes/Header.jsx';
import Home from './views/Home.jsx';
import Media from './views/Media.jsx';
import Profile from './views/Profile.jsx';
import GameRoom from './views/GameRoom.jsx';
import Settings from './views/Settings.jsx';
import UserService from './services/UserService.jsx';
import { GlobalContext } from './contexts/GlobalContext.jsx';

function App() {
  const { token, saveToken, isAuthenticated, isAuthResolved } = useContext(GlobalContext);

  

  const handleLogin = async ({ email, password }) => {
    try {
      const response = await UserService.login({ email, password });
      console.log("Réponse de l'API login:", response);
      if (response.success) {
        alert("Connexion réussie.");
        saveToken(response.data.token); // Sauvegarde le token dans le contexte global
        console.log("response token :", response.data.token);
        localStorage.setItem('userId', response.data.userId); // Store userIdcd
        
      } else {
        alert(response.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  };

  const handleLogout = async () => {
    try {
      const result = await UserService.logout();
      if (result.success) {
        saveToken(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userId'); // Also clear userId
      localStorage.removeItem('username'); // Also clear username
      }
      else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSignup = async (userData) => {
    try {
      const response = await UserService.register(userData);
      console.log("Réponse de l'API signup:", response);
      if (response.success) {
        alert("Inscription réussie. Vous pouvez maintenant vous connecter.");
      } else {
        alert(response.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur d'inscription :", error);
    }
  };

  // Vérifie si l'authentification est résolue avant d'afficher les routes
  if (!isAuthResolved) {
    console.log("En attente de résolution de l'état d'authentification...");
    return <div>Chargement...</div>;
  }

  console.log("Token actuel:", token);
  console.log("Utilisateur est-il authentifié ?", isAuthenticated());

  return (
    <Router>
      <div className="min-h-screen bg-base-200">
        <Header 
          isAuthenticated={isAuthenticated()} 
          onLogout={handleLogout} 
        />
        <main className="container mx-auto px-4 pt-4">
          <Routes>
            {isAuthenticated() ? (
              <>
                {/* Routes protégées */}
                <Route path="/" element={<Home />} />
                <Route path="/media" element={<Media />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                                
                <Route path="/game/*" element={<GameRoom />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                {/* Routes publiques */}
                <Route path="/login" element={<LoginForm onSubmit={handleLogin} />} />
                <Route path="/signup" element={<SignupForm onSubmit={handleSignup} />} />
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
