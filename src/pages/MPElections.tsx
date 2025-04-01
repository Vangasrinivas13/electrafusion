
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { MOCK_POLLS } from '@/utils/auth';
import { Poll } from '@/utils/pollTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import PollCard from '@/components/polls/PollCard';
import { Search, MapPin } from 'lucide-react';

const MPElections = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [constituency, setConstituency] = useState('');
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Filter polls to only show MP elections
  const mpPolls = MOCK_POLLS.filter(poll => 
    poll.electionType === 'mp' && 
    poll.status === 'active' &&
    (poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (poll.constituency && poll.constituency.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Filter by constituency if provided
  const filteredPolls = constituency 
    ? mpPolls.filter(poll => poll.constituency?.toLowerCase().includes(constituency.toLowerCase()))
    : mpPolls;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold">MP Elections</h1>
            <p className="text-muted-foreground">
              Vote for your Member of Parliament representatives
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for elections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2 md:w-1/3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Filter by constituency..."
                value={constituency}
                onChange={(e) => setConstituency(e.target.value)}
              />
            </div>
          </div>
          
          {filteredPolls.length === 0 ? (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground mb-4">No active MP elections found for your criteria.</p>
              <Button variant="outline" onClick={() => {setSearchTerm(''); setConstituency('');}}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MPElections;
