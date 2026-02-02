'use client';

import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal/Modal';

type Props = { id: string };

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();
  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      <button type="button" onClick={handleClose}>
        Close
      </button>

      <h2>Note title</h2>
      <p>Note tag</p>
      <p>Note content</p>
      <p>Created at</p>
    </Modal>
  );
}
