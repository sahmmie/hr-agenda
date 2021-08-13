export interface agenda {
  title: string;
  id: any;
  description: string;
  startDate: Date;
  endDate: Date;
  priority?: string;
  location?: {
    name: string;
    address: string;
  };
  tags?: string[];
  status: boolean;
}
