export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export type FetchNotesParams = {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
};