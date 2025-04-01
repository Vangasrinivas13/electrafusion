
import { useState } from 'react';
import { MOCK_POLLS } from '@/utils/auth';
import { Poll } from '@/utils/pollTypes';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PollCard from '@/components/polls/PollCard';
import { Search } from 'lucide-react';

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter polls (in a real app, this would be server-side filtering)
  const filteredPolls = MOCK_POLLS.filter(poll => 
    poll.status === 'active' && (
      poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      poll.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  // Sort by newest first
  const sortedPolls = [...filteredPolls].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  // Sort by most popular
  const popularPolls = [...filteredPolls].sort((a, b) => 
    b.totalVotes - a.totalVotes
  );
  
  // Sort by ending soon
  const endingSoonPolls = [...filteredPolls]
    .filter(poll => poll.endDate !== null)
    .sort((a, b) => {
      if (!a.endDate || !b.endDate) return 0;
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Available Polls</h1>
        <p className="text-muted-foreground">
          Participate in active polls and make your voice heard
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for polls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            All Polls ({sortedPolls.length})
          </TabsTrigger>
          <TabsTrigger value="popular">
            Most Popular
          </TabsTrigger>
          <TabsTrigger value="ending">
            Ending Soon
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {sortedPolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No active polls found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPolls.map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          {popularPolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No popular polls found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPolls.slice(0, 6).map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ending">
          {endingSoonPolls.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No polls ending soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {endingSoonPolls.slice(0, 6).map((poll) => (
                <PollCard key={poll.id} poll={poll} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
