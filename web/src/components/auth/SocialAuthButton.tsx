/* eslint-disable style/multiline-ternary */
import { FaApple, FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

type SocialAuthButtonProps = {
  platform: 'google' | 'apple' | 'facebook';
};

const platformConfig = {
  apple: {
    icon: FaApple,
    label: 'Sign up with Apple',
  },
  facebook: {
    icon: FaFacebookF,
    label: 'Sign up with Facebook',
  },
  google: {
    icon: FcGoogle,
    label: 'Sign up with Google',
  },
};

export function SocialAuthButton({ platform }: SocialAuthButtonProps) {
  const { icon: Icon, label } = platformConfig[platform];

  return (
    <button
      className={`mb-2 flex h-10 w-80 cursor-pointer items-center rounded-sm border px-4 shadow-lg ${platform === 'apple' ? 'bg-black text-white' : platform === 'facebook' ? 'bg-[#3b5998] text-white' : 'bg-white'}`}
    >
      <div className="flex w-full justify-center items-center">
        <Icon className="text-2xl mr-3" />
        <p className="font-medium">{label}</p>
      </div>
    </button>
  );
}
