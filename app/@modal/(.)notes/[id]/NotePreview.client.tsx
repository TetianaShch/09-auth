'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';

type Props = { id: string };

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();
  const handleClose = () => router.back();

  const {
    data: note,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (
    <Modal onClose={handleClose}>
      <button type="button" onClick={handleClose}>
        Close
      </button>

      <h2>{note.title}</h2>
      <p>{note.tag}</p>
      <p>{note.content}</p>
      <p>{note.createdAt}</p>
    </Modal>
  );
}
