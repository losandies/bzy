/* eslint-disable style/operator-linebreak */
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { prisma } from '@/lib/prisma';

type ClerkEvent = {
  type: string;
  data: any;
};

export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret)
    // eslint-disable-next-line curly
    return new Response('Missing CLERK_WEBHOOK_SECRET', { status: 500 });

  // Raw body required for signature verification
  const payload = await req.text();

  const h = await headers();
  const svix_id = h.get('svix-id');
  const svix_timestamp = h.get('svix-timestamp');
  const svix_signature = h.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing Svix headers', { status: 400 });
  }

  let evt: ClerkEvent;

  try {
    const wh = new Webhook(secret);
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as ClerkEvent;
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  const { type, data } = evt;

  try {
    if (type === 'user.created' || type === 'user.updated') {
      const clerkId = data.id as string;

      const email =
        data.email_addresses?.find(
          (e: any) => e.id === data.primary_email_address_id,
        )?.email_address ??
        data.email_addresses?.[0]?.email_address ??
        null;

      const firstName = data.first_name ?? null;
      const lastName = data.last_name ?? null;

      await prisma.user.upsert({
        where: { clerkId },
        update: { email, firstName, lastName },
        create: { clerkId, email, firstName, lastName },
      });

      return new Response('User synced', { status: 200 });
    }

    if (type === 'user.deleted') {
      const clerkId = data.id as string;
      await prisma.user.deleteMany({ where: { clerkId } });
      return new Response('User deleted', { status: 200 });
    }

    return new Response('Ignored', { status: 200 });
  } catch (err) {
    console.error('DB op failed:', err);
    return new Response('Server error', { status: 500 });
  }
}
