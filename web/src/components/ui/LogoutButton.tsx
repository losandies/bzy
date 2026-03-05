'use client';

import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-black px-4 py-2 text-white"
    >
      Log Out
    </button>
  );
}
