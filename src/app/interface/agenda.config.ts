export interface Agenda {
  title: string;
  id: any;
  description: string;
  starts: Date;
  ends: Date;
  priority?: string;
  location?: {
    name: string;
    address: string;
  };
  tags?: string[];
  status: boolean;
}
