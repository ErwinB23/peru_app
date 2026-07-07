import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/UserDropdown.css';

const UserDropdown = ({ onAvatarClick }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="user-dropdown-container">
      <div 
        className="user-avatar" 
        onClick={onAvatarClick}
        title="Mi cuenta"
      >
        <span>{user?.nombres?.charAt(0)?.toUpperCase() || 'U'}</span>
      </div>
    </div>
  );
};

export default UserDropdown;