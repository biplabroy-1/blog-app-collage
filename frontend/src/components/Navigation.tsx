import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, PenSquare } from 'lucide-react';
import { authApi } from '@/services/api';
import { useState, useEffect } from 'react';

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authApi.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated());

  useEffect(() => {
    // Check auth state on mount and when storage changes
    const checkAuth = () => {
      setUser(authApi.getCurrentUser());
      setIsAuthenticated(authApi.isAuthenticated());
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);

    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav className="border-b bg-card shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center transform transition-transform group-hover:scale-110">
            <span className="text-white font-bold text-lg">B</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BlogHub
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-2"
              >
                <Link to="/create">
                  <PenSquare className="h-4 w-4" />
                  Write
                </Link>
              </Button>

              <Link
                to={`/profile/${user?.id}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                  />
                  <AvatarFallback className="text-xs bg-primary text-white">
                    {user?.name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name}</span>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button size="sm" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
