import { bulletins, type Bulletin } from "@/lib/mock-data/bulletins";
import { students } from "@/lib/mock-data/students";

export interface BulletinWithStudent extends Bulletin {
  studentFirstName: string;
  studentLastName: string;
}

// TODO: remplacer par un appel à l'API Spring Boot d'Othniel quand elle sera prête.
export async function getBulletins(): Promise<BulletinWithStudent[]> {
  return bulletins.map((b) => {
    const student = students.find((s) => s.id === b.studentId);
    return {
      ...b,
      studentFirstName: student?.firstName ?? "?",
      studentLastName: student?.lastName ?? "?",
    };
  });
}
