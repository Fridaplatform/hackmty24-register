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
}

export type { Team, Member };
