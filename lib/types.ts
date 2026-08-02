export type DepartmentId = 'cse' | 'ece' | 'eee';

export interface Branch {
  id: string;
  name: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  branches: Branch[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  branchId: string;
  year: number; // 1 to 4
  semester: number; // 1 to 8
  credits: number;
  type: 'theory' | 'lab' | 'project' | 'seminar' | 'viva';
}

export type ExamType = 'mid-sem' | 'end-sem';

export interface ResourceBase {
  id: string;
  subjectId: string;
  title: string;
  authorName: string;
  batch?: string;
  unit?: string;
  upvotes: number;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface ClassNote extends ResourceBase {
  type: 'note';
  pdfUrl: string;
  badges: string[]; // e.g., ['Faculty Verified', 'Topper Note']
}

export interface PYQ extends ResourceBase {
  type: 'pyq';
  examType: ExamType;
  year: string; // e.g., '2023'
  pdfUrl: string;
}

export interface VideoLecture extends ResourceBase {
  type: 'video';
  videoUrl: string;
}

export interface LabManual extends ResourceBase {
  type: 'lab';
  pdfUrl: string;
  codeSnippet?: string;
  vivaQuestions?: string[];
}

export type Resource = ClassNote | PYQ | VideoLecture | LabManual;
