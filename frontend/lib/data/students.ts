import { students, type Student } from "@/lib/mock-data/students";

// TODO: remplacer par un appel à l'API Spring Boot d'Othniel quand elle sera prête.
export async function getStudents(): Promise<Student[]> {
  return students;
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return students.find((s) => s.id === id);
}
