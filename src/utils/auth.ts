
import { useState, useEffect } from 'react';
import { UserRole } from './pollTypes';

// Mock user database - in a real app this would come from a backend
const MOCK_USERS = [
  { id: '1', email: 'admin@electrafusion.com', password: 'admin123', role: { isAdmin: true, isVoter: true } },
  { id: '2', email: 'voter@electrafusion.com', password: 'voter123', role: { isAdmin: false, isVoter: true } }
];

interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
    const storedUser = localStorage.getItem('electrafusion_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(
          u => u.email === email && u.password === password
        );
        
        if (foundUser) {
          const authUser = {
            id: foundUser.id,
            email: foundUser.email,
            role: foundUser.role
          };
          
          // Store in localStorage for persistence
          localStorage.setItem('electrafusion_user', JSON.stringify(authUser));
          setUser(authUser);
          resolve(authUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const register = (email: string, password: string): Promise<AuthUser> => {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (MOCK_USERS.some(u => u.email === email)) {
          reject(new Error('User already exists'));
          return;
        }
        
        const newUser = {
          id: String(MOCK_USERS.length + 1),
          email,
          password,
          role: { isAdmin: false, isVoter: true }
        };
        
        // In a real app, we'd add to database
        MOCK_USERS.push(newUser);
        
        const authUser = {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        };
        
        localStorage.setItem('electrafusion_user', JSON.stringify(authUser));
        setUser(authUser);
        resolve(authUser);
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('electrafusion_user');
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role.isAdmin || false,
    isVoter: user?.role.isVoter || false
  };
};

// Mock database of polls
export const MOCK_POLLS = [
  {
    id: '1',
    title: 'Best Programming Language 2024',
    description: 'Vote for your favorite programming language',
    createdBy: '1',
    createdAt: new Date('2024-01-15'),
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-07-15'),
    options: [
      { id: '1', text: 'JavaScript', votes: 120 },
      { id: '2', text: 'Python', votes: 150 },
      { id: '3', text: 'Rust', votes: 80 },
      { id: '4', text: 'Go', votes: 65 },
      { id: '5', text: 'TypeScript', votes: 110 }
    ],
    votingMethod: 'single-choice',
    allowAnonymous: true,
    requireVerification: false,
    status: 'active',
    totalVotes: 525
  },
  {
    id: '2',
    title: 'Favorite Cloud Provider',
    description: 'Which cloud service do you prefer?',
    createdBy: '1',
    createdAt: new Date('2024-02-01'),
    startDate: new Date('2024-02-05'),
    endDate: new Date('2024-06-30'),
    options: [
      { id: '1', text: 'AWS', votes: 85 },
      { id: '2', text: 'Google Cloud', votes: 55 },
      { id: '3', text: 'Microsoft Azure', votes: 70 },
      { id: '4', text: 'Digital Ocean', votes: 30 }
    ],
    votingMethod: 'single-choice',
    allowAnonymous: false,
    requireVerification: true,
    status: 'active',
    totalVotes: 240
  },
  {
    id: '3',
    title: 'Remote Work vs Office',
    description: 'Do you prefer working remotely or in an office?',
    createdBy: '2',
    createdAt: new Date('2024-03-10'),
    startDate: new Date('2024-03-15'),
    endDate: null,
    options: [
      { id: '1', text: 'Remote Work', votes: 210 },
      { id: '2', text: 'Office Work', votes: 85 },
      { id: '3', text: 'Hybrid Model', votes: 175 }
    ],
    votingMethod: 'single-choice',
    allowAnonymous: true,
    requireVerification: false,
    status: 'active',
    totalVotes: 470
  }
];
