import { Link } from 'react-router-dom';
import { Icons } from './icons';
import { useAuth } from './AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const Header = () => {
  const { user } = useAuth();
  return (
    <div className="h-11 px-4 w-full flex items-center justify-between border-b border-border">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="ring-offset-2 ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none rounded-sm"
        >
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/icon.png" className="mr-2 h-6 w-6" />
            Nova
          </div>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <Avatar className="w-8 h-8">
          <AvatarImage src={user?.image} alt={user?.name} />
          <AvatarFallback>
            {user?.name
              ?.split(' ')
              .slice(0, 2)
              .map((name: string) => name[0].toUpperCase())}
          </AvatarFallback>
        </Avatar>
        {/* <DashboardNavbarSearch />
                  <UserButton userData={userData} /> */}
      </div>
    </div>
  );
};
