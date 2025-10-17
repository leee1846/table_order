import { UserProfile } from '@/pages/UserProfilePage/components/UserProfile';
import { useParams } from 'react-router-dom';

export const UserProfilePage = () => {
  const { userId } = useParams();

  return (
    <div className="user-profile-page">
      <h1>User Profile {userId} Page</h1>

      <UserProfile />
    </div>
  );
};
