import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserService from '../../services/UserService';

const GameAlert = () => {
  const [activeGame, setActiveGame] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkActiveGames = async () => {
      const userId = localStorage.getItem('userId');
      console.log("Vérification des parties actives pour userId:", userId);

      if (!userId) {
        console.log("Pas d'userId trouvé");
        return;
      }

      const result = await UserService.getUserGames(userId);
      console.log("Résultat de getUserGames:", result);

      if (result.success && result.data?.data) {
        const latestActiveGame = result.data.data.find(game => game.state === 'playing');
        console.log("Dernière partie active trouvée:", latestActiveGame);
        setActiveGame(latestActiveGame);
      }
    };

    checkActiveGames();
    const interval = setInterval(checkActiveGames, 10000);
    return () => clearInterval(interval);
  }, []);

  console.log("État actuel de activeGame:", activeGame);

  // Si pas de partie active, on retourne null (et donc rien ne s'affiche)
  if (!activeGame || location.pathname.includes(`/game/${activeGame.id}/play`)) {
    console.log("Pas de partie active - composant ne s'affiche pas");
    return null;
  }

  return (
    <div className="alert alert-info shadow-lg mb-4 flex justify-between">
      <div className="flex">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 mx-2 stroke-current">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
        <span>Vous avez une partie en cours !</span>
        <button 
          className="btn btn-sm btn-primary ms-5"
          onClick={() => navigate(`/game/${activeGame.id}/play`)}
        >
          Reprendre la partie
        </button>
      </div>
      <div className="flex-none">
        <button 
          className="btn btn-sm btn-ghost hover:text-white hover:bg-red-600"
          onClick={() => setActiveGame(null)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default GameAlert;