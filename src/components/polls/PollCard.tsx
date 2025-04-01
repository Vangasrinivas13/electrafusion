
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Poll } from '@/utils/pollTypes';
import { ChevronRight, Clock, CheckSquare, Users } from 'lucide-react';

interface PollCardProps {
  poll: Poll;
  showVoteButton?: boolean;
}

const PollCard = ({ poll, showVoteButton = true }: PollCardProps) => {
  const isActive = poll.status === 'active';
  const isDraft = poll.status === 'draft';
  const isClosed = poll.status === 'closed';
  
  // Format the date
  const formatDate = (date: Date | null) => {
    if (!date) return 'No end date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate time remaining (if active)
  const getTimeRemaining = () => {
    if (!poll.endDate || !isActive) return null;
    
    const now = new Date();
    const end = new Date(poll.endDate);
    const diffTime = end.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Ended';
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} left`;
    
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} left`;
    
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} left`;
  };

  // Get the leading option
  const getLeadingOption = () => {
    if (poll.options.length === 0) return null;
    
    const sorted = [...poll.options].sort((a, b) => b.votes - a.votes);
    return sorted[0];
  };

  const leadingOption = getLeadingOption();
  const timeRemaining = getTimeRemaining();

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{poll.title}</CardTitle>
          <Badge variant={isActive ? "default" : isDraft ? "outline" : "secondary"}>
            {isActive ? "Active" : isDraft ? "Draft" : "Closed"}
          </Badge>
        </div>
        <CardDescription>{poll.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          {isActive && timeRemaining && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{timeRemaining}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</span>
          </div>
          
          {leadingOption && poll.totalVotes > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Leading: {leadingOption.text}</span>
                <span className="font-medium">
                  {Math.round((leadingOption.votes / poll.totalVotes) * 100)}%
                </span>
              </div>
              <Progress value={(leadingOption.votes / poll.totalVotes) * 100} className="h-2" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-sm text-muted-foreground">
          {isActive && poll.endDate 
            ? `Ends ${formatDate(poll.endDate)}` 
            : isClosed ? `Ended ${formatDate(poll.endDate)}` : null
          }
        </div>
        {showVoteButton && isActive && (
          <Link to={`/polls/${poll.id}`}>
            <Button>
              <CheckSquare className="h-4 w-4 mr-2" />
              Vote
            </Button>
          </Link>
        )}
        {!showVoteButton && (
          <Link to={`/polls/${poll.id}`}>
            <Button variant="outline">
              View Results
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;
