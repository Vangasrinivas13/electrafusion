
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/utils/auth';
import { MOCK_POLLS } from '@/utils/auth';
import { Poll, VotingMethod } from '@/utils/pollTypes';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import PollResults from '@/components/polls/PollResults';
import Navbar from '@/components/Navbar';
import { CheckSquare, ChevronLeft, Clock, AlertCircle } from 'lucide-react';

const ViewPoll = () => {
  const { pollId } = useParams<{ pollId: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);
  const [selections, setSelections] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch poll data
    const foundPoll = MOCK_POLLS.find(p => p.id === pollId);
    if (foundPoll) {
      setPoll(foundPoll);
      // Check if user has already voted (in a real app, this would be a server check)
      const hasVoted = localStorage.getItem(`voted_${pollId}`) === 'true';
      setVoted(hasVoted);
    }
    setLoading(false);
  }, [pollId, isAuthenticated, authLoading, navigate]);

  const handleSingleChoiceChange = (value: string) => {
    setSelections([value]);
  };

  const handleMultipleChoiceChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setSelections(prev => [...prev, optionId]);
    } else {
      setSelections(prev => prev.filter(id => id !== optionId));
    }
  };

  const handleSubmitVote = () => {
    if (!poll) return;
    
    if (selections.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one option',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    
    // Simulate API call to submit vote
    setTimeout(() => {
      // Update poll with new votes
      const updatedPoll = { ...poll };
      
      selections.forEach(optionId => {
        const option = updatedPoll.options.find(o => o.id === optionId);
        if (option) {
          option.votes += 1;
        }
      });
      
      updatedPoll.totalVotes += 1;
      
      // Update in MOCK_POLLS array
      const pollIndex = MOCK_POLLS.findIndex(p => p.id === poll.id);
      if (pollIndex !== -1) {
        MOCK_POLLS[pollIndex] = updatedPoll;
      }
      
      // Mark as voted in local storage
      localStorage.setItem(`voted_${pollId}`, 'true');
      
      toast({
        title: 'Success',
        description: 'Your vote has been recorded',
      });
      
      setVoted(true);
      setPoll(updatedPoll);
      setSubmitting(false);
    }, 500);
  };

  // Check if poll is active
  const isActive = poll?.status === 'active';
  const isPollEnded = poll?.endDate && new Date(poll.endDate) < new Date();

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-3xl font-bold mb-4">Poll Not Found</h1>
            <p className="text-xl text-muted-foreground mb-6">
              The poll you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/dashboard')}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-1">
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <h1 className="text-3xl font-bold mb-2 sm:mb-0">{poll.title}</h1>
              <Badge variant={isActive && !isPollEnded ? "default" : "secondary"}>
                {isActive && !isPollEnded ? "Active" : "Closed"}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-4">{poll.description}</p>
            
            {poll.endDate && (
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>
                  {new Date(poll.endDate) > new Date()
                    ? `Ends on ${new Date(poll.endDate).toLocaleDateString()}`
                    : `Ended on ${new Date(poll.endDate).toLocaleDateString()}`
                  }
                </span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Voting Form */}
            <Card className={voted || !isActive || isPollEnded ? "opacity-70" : ""}>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
                <CardDescription>
                  {voted
                    ? "You have already voted in this poll"
                    : !isActive || isPollEnded
                    ? "This poll is no longer accepting votes"
                    : `Select your ${poll.votingMethod === 'multiple-choice' ? 'choices' : 'choice'} below`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {poll.votingMethod === 'single-choice' && (
                  <RadioGroup
                    value={selections[0] || ""}
                    onValueChange={handleSingleChoiceChange}
                    disabled={voted || !isActive || isPollEnded}
                  >
                    <div className="space-y-3">
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={option.id} />
                          <Label htmlFor={option.id} className="cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
                
                {poll.votingMethod === 'multiple-choice' && (
                  <div className="space-y-3">
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selections.includes(option.id)}
                          onCheckedChange={(checked) => 
                            handleMultipleChoiceChange(option.id, checked as boolean)
                          }
                          disabled={voted || !isActive || isPollEnded}
                        />
                        <Label htmlFor={option.id} className="cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
                
                {poll.votingMethod === 'ranked-choice' && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Ranked choice voting will be available in a future update.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmitVote}
                  disabled={voted || !isActive || isPollEnded || selections.length === 0 || submitting}
                  className="w-full"
                >
                  {submitting ? (
                    "Submitting Vote..."
                  ) : (
                    <>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Submit Vote
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Results */}
            <PollResults poll={poll} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPoll;
