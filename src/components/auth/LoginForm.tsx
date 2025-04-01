
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  isRegister?: boolean;
}

const LoginForm = ({ isRegister = false }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          toast({
            title: 'Error',
            description: 'Passwords do not match',
            variant: 'destructive',
          });
          setLoading(false);
          return;
        }
        await register(email, password);
        toast({
          title: 'Success',
          description: 'Account created successfully',
          variant: 'default',
        });
      } else {
        await login(email, password);
        toast({
          title: 'Success',
          description: 'Logged in successfully',
          variant: 'default',
        });
      }
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isRegister ? 'Create an Account' : 'Login to Your Account'}</CardTitle>
        <CardDescription>
          {isRegister 
            ? 'Sign up to participate in voting and polls' 
            : 'Enter your credentials to access your account'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate(isRegister ? '/login' : '/register')}
          >
            {isRegister ? 'Have an account? Login' : "Don't have an account? Register"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading 
              ? (isRegister ? 'Creating Account...' : 'Logging in...') 
              : (isRegister ? 'Register' : 'Login')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
