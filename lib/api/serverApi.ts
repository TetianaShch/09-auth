import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { api } from './api';
import type { Note } from '@/types/note';
import type { FetchNotesParams, FetchNotesResponse } from '@/types/note';
import type { User } from '@/types/user';

function withCookies(cookies: string): AxiosRequestConfig {
    return {
        headers: {
            Cookie: cookies,
        },
    };
}

export async function fetchNotes(params: FetchNotesParams, cookies: string) {
    const { data } = await api.get<FetchNotesResponse>('/notes', {
        ...withCookies(cookies),
        params,
    });
    return data;
}

export async function fetchNoteById(id: string, cookies: string) {
    const { data } = await api.get<Note>(`/notes/${id}`, withCookies(cookies));
    return data;
}

export async function getMe(cookies: string) {
    const { data } = await api.get<User>('/users/me', withCookies(cookies));
    return data;
}

export async function checkSession(cookies: string): Promise<AxiosResponse<User | undefined>> {
    return api.get<User | undefined>('/auth/session', withCookies(cookies));
}

