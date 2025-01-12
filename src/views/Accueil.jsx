import { useNavigate } from 'react-router-dom';

const Accueil = () => {
 
  const navigate = useNavigate();

  
  const handleLoginRedirect = () => {
    navigate('/login'); // Redirige vers la route '/login'
  };

  return (
    <div className="flex flex-col justify-center items-center bg-base-200">
      <h1 className="text-3xl font-bold mb-4 text-base-content">Bienvenue sur Meme-on-rit</h1>
      <p className="mb-8 text-base-content">Veuillez vous connecter pour accéder à l'application.</p>

      {/* Bouton pour rediriger vers la page de connexion */}
      <button
        className="btn btn-primary"
        onClick={handleLoginRedirect}
      >
        Se connecter
      </button>
    </div>
  );
};

export default Accueil;