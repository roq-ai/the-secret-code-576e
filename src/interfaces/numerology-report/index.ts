import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface NumerologyReportInterface {
  id?: string;
  partial_report?: string;
  full_report?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface NumerologyReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  partial_report?: string;
  full_report?: string;
  user_id?: string;
}
