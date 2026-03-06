'use client';

import { useState } from 'react';
import { AuthModal } from '../auth/AuthModal';
import { Logo } from '../media/Logo';
import { Button } from './button';

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="relative mt-4 flex h-18 w-full items-center justify-between">
        <div>
          <Logo />
        </div>
        <div className="absolute left-1/2 flex h-12 -translate-x-1/2 items-center justify-around rounded-lg bg-neutral-100 px-4">
          <Button variant="ghost" className="font-normal">
            Explore
          </Button>
          <Button variant="ghost" className="font-normal">
            How It Works
          </Button>
          <Button variant="ghost" className="font-normal">
            For Professionals
          </Button>
          <Button variant="ghost" className="font-normal">
            Why Bzy
          </Button>
          <Button variant="ghost" className="font-normal">
            Get Bzy
          </Button>
        </div>
        <div className="flex h-18  items-center justify-center px-4">
          <Button
            variant="ghost"
            className="mr-5 h-12"
            onClick={() => setOpen(true)}
          >
            Sign Up
          </Button>
          <Button className="h-12">Get Started</Button>
        </div>

        <AuthModal open={open} openOnChange={setOpen} />
      </div>
    </>
  );
};
