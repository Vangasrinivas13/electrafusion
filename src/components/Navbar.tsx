
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui';
import { Menu, User, LogOut, Vote } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Vote className="h-8 w-8 mr-2" />
              <span className="text-xl font-bold">ElectraFusion</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark hover:bg-opacity-75">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark hover:bg-opacity-75">
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/create-poll" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-dark hover:bg-opacity-75">
                  Create Poll
                </Link>
              )}
              {!isAuthenticated ? (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="secondary" className="text-primary">
                      Register
                    </Button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                      <User className="h-4 w-4 mr-2" />
                      {user?.email.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="outline"
              size="icon"
              className="border-white text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-dark bg-opacity-95">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-dark"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link 
                to="/create-poll" 
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-primary-dark"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Poll
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="secondary" className="w-full text-primary">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="w-full mt-2 border-white text-white"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
