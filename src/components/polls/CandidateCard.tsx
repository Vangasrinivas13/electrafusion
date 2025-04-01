
import { PollOption } from '@/utils/pollTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Award } from 'lucide-react';

interface CandidateCardProps {
  candidate: PollOption;
  selected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

const CandidateCard = ({ candidate, selected, onSelect, disabled = false }: CandidateCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-primary' : 'hover:shadow-md'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect(candidate.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{candidate.text}</CardTitle>
            {candidate.party && (
              <Badge className="mt-1" variant={selected ? "default" : "outline"}>
                {candidate.party}
              </Badge>
            )}
          </div>
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {candidate.candidateInfo && (
          <CardDescription className="text-sm mt-2">
            {candidate.candidateInfo}
          </CardDescription>
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center text-sm text-muted-foreground">
          <Award className="h-4 w-4 mr-1" />
          <span>Current Votes: {candidate.votes}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;
