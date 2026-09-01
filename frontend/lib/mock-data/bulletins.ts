export interface BulletinSubjectScore {
  subject: string;
  score: number;
  comment: string;
}

export interface Bulletin {
  id: string;
  studentId: string;
  term: string;
  subjects: BulletinSubjectScore[];
  teacherComment: string;
}

export function computeAverage(subjects: BulletinSubjectScore[]): number {
  if (subjects.length === 0) return 0;
  const total = subjects.reduce((sum, s) => sum + s.score, 0);
  return Math.round((total / subjects.length) * 10) / 10;
}

export const bulletins: Bulletin[] = [
  {
    id: "blt-1",
    studentId: "std-1",
    term: "Trimestre 1 - 2026",
    subjects: [
      { subject: "Grammar", score: 15, comment: "Bon travail" },
      { subject: "Listening", score: 13, comment: "À améliorer" },
      { subject: "Speaking", score: 16, comment: "Très bonne participation" },
      { subject: "Writing", score: 14, comment: "Progrès réguliers" },
    ],
    teacherComment: "Élève sérieuse, continue ainsi.",
  },
  {
    id: "blt-2",
    studentId: "std-2",
    term: "Trimestre 1 - 2026",
    subjects: [
      { subject: "Grammar", score: 9, comment: "Bases à consolider" },
      { subject: "Listening", score: 8, comment: "Manque de pratique" },
      { subject: "Speaking", score: 10, comment: "Encourager la prise de parole" },
      { subject: "Writing", score: 7, comment: "Beaucoup de fautes" },
    ],
    teacherComment: "Doit fournir plus d'efforts à la maison.",
  },
  {
    id: "blt-3",
    studentId: "std-3",
    term: "Trimestre 1 - 2026",
    subjects: [
      { subject: "Grammar", score: 18, comment: "Excellent" },
      { subject: "Listening", score: 17, comment: "Très bonne compréhension" },
      { subject: "Speaking", score: 19, comment: "Fluide et naturel" },
      { subject: "Writing", score: 17, comment: "Vocabulaire riche" },
    ],
    teacherComment: "Niveau avancé confirmé, félicitations.",
  },
  {
    id: "blt-4",
    studentId: "std-4",
    term: "Trimestre 1 - 2026",
    subjects: [
      { subject: "Grammar", score: 11, comment: "Correct" },
      { subject: "Listening", score: 12, comment: "Bonne écoute" },
      { subject: "Speaking", score: 10, comment: "Manque de confiance" },
      { subject: "Writing", score: 11, comment: "Structure à travailler" },
    ],
    teacherComment: "Bon potentiel, à encourager à l'oral.",
  },
  {
    id: "blt-5",
    studentId: "std-5",
    term: "Trimestre 1 - 2026",
    subjects: [
      { subject: "Grammar", score: 14, comment: "Solide" },
      { subject: "Listening", score: 15, comment: "Très attentive" },
      { subject: "Speaking", score: 13, comment: "En progrès" },
      { subject: "Writing", score: 14, comment: "Régulière" },
    ],
    teacherComment: "Bon trimestre dans l'ensemble.",
  },
];
