import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CompatibilityReportInterface {
  id?: string;
  report?: string;
  user_id1?: string;
  user_id2?: string;
  created_at?: any;
  updated_at?: any;

  user_compatibility_report_user_id1Touser?: UserInterface;
  user_compatibility_report_user_id2Touser?: UserInterface;
  _count?: {};
}

export interface CompatibilityReportGetQueryInterface extends GetQueryInterface {
  id?: string;
  report?: string;
  user_id1?: string;
  user_id2?: string;
}
