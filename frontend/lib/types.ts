export type Challenge = {
  description: string;
  id?: string;
  wagerAmount: number;
  participants: string[];
  judges: string[];
  activity: string;
  completionTimeUnit: string;
  amountOfActivityPerUnit: number;
  duration: number;
}