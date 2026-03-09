/* eslint-disable style/jsx-one-expression-per-line */
import { Dialog, DialogContent } from '../ui/dialog';
import { UserInfoForm } from './UserInfoForm';

type AuthModalProps = {
  open: boolean;
  openOnChange: (open: boolean) => void;
};

export function AuthModal({ open, openOnChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={openOnChange}>
      <DialogContent className="font-light sm:max-w-3xl">
        <UserInfoForm />
      </DialogContent>
    </Dialog>
  );
}
