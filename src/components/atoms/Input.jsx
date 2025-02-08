import { Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';

const Input = ({ type, name, placeholder, icon }) => (
    <div className="pb-5">
        <label className="input input-bordered flex items-center gap-2">
      {/* Icône SVG passée en prop */}
      <span className="h-4 w-4 opacity-70">{icon}</span>
      <Field type={type} name={name} className="grow " placeholder={placeholder} />
      <ErrorMessage name={name} component="div" className="text-red-500 mt-1" />
    </label>
    </div>
  );

  Input.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
  };
  
  export default Input;
