interface Member {
  email: string;
  major: string;
  name: string;
  studentId?: string;
  semester: string;
}

interface Team {
  uid: string;
  teamName: string;
  teamId: string;
  members: Member[];
  teamLeaderId: string;
  evaluatorCount: number;
  finalScore: number;
  categoryScores: Record<string, number> // id de la categoria y el valor
  evaluated?: boolean;
}


interface Category {
  id: string // se agrega en router de react router
  description: string;
  name: string;
  ponderation: number;
}

export type { Team, Member, Category };
