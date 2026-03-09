import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Role } from 'generated/prisma/enums';

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

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return new Response('Unauthorized', { status: 401 });
  }

  const client = await clerkClient();
  const clerkUser = await client.users.getUser(userId);

  const email =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    null;

  const firstName = clerkUser.firstName ?? null;
  const lastName = clerkUser.lastName ?? null;

  const clerkRole = clerkUser.unsafeMetadata?.role as
    | 'client'
    | 'provider'
    | undefined;

  console.log(clerkRole);

  const role = clerkRole === 'provider' ? Role.PROVIDER : Role.CLIENT;

  console.log(role);

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    update: { email, firstName, lastName, role },
    create: {
      clerkId: userId,
      email,
      firstName,
      lastName,
      role,
    },
  });

  console.log(user);

  return Response.json(user);
}
