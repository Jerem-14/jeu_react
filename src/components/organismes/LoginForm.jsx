import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../../components/molecules/FormField.jsx';
import Button from '../../components/atoms/Button.jsx';
import PropTypes from 'prop-types';
import { useNavigate, useLocation  } from 'react-router-dom';

const LoginForm = ({ onSubmit }) => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'), 
    password: Yup.string().min(6, 'Password too short').required('Required'),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isVerified = queryParams.get('verified');
  const isError = queryParams.get('error');

  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/signup'); 
  };

  return (
    <>
    {isVerified && (
    <div role="alert" className="alert alert-success mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span> Votre email a été vérifié avec succès ! Vous pouvez maintenant vous connecter.</span>
    </div>
  )}
   {isError && (
    <div role="alert" className="alert alert-error mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span> Votre email n'a pu être vérifié ! Vous n'êtes pas l'utilisateur que vous prétendez être 👿.</span>
    </div>
  )
      
      }
    <div className="flex justify-center items-center mb-3">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex justify-center text-primary">Se connecter</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form className="space-y-4">
                <FormField
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="Votre email"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 text-base-content"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                  }
                  className="input input-bordered w-full mb-4 text-base-content placeholder:text-neutral-content placeholder:opacity-70"
                />
                <FormField
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="h-4 w-4 text-base-content"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                  className="input input-bordered w-full mb-4 "
                />
                <Button type="submit" text="Se connecter" className="btn btn-primary w-full" />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
    <button
        className="btn btn-outline"
        onClick={handleLoginRedirect}
      >
        Pas de compte ? S'inscrire maintenant !
      </button>
    
  </>
  );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
export default LoginForm;
