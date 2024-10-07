import AuthTemplate from '../authTemplate';
import LoginForm from '../components/organismes/LoginForm';
import SignupForm from '../components/organismes/SignupForm';
import { useState } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (data) => {
    console.log('Form submitted:', data);
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
