export interface DatabaseSchema {
  users: UsersTable;
  unemployment_verifications: UnemploymentVerificationsTable;
}

export interface UsersTable {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  employment_status: 'unemployed' | 'employed' | 'pending_verification';
  unemployment_verification_status: 'pending' | 'verified' | 'rejected';
  unemployment_start_date: string | null;
  previous_employer: string | null;
  previous_job_title: string | null;
  verification_documents: string | null;
  fol_balance: number;
  created_at: string;
  updated_at: string;
}

export interface UnemploymentVerificationsTable {
  id: number;
  user_id: number;
  document_type: string;
  document_url: string;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}