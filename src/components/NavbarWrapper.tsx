
import { useAuth } from '@/utils/auth';
import Navbar from './Navbar';
import { Button } from '@/components/ui/button';
import { Vote } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavbarWrapper = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative">
      <Navbar />
      {isAuthenticated && (
        <div className="absolute top-full left-0 right-0 bg-background border-b z-10 py-1">
          <div className="container mx-auto px-4 flex justify-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/mp-elections">
              <Button variant="ghost" size="sm" className="flex items-center">
                <Vote className="h-4 w-4 mr-2" />
                MP Elections
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarWrapper;
