import Link from 'next/link';
import type { NoteTag } from '@/types/note';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
export default function NotesSidebar() {
  return (
    <>
      <Link href="/notes/create">Create note</Link>

      <ul>
        <li>
          <Link href="/notes/filter/all">All notes</Link>
        </li>

        {TAGS.map(tag => (
          <li key={tag}>
            <Link href={`/notes/filter/${tag}`}>{tag}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
