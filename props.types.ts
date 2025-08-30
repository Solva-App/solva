interface userI {
  id: number;
  fullName: string;
  email: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  isSuspended: boolean;
}

export interface DocumentType {
  id: number;
  name: string;
  url: string;
  mimetype: string;
  createdAt: string;
  updatedAt: string;
  status?: string;
  requiresApproval?: boolean;
}

export interface QuestionDetails {
  id: number;
  title: string;
  courseCode: string;
  department: string;
  faculty: string;
  university: string;
  owner: number;
  createdAt: string;
  updatedAt: string;
  requiresApproval?: boolean;
  status?: string;
}

export interface QuestionType {
  document: DocumentType[];
  question: QuestionDetails;
}

