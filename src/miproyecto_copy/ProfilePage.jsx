// src/pages/ProfilePage.jsx
import { useNavigate } from 'react-router-dom';
import UserProfile from "../components/auth/UserProfile.jsx";

const ProfilePage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <UserProfile onClose={handleClose} />
    </div>
  );
};

export default ProfilePage;