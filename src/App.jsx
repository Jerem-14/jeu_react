import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/organismes/LoginForm';
import SignupForm from './components/organismes/SignupForm';
import AuthPage from './views/authPage';


function App() {


    return (

      <Router>
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;