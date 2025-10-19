export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  salary_min: string;
  salary_max: string;
  employment_type: string;
  requirements: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  vacancy_id: string;
  first_name: string;
  last_name: string;
  email: string;
  resume_pdf?: string | null;
  resume_parsed?: Record<string, any> | null;
  matching_score?: number | null;
  matching_sections?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}
