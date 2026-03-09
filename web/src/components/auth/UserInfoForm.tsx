/* eslint-disable no-console */
/* eslint-disable no-useless-return */
/* eslint-disable style/arrow-parens */
/* eslint-disable style/jsx-one-expression-per-line */
import { useSignUp } from '@clerk/nextjs';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { EmailOTP } from './EmailOTP';
import { RoleSelectionInput } from './RoleSelectionInput';
import { SocialAuthButton } from './SocialAuthButton';

export function UserInfoForm() {
  const { signUp, isLoaded, setActive } = useSignUp();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'client' | 'provider' | null>(null);

  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSignup = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      setError(null);
      setIsSubmitting(true);

      console.log({
        firstName,
        lastName,
        emailAddress: email,
        password,
        role,
      });

      await signUp?.create({
        firstName,
        lastName,
        emailAddress: email,
        password,
        unsafeMetadata: {
          role,
        },
      });

      await signUp?.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      setStep('verify');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Sign up failed.');
      console.error('Signup Error', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async () => {
    console.log('verify clicked');
    console.log(code);
    if (!isLoaded || !signUp || !setActive) {
      return;
    }

    try {
      setError(null);
      setIsVerifying(true);

      console.log('attempting verification...');

      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status !== 'complete') {
        setError(
          `Verification not complete. Current Status: ${signUpAttempt.status}`,
        );
        return;
      }
      console.log('setting active session...');
      await setActive({ session: signUpAttempt.createdSessionId });

      console.log('syncing user to db...');
      const response = await fetch('/api/user', {
        method: 'POST',
      });

      console.log('api/user status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to sync user to database');
      }
    } catch (err: any) {
      setError(
        err?.errors?.[0]?.message ?? err?.message ?? 'Verification failed.',
      );
      console.error('Verification error', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;

    try {
      setError(null);

      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? 'Failed to resend code.');
    }
  };

  return (
    <div className="flex min-h-97.5 w-full">
      {step === 'signup' && (
        <form className="flex w-full">
          {/* Left Side */}
          <div className="ml-6 flex flex-1 flex-col gap-4">
            <div>
              <h2 className="mb-2 flex items-center gap-2 text-3xl">
                Get Started
              </h2>
              <p className="text-neutral-400">
                Create an account to get started.
              </p>
            </div>

            <div>
              <h2 className="text-xl">How would you like to use Bzy?</h2>

              <RoleSelectionInput
                accountType="client"
                selected={role === 'client'}
                onClick={() => setRole('client')}
              />

              <RoleSelectionInput
                accountType="provider"
                selected={role === 'provider'}
                onClick={() => setRole('provider')}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-1 flex-col">
            <div className="w-[90%]">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />

                <Input
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <Input
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">
                  <Input
                    placeholder="Password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-500 hover:text-neutral-800"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <p className="mb-3 text-xs text-neutral-400">
                  Use 8 or more letters, numbers and symbols
                </p>

                <Button className="w-full" onClick={handleSignup}>
                  Sign Up
                </Button>

                <div className="divider text-neutral-400">or</div>

                <SocialAuthButton platform="google" />

                <p className="w-full text-xs font-light text-neutral-400">
                  By creating an account, you are agreeing to the{' '}
                  <Link href="" className="text-neutral-600 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="" className="text-neutral-600 underline">
                    Privacy Policy
                  </Link>{' '}
                  of Bzy.
                </p>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
          </div>
          <div id="clerk-captcha" />
        </form>
      )}

      {step === 'verify' && (
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <h2 className="text-3xl">Verify your email</h2>
          <p className="text-neutral-400">
            Enter the verification code we sent to your email.
          </p>

          <EmailOTP value={code} onChange={setCode} />

          <Button onClick={handleVerification}>Verify</Button>

          <button
            className="text-neutral-400 underline"
            onClick={handleResendCode}
          >
            Resend Code
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}
