import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import PropTypes from 'prop-types';

const LoginForm = ({ onSubmit }) => {
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'), 
    password: Yup.string().min(6, 'Password too short').required('Required'),
  });

  return (
    <>
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
  </>
  );
};

LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
  };
export default LoginForm;
