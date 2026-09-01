export type StudentLevel = "Débutant" | "Élémentaire" | "Intermédiaire" | "Avancé";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  level: StudentLevel;
  email: string;
  enrolledAt: string;
}

export const students: Student[] = [
  {
    id: "std-1",
    firstName: "Aïcha",
    lastName: "Koffi",
    level: "Intermédiaire",
    email: "aicha.koffi@example.com",
    enrolledAt: "2026-01-12",
  },
  {
    id: "std-2",
    firstName: "Jean",
    lastName: "N'Guessan",
    level: "Débutant",
    email: "jean.nguessan@example.com",
    enrolledAt: "2026-02-03",
  },
  {
    id: "std-3",
    firstName: "Fatou",
    lastName: "Diabaté",
    level: "Avancé",
    email: "fatou.diabate@example.com",
    enrolledAt: "2025-11-20",
  },
  {
    id: "std-4",
    firstName: "Kouadio",
    lastName: "Yao",
    level: "Élémentaire",
    email: "kouadio.yao@example.com",
    enrolledAt: "2026-03-15",
  },
  {
    id: "std-5",
    firstName: "Awa",
    lastName: "Traoré",
    level: "Intermédiaire",
    email: "awa.traore@example.com",
    enrolledAt: "2026-04-02",
  },
];
