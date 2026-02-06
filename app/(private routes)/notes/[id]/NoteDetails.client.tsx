'use client';

type Props = { id: string };

export default function NoteDetailsClient({ id }: Props) {
  return (
    <main>
      <h1>Note details</h1>
      <p>id: {id}</p>
    </main>
  );
}
