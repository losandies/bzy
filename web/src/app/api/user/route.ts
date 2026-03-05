import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/user  -> returns the current user's DB row
export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  return Response.json(user);
}

// POST /api/user -> upserts (creates/updates) the current user in your DB
export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Pull user profile from Clerk
  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  const email
    = clerkUser.emailAddresses.find(
      e => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress
    ?? clerkUser.emailAddresses[0]?.emailAddress
    ?? null;

  const firstName = clerkUser.firstName ?? null;
  const lastName = clerkUser.lastName ?? null;

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, firstName, lastName },
    create: {
      clerkId: userId,
      email,
      firstName,
      lastName,
      // role defaults to CLIENT in your schema
    },
  });

  return Response.json(user);
}
