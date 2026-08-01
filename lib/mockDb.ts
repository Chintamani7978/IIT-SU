import { Department, Subject, Resource } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cse',
    name: 'Department of Computer Science & Engineering',
    branches: [
      { id: 'cse-core', name: 'CSE (Core)' },
      { id: 'cse-aiml', name: 'CSE - AI/ML' },
      { id: 'cse-ics', name: 'CSE - ICS' }
    ]
  },
  {
    id: 'ece',
    name: 'Department of Electronics & Communication Engineering',
    branches: [
      { id: 'ece', name: 'ECE' }
    ]
  },
  {
    id: 'eee',
    name: 'Department of Electrical & Electronics Engineering',
    branches: [
      { id: 'eee', name: 'EEE' }
    ]
  }
];

export const SUBJECTS: Subject[] = [
  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester I (Year 1)
  // ═══════════════════════════════════════════════════
  { id: 'mac111', name: 'Mathematics-I', code: 'MAC111', branchId: 'cse-core', year: 1, semester: 1, credits: 4, type: 'theory' },
  { id: 'phc112', name: 'Physics-I', code: 'PHC112', branchId: 'cse-core', year: 1, semester: 1, credits: 3, type: 'theory' },
  { id: 'csc113', name: 'Programming in C', code: 'CSC113', branchId: 'cse-core', year: 1, semester: 1, credits: 3, type: 'theory' },
  { id: 'eec114', name: 'Basic Electrical Engineering', code: 'EEC114', branchId: 'cse-core', year: 1, semester: 1, credits: 3, type: 'theory' },
  { id: 'hsc115', name: 'Communicative English', code: 'HSC115', branchId: 'cse-core', year: 1, semester: 1, credits: 3, type: 'theory' },
  { id: 'eel116', name: 'Basic Electrical Lab', code: 'EEL116', branchId: 'cse-core', year: 1, semester: 1, credits: 2, type: 'lab' },
  { id: 'csl117', name: 'Programming in C Lab', code: 'CSL117', branchId: 'cse-core', year: 1, semester: 1, credits: 2, type: 'lab' },
  { id: 'phl118', name: 'Physics Lab', code: 'PHL118', branchId: 'cse-core', year: 1, semester: 1, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester II (Year 1)
  // ═══════════════════════════════════════════════════
  { id: 'mac121', name: 'Mathematics-II', code: 'MAC121', branchId: 'cse-core', year: 1, semester: 2, credits: 4, type: 'theory' },
  { id: 'phc122', name: 'Physics-II', code: 'PHC122', branchId: 'cse-core', year: 1, semester: 2, credits: 4, type: 'theory' },
  { id: 'ecc123', name: 'Basic Electronics', code: 'ECC123', branchId: 'cse-core', year: 1, semester: 2, credits: 3, type: 'theory' },
  { id: 'csc124', name: 'Data Structures using C', code: 'CSC124', branchId: 'cse-core', year: 1, semester: 2, credits: 3, type: 'theory' },
  { id: 'hsc125', name: 'Environmental Studies (Non-Credit)', code: 'HSC125', branchId: 'cse-core', year: 1, semester: 2, credits: 0, type: 'theory' },
  { id: 'ecl126', name: 'Basic Electronics Lab', code: 'ECL126', branchId: 'cse-core', year: 1, semester: 2, credits: 2, type: 'lab' },
  { id: 'edc127', name: 'Engineering Graphics Lab', code: 'EDC127', branchId: 'cse-core', year: 1, semester: 2, credits: 2, type: 'lab' },
  { id: 'csl128', name: 'Data Structures using C Lab', code: 'CSL128', branchId: 'cse-core', year: 1, semester: 2, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester III (Year 2)
  // ═══════════════════════════════════════════════════
  { id: 'mac231', name: 'Mathematics-III', code: 'MAC231', branchId: 'cse-core', year: 2, semester: 3, credits: 4, type: 'theory' },
  { id: 'ecc232', name: 'Data Communication', code: 'ECC232', branchId: 'cse-core', year: 2, semester: 3, credits: 3, type: 'theory' },
  { id: 'csc233', name: 'Object Oriented Programming', code: 'CSC233', branchId: 'cse-core', year: 2, semester: 3, credits: 3, type: 'theory' },
  { id: 'ecc234', name: 'Digital Circuits and Systems', code: 'ECC234', branchId: 'cse-core', year: 2, semester: 3, credits: 3, type: 'theory' },
  { id: 'csc235', name: 'Computer Organization and Architecture', code: 'CSC235', branchId: 'cse-core', year: 2, semester: 3, credits: 4, type: 'theory' },
  { id: 'csl236', name: 'Object Oriented Programming Lab', code: 'CSL236', branchId: 'cse-core', year: 2, semester: 3, credits: 2, type: 'lab' },
  { id: 'ecl237', name: 'Digital Circuits Lab', code: 'ECL237', branchId: 'cse-core', year: 2, semester: 3, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester IV (Year 2)
  // ═══════════════════════════════════════════════════
  { id: 'mac241', name: 'Mathematics-IV', code: 'MAC241', branchId: 'cse-core', year: 2, semester: 4, credits: 4, type: 'theory' },
  { id: 'ecc242', name: 'Microprocessors & Microcontrollers', code: 'ECC242', branchId: 'cse-core', year: 2, semester: 4, credits: 3, type: 'theory' },
  { id: 'hsc243', name: 'Organizational Behavior', code: 'HSC243', branchId: 'cse-core', year: 2, semester: 4, credits: 3, type: 'theory' },
  { id: 'csc244', name: 'Analysis and Design of Algorithms', code: 'CSC244', branchId: 'cse-core', year: 2, semester: 4, credits: 3, type: 'theory' },
  { id: 'csc245', name: 'Operating Systems', code: 'CSC245', branchId: 'cse-core', year: 2, semester: 4, credits: 4, type: 'theory' },
  { id: 'ecl246', name: 'Analysis and Design of Algorithms Lab', code: 'ECL246', branchId: 'cse-core', year: 2, semester: 4, credits: 2, type: 'lab' },
  { id: 'csl247', name: 'Microprocessors & Microcontrollers Lab', code: 'CSL247', branchId: 'cse-core', year: 2, semester: 4, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester V (Year 3)
  // ═══════════════════════════════════════════════════
  { id: 'mac351', name: 'Discrete Mathematics', code: 'MAC351', branchId: 'cse-core', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'csc352', name: 'Theory of Computation', code: 'CSC352', branchId: 'cse-core', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'csc353', name: 'Database Management Systems', code: 'CSC353', branchId: 'cse-core', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'hsc354', name: 'Engineering Economics', code: 'HSC354', branchId: 'cse-core', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'csl355', name: 'Database Management System Lab', code: 'CSL355', branchId: 'cse-core', year: 3, semester: 5, credits: 2, type: 'lab' },
  { id: 'csl356', name: 'Web Technology Lab', code: 'CSL356', branchId: 'cse-core', year: 3, semester: 5, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester VI (Year 3)
  // ═══════════════════════════════════════════════════
  { id: 'csc361', name: 'Computer Networks', code: 'CSC361', branchId: 'cse-core', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'csc362', name: 'Software Engineering', code: 'CSC362', branchId: 'cse-core', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'csl363', name: 'Computer Network Lab', code: 'CSL363', branchId: 'cse-core', year: 3, semester: 6, credits: 2, type: 'lab' },
  { id: 'csl364', name: 'Software Engineering Lab', code: 'CSL364', branchId: 'cse-core', year: 3, semester: 6, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester VII (Year 4)
  // ═══════════════════════════════════════════════════
  { id: 'csc471', name: 'Data Warehousing and Data Mining', code: 'CSC471', branchId: 'cse-core', year: 4, semester: 7, credits: 3, type: 'theory' },
  { id: 'csc472', name: 'Compiler Design', code: 'CSC472', branchId: 'cse-core', year: 4, semester: 7, credits: 3, type: 'theory' },
  { id: 'csp473', name: 'Minor Project', code: 'CSP473', branchId: 'cse-core', year: 4, semester: 7, credits: 4, type: 'project' },
  { id: 'css474', name: 'Seminar', code: 'CSS474', branchId: 'cse-core', year: 4, semester: 7, credits: 2, type: 'seminar' },

  // ═══════════════════════════════════════════════════
  // CSE CORE - Semester VIII (Year 4)
  // ═══════════════════════════════════════════════════
  { id: 'csp482', name: 'Major Project', code: 'CSP482', branchId: 'cse-core', year: 4, semester: 8, credits: 8, type: 'project' },
  { id: 'csv483', name: 'Comprehensive Viva Voce', code: 'CSV483', branchId: 'cse-core', year: 4, semester: 8, credits: 2, type: 'viva' },

  // ═══════════════════════════════════════════════════
  // CSE AI/ML - Semester V (Year 3) - Specialized
  // ═══════════════════════════════════════════════════
  { id: 'aiml301', name: 'Machine Learning Foundations', code: 'AIML301', branchId: 'cse-aiml', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'aiml302', name: 'Linear Algebra for ML', code: 'AIML302', branchId: 'cse-aiml', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'aiml303', name: 'Python for Data Science', code: 'AIML303', branchId: 'cse-aiml', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'aiml304', name: 'Machine Learning Lab', code: 'AIML304', branchId: 'cse-aiml', year: 3, semester: 5, credits: 2, type: 'lab' },

  // CSE AI/ML - Semester VI (Year 3) - Specialized
  { id: 'aiml311', name: 'Deep Learning', code: 'AIML311', branchId: 'cse-aiml', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'aiml312', name: 'Natural Language Processing', code: 'AIML312', branchId: 'cse-aiml', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'aiml313', name: 'Computer Vision', code: 'AIML313', branchId: 'cse-aiml', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'aiml314', name: 'Deep Learning Lab', code: 'AIML314', branchId: 'cse-aiml', year: 3, semester: 6, credits: 2, type: 'lab' },

  // CSE AI/ML - Semester VII (Year 4) - Specialized
  { id: 'aiml401', name: 'Reinforcement Learning', code: 'AIML401', branchId: 'cse-aiml', year: 4, semester: 7, credits: 3, type: 'theory' },
  { id: 'aiml402', name: 'Generative AI', code: 'AIML402', branchId: 'cse-aiml', year: 4, semester: 7, credits: 3, type: 'theory' },

  // CSE AI/ML - Semester VIII (Year 4) - Specialized
  { id: 'aiml411', name: 'AI Project', code: 'AIML411', branchId: 'cse-aiml', year: 4, semester: 8, credits: 8, type: 'project' },

  // ═══════════════════════════════════════════════════
  // CSE ICS - Semester V (Year 3) - Specialized
  // ═══════════════════════════════════════════════════
  { id: 'ics301', name: 'Network Security', code: 'ICS301', branchId: 'cse-ics', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'ics302', name: 'Cryptography', code: 'ICS302', branchId: 'cse-ics', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'ics303', name: 'Ethical Hacking', code: 'ICS303', branchId: 'cse-ics', year: 3, semester: 5, credits: 3, type: 'theory' },
  { id: 'ics304', name: 'Security Lab', code: 'ICS304', branchId: 'cse-ics', year: 3, semester: 5, credits: 2, type: 'lab' },

  // CSE ICS - Semester VI (Year 3) - Specialized
  { id: 'ics311', name: 'Cyber Forensics', code: 'ICS311', branchId: 'cse-ics', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'ics312', name: 'Cloud Security', code: 'ICS312', branchId: 'cse-ics', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'ics313', name: 'Malware Analysis', code: 'ICS313', branchId: 'cse-ics', year: 3, semester: 6, credits: 3, type: 'theory' },
  { id: 'ics314', name: 'Forensics Lab', code: 'ICS314', branchId: 'cse-ics', year: 3, semester: 6, credits: 2, type: 'lab' },

  // CSE ICS - Semester VII (Year 4) - Specialized
  { id: 'ics401', name: 'Advanced Threat Detection', code: 'ICS401', branchId: 'cse-ics', year: 4, semester: 7, credits: 3, type: 'theory' },
  { id: 'ics402', name: 'Blockchain Security', code: 'ICS402', branchId: 'cse-ics', year: 4, semester: 7, credits: 3, type: 'theory' },

  // CSE ICS - Semester VIII (Year 4) - Specialized
  { id: 'ics411', name: 'Security Research Project', code: 'ICS411', branchId: 'cse-ics', year: 4, semester: 8, credits: 8, type: 'project' },

  // ═══════════════════════════════════════════════════
  // ECE - Sample Subjects
  // ═══════════════════════════════════════════════════
  { id: 'ece101', name: 'Signals and Systems', code: 'ECE101', branchId: 'ece', year: 2, semester: 3, credits: 4, type: 'theory' },
  { id: 'ece102', name: 'Analog Electronics', code: 'ECE102', branchId: 'ece', year: 2, semester: 3, credits: 3, type: 'theory' },
  { id: 'ece103', name: 'Analog Electronics Lab', code: 'ECE103', branchId: 'ece', year: 2, semester: 3, credits: 2, type: 'lab' },

  // ═══════════════════════════════════════════════════
  // EEE - Sample Subjects
  // ═══════════════════════════════════════════════════
  { id: 'eee101', name: 'Power Systems', code: 'EEE101', branchId: 'eee', year: 3, semester: 5, credits: 4, type: 'theory' },
  { id: 'eee102', name: 'Control Systems', code: 'EEE102', branchId: 'eee', year: 3, semester: 5, credits: 3, type: 'theory' },
];

export const SUBJECTS_FOR_BRANCH = (branchId: string): Subject[] => {
  return SUBJECTS.filter(s => s.branchId === branchId);
};

export const RESOURCES: Resource[] = [
  {
    id: 'res-1',
    type: 'note',
    subjectId: 'csc113',
    title: 'Unit 1: C Programming Basics Complete Notes',
    authorName: 'Rahul Sharma',
    batch: '2024',
    unit: 'Unit 1',
    upvotes: 45,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    pdfUrl: '#',
    badges: [],
  },
  {
    id: 'res-2',
    type: 'pyq',
    subjectId: 'csc124',
    title: 'Mid-Sem 2023 Data Structures Paper',
    authorName: 'Admin',
    batch: '2023',
    upvotes: 120,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    examType: 'mid-sem',
    year: '2023',
    pdfUrl: '#'
  },
  {
    id: 'res-3',
    type: 'video',
    subjectId: 'csc245',
    title: 'Operating Systems Concepts',
    authorName: 'Gate Smashers',
    unit: 'Unit 1',
    upvotes: 210,
    isVerified: true,
    status: 'approved',
    createdAt: new Date().toISOString(),
    videoUrl: 'https://www.youtube.com/embed/placeholder'
  }
];

export const getSubjectsByBranchAndYear = (branchId: string, year: number): Subject[] => {
  return SUBJECTS.filter(s => s.branchId === branchId && s.year === year);
};

export const getSubjectsByBranchYearSemester = (branchId: string, year: number, semester: number): Subject[] => {
  return SUBJECTS.filter(s => s.branchId === branchId && s.year === year && s.semester === semester);
};

export const getSubjectById = (subjectId: string): Subject | undefined => {
  return SUBJECTS.find(s => s.id === subjectId);
};

export const getResourcesBySubjectId = (subjectId: string): Resource[] => {
  return RESOURCES.filter(r => r.subjectId === subjectId && r.status === 'approved');
};

export const getPendingResources = (): Resource[] => {
  return RESOURCES.filter(r => r.status === 'pending');
};

export const addResource = (resource: Resource): void => {
  RESOURCES.push(resource);
};

export const upvoteResource = (resourceId: string): void => {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (resource) {
    resource.upvotes += 1;
  }
};

export const approveResource = (resourceId: string): void => {
  const resource = RESOURCES.find(r => r.id === resourceId);
  if (resource) {
    resource.status = 'approved';
    resource.isVerified = true;
  }
};

export const searchCatalog = (query: string): { subjects: Subject[]; resources: (Resource & { subjectName?: string; subjectCode?: string })[] } => {
  const q = query.toLowerCase();
  const subjects = SUBJECTS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  ).slice(0, 8);
  const resources = RESOURCES.filter((r) => r.status === 'approved' && r.title.toLowerCase().includes(q))
    .slice(0, 8)
    .map((r) => {
      const subject = SUBJECTS.find((s) => s.id === r.subjectId);
      return { ...r, subjectName: subject?.name, subjectCode: subject?.code };
    });
  return { subjects, resources };
};
