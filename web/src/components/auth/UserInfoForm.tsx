import Link from 'next/link';
import { useState } from 'react';
import { Input } from '../ui/input';
import { SocialAuthButton } from './SocialAuthButton';
import { Button } from '../ui/button';

type UserInfoFormProps = {
  isProvider: boolean;
};

export function UserInfoForm({ props }: UserInfoFormProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProvider, setIsProvider] = useState(false);

  return (
    <div className="w-80">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="First Name" />
        <Input placeholder="Last Name" />
      </div>
      <div className="flex flex-col">
        <Input placeholder="Email" />
        <Input placeholder="Password" />
        <Input className="mb-4" placeholder="Confirm Password" />
        <p className="w-full mb-4 text-xs font-light text-neutral-400">
          By creating an account, you are agreeing to the{' '}
          <Link href="" className="text-neutral-600 underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="" className="text-neutral-600 underline">
            Privacy Policy
          </Link>
        </p>
        <Button className="w-full">Sign Up</Button>
        <div className="divider text-neutral-400">or</div>
        <SocialAuthButton platform="google" />
      </div>
    </div>
  );
}
