export interface agenda {
  title: string;
  id: any;
  description: string;
  startDate: Date;
  endDate: Date;
  pirority?: string;
  location?: {
    name: string;
    address: string;
  };
  tags?: string[];
  status: boolean;
}
