import AuthTemplate from '../authTemplate';
import LoginForm from '../components/organismes/LoginForm';
import SignupForm from '../components/organismes/SignupForm';
import { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [setIsAuthenticated] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const hardcodedEmail = "test@test.fr";
  const hardcodedPassword = "azerty";

  const handleSubmit = (values) => {
    const { email, password } = values;
    if (email === hardcodedEmail && password === hardcodedPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <AuthTemplate>
      {isLogin ? (
        <LoginForm onSubmit={handleSubmit} />
      ) : (
        <SignupForm onSubmit={handleSubmit} />
      )}
      <button onClick={toggleForm} className="btn btn-outline">
        {isLogin ? 'Pas de compte ? S\'inscrire maintenant !' : 'Vous avez déjà un compte ? Connecter vous !'}
      </button>
    </AuthTemplate>
  );
};

export default AuthPage;
