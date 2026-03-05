'use client';

import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LogoutButton from '@/components/ui/LogoutButton';

export default function SignUpPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoaded) {
    return null;
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    setIsSubmitting(true);

    try {
      // 1) Create the Clerk sign-up attempt
      await signUp!.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      // 2) Send email verification code
      await signUp!.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setPendingVerification(true);
      setStatusMsg('Verification code sent. Check your email.');
    } catch (err: any) {
      console.error('signUp.create() failed:', err);
      setError(err?.errors?.[0]?.message ?? 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);
    setIsSubmitting(true);

    try {
      // 3) Verify the code
      const result = await signUp!.attemptEmailAddressVerification({
        code: verificationCode,
      });

      console.log('Verification result:', result);

      // If not complete, tell user what is missing
      if (result.status !== 'complete') {
        setError(`Verification not complete. Status: ${result.status}`);
        return;
      }

      // 4) Activate session (this is what "finalizes" the login)
      await setActive!({ session: result.createdSessionId });

      // 5) Sync user to your database (works even without webhooks)
      const res = await fetch('/api/user', { method: 'POST' });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`DB sync failed: ${res.status} ${text}`);
      }

      setStatusMsg('Account created. Redirecting...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Verification failed:', err);
      setError(
        err?.errors?.[0]?.message ?? err?.message ?? 'Verification failed.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Screen 2: verification
  if (pendingVerification) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <form onSubmit={handleVerify} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-semibold">Verify your email</h1>

          <p className="text-sm text-neutral-600">
            Enter the code we emailed to
            {' '}
            <span className="font-medium">{emailAddress}</span>
          </p>

          <input
            className="w-full rounded border p-2"
            placeholder="Verification code"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
          />

          <button
            type="submit"
            disabled={isSubmitting || verificationCode.trim().length === 0}
            className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Verifying...' : 'Verify & Create Account'}
          </button>

          {statusMsg && <p className="text-sm text-green-600">{statusMsg}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            className="text-sm text-neutral-600 underline"
            onClick={() => {
              setPendingVerification(false);
              setVerificationCode('');
              setError(null);
              setStatusMsg(null);
            }}
          >
            Go back
          </button>
        </form>
      </div>
    );
  }

  // Screen 1: signup form
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={handleSignUp} className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <input
          className="w-full rounded border p-2"
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          autoComplete="given-name"
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          autoComplete="family-name"
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Email"
          type="email"
          value={emailAddress}
          onChange={e => setEmailAddress(e.target.value)}
          autoComplete="email"
          required
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Creating...' : 'Sign Up'}
        </button>

        {statusMsg && <p className="text-sm text-green-600">{statusMsg}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
      <LogoutButton />
    </div>
  );
}
