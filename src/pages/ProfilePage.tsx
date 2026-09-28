// src/pages/ProfilePage.jsx
import { useNavigate } from 'react-router-dom';
import UserProfile from "../components/auth/UserProfile.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="">
      <UserProfile onClose={handleClose} />
    </div>
  );
};

export default ProfilePage;