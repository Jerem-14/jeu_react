import Label from '../atoms/Label.jsx';
import Input from '../atoms/Input.jsx';
import PropTypes from 'prop-types';

const FormField = ({ label, type, name, placeholder, icon }) => (
  <div>
    <Label text={label} htmlFor={name} />
    <Input 
      type={type} 
      name={name} 
      icon={icon}
      placeholder={placeholder} 
    />
  </div>
);

FormField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.object.isRequired,
    placeholder: PropTypes.string,
  };
export default FormField;
