import { cookies } from 'next/headers';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] ?? 'all';

  const title = `Notes: ${filter} | NoteHub`;
  const description = `Notes filtered by: ${filter}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `http://localhost:3000/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Open Graph image',
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;

  const tag = slug?.[0] ?? 'all';
  const queryClient = new QueryClient();

  const cookieStore = await cookies();

  const cookie = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const queryKey = ['notes', { page: 1, perPage: 12, search: '', tag }];

  const queryParams = {
    page: 1,
    perPage: 12,
    search: '',
    ...(tag === 'all' ? {} : { tag }),
  };

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNotes(queryParams, cookie),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
