
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { MOCK_POLLS } from '@/utils/auth';
import { Poll } from '@/utils/pollTypes';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PollCard from '@/components/polls/PollCard';
import { Plus, Search } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter polls
  const filteredPolls = MOCK_POLLS.filter(poll => 
    poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const activePolls = filteredPolls.filter(poll => poll.status === 'active');
  const closedPolls = filteredPolls.filter(poll => poll.status === 'closed');
  const draftPolls = filteredPolls.filter(poll => poll.status === 'draft');
  
  // Stats
  const totalVotes = MOCK_POLLS.reduce((acc, poll) => acc + poll.totalVotes, 0);
  const totalPolls = MOCK_POLLS.length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all your polls from one place
          </p>
        </div>
        <Link to="/create-poll">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Poll
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Polls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPolls}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Polls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activePolls.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Votes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVotes}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({activePolls.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({draftPolls.length})
          </TabsTrigger>
          <TabsTrigger value="closed">
            Closed ({closedPolls.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {activePolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No active polls found.</p>
              <Link to="/create-poll">
                <Button variant="outline" className="mt-4">
                  Create Your First Poll
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} showVoteButton={false} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="draft">
          {draftPolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No draft polls found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} showVoteButton={false} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="closed">
          {closedPolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No closed polls found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closedPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} showVoteButton={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
