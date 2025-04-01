
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Poll, PollOption, VotingMethod } from '@/utils/pollTypes';
import { MOCK_POLLS } from '@/utils/auth';

const generateId = () => {
  return Math.random().toString(36).substring(2, 9);
};

const PollForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<{ id: string; text: string }[]>([
    { id: generateId(), text: '' },
    { id: generateId(), text: '' },
  ]);
  const [votingMethod, setVotingMethod] = useState<VotingMethod>('single-choice');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [requireVerification, setRequireVerification] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddOption = () => {
    setOptions([...options, { id: generateId(), text: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      toast({
        title: 'Error',
        description: 'A poll must have at least two options',
        variant: 'destructive',
      });
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions(
      options.map(option => (option.id === id ? { ...option, text } : option))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a poll title',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const validOptions = options.filter(option => option.text.trim() !== '');
    if (validOptions.length < 2) {
      toast({
        title: 'Error',
        description: 'Please enter at least two options',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Create new poll object
    const newPoll: Poll = {
      id: generateId(),
      title,
      description,
      createdBy: '1', // Using a mock user ID
      createdAt: new Date(),
      startDate: startDate || new Date(),
      endDate: endDate || null,
      options: validOptions.map(option => ({
        id: option.id,
        text: option.text,
        votes: 0,
      })),
      votingMethod,
      allowAnonymous,
      requireVerification,
      status: 'active',
      totalVotes: 0,
    };

    // In a real app, this would be an API call
    setTimeout(() => {
      MOCK_POLLS.push(newPoll);
      
      toast({
        title: 'Success',
        description: 'Poll created successfully',
      });
      
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Set up the details for your new voting poll
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title</Label>
            <Input
              id="title"
              placeholder="Enter poll title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter poll description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Poll Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            {options.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Input
                  placeholder="Option text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveOption(option.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="votingMethod">Voting Method</Label>
              <Select
                value={votingMethod}
                onValueChange={(value) => setVotingMethod(value as VotingMethod)}
              >
                <SelectTrigger id="votingMethod">
                  <SelectValue placeholder="Select voting method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-choice">Single Choice</SelectItem>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="ranked-choice">Ranked Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Select start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "No end date (ongoing)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label htmlFor="allowAnonymous">Allow Anonymous Voting</Label>
                <Switch
                  id="allowAnonymous"
                  checked={allowAnonymous}
                  onCheckedChange={setAllowAnonymous}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="requireVerification">Require Verification</Label>
                <Switch
                  id="requireVerification"
                  checked={requireVerification}
                  onCheckedChange={setRequireVerification}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating Poll..." : "Create Poll"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PollForm;
