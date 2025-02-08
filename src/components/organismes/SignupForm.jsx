import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '@molecules/FormField.jsx';
import Button from '@atoms/Button.jsx';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserService from '@services/UserService.jsx';

const SignupForm = ({ onSubmit }) => {
  const validationSchema = Yup.object({
    firstname: Yup.string().required('Required'),
    lastname: Yup.string().required('Required'),
    username: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  const navigate = useNavigate();

 
  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  return (
    <>
    <div className="flex justify-center items-center mb-3">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title flex justify-center text-primary">S'inscrire</h2>
    <Formik
      initialValues={{ email: '', password: '', confirmPassword: '', lastname: '', firstname: '', username: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {() => (
        <Form className="space-y-4">
          <FormField
            label="Prénom"
            type="text"
            name="firstname"
            placeholder="Saisisser votre Prénom"
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
          />
          <FormField
            label="Nom"
            type="text"
            name="lastname"
            placeholder="Saisisser votre Nom"
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
          />
          <FormField
            label="Username"
            type="text"
            name="username"
            placeholder="Saisisser votre Username"
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
          />
          <FormField
            label="Email"
            type="email"
            name="email"
            placeholder="Saisisser votre email"
            icon={
              <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="h-4 w-4 text-base-content">
    <path
      d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
    <path
      d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
  </svg>
            }
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="Saisisser votre mot de passe"
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
          />
          <FormField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            placeholder="Confirmer votre mot de passe"
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
          />
          <Button type="submit" text="S'inscrire" className="btn btn-primary w-full" />
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
Vous avez déjà un compte ? Connecter vous !
</button>
</>
  );
};

SignupForm.propTypes = {
    onSubmit: PropTypes.any.isRequired, 
};
export default SignupForm;
