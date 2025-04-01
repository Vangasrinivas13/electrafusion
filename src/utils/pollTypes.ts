
export type VotingMethod = 'single-choice' | 'multiple-choice' | 'ranked-choice';

export type PollStatus = 'draft' | 'active' | 'closed';

export type ElectionType = 'general' | 'mp' | 'local' | 'referendum';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  party?: string;
  candidateInfo?: string;
}

export interface Vote {
  id: string;
  pollId: string;
  timestamp: Date;
  selections: string[] | { [key: string]: number }; // For single/multiple choice or ranked choice
  anonymous: boolean;
  verificationCode: string;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  startDate: Date;
  endDate: Date | null;
  options: PollOption[];
  votingMethod: VotingMethod;
  allowAnonymous: boolean;
  requireVerification: boolean;
  status: PollStatus;
  restrictedToRegion?: string;
  totalVotes: number;
  electionType?: ElectionType;
  constituency?: string;
}

export interface UserRole {
  isAdmin: boolean;
  isVoter: boolean;
}
