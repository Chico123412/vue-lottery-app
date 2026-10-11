export interface Participant {
  id: string;
  name: string;
  birthDate: string;
  email: string;
  phone: string;
}

export type ParticipantDraft = Omit<Participant, "id">;

export interface ParticipantErrors {
  name?: string;
  birthDate?: string;
  email?: string;
  phone?: string;
}

export type SortField = "name" | "birthDate";
export type SortDirection = "asc" | "desc";
