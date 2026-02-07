import { api } from './api';
import type { Note } from '@/types/note';
import type { FetchNotesResponse, FetchNotesParams } from '@/types/note';
import type { User } from '@/types/user';

type AuthCredentials = {
    email: string;
    password: string;
};

export async function fetchNotes(params: FetchNotesParams) {
    const { data } = await api.get<FetchNotesResponse>('/notes', { params });
    return data;
}

export async function fetchNoteById(id: string) {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
}

export async function createNote(payload: Pick<Note, 'title' | 'content' | 'tag'>) {
    const { data } = await api.post<Note>('/notes', payload);
    return data;
}

export async function deleteNote(id: string) {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
}

export async function register(payload: AuthCredentials) {
    const { data } = await api.post<User>('/auth/register', payload);
    return data;
}


export async function login(payload: AuthCredentials) {
    const { data } = await api.post<User>('/auth/login', payload);
    return data;
}

export async function logout() {
    await api.post('/auth/logout');
}

export async function checkSession() {
    const { data } = await api.get<User | undefined>('/auth/session');
    return data;
}


export async function getMe() {
    const { data } = await api.get<User>('/users/me');
    return data;
}

export type UpdateMePayload = Partial<Pick<User, 'username' | 'avatar'>>;

export async function updateMe(payload: UpdateMePayload) {
    const { data } = await api.patch<User>('/users/me', payload);
    return data;
}

