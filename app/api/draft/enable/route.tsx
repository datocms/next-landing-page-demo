import { redirect } from 'next/dist/server/api-utils';
import { draftMode } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token !== process.env.DRAFT_SECRET_TOKEN)
    return new Response('Invalid token', { status: 401 });

  draftMode().enable();
  return new Response('Draft mode is enabled');
}
