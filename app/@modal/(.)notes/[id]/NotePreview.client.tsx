'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api/clientApi';
import type { Note } from '@/types/note';

type Props = { id: string };

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <p>Loading...</p>}

      {isError && <p>Something went wrong</p>}

      {note && (
        <>
          <h2>{note.title}</h2>
          <p>{note.content}</p>
          <p>{note.tag}</p>
        </>
      )}
    </Modal>
  );
}
