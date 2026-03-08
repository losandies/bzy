/* eslint-disable style/jsx-one-expression-per-line */
import { LogoCropped } from '../media/LogoCropped';
import { Dialog, DialogContent } from '../ui/dialog';
import { RoleSelectionInput } from './RoleSelectionInput';
import { UserInfoForm } from './UserInfoForm';

type AuthModalProps = {
  open: boolean;
  openOnChange: (open: boolean) => void;
};

export function AuthModal({ open, openOnChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={openOnChange}>
      <DialogContent className="font-light sm:max-w-3xl">
        <div className="flex w-full">
          {/* Left Side Div */}
          <div className="flex flex-1 flex-col gap-4 ml-6">
            <div>
              <h2 className="flex items-center gap-2 mb-2 text-3xl">
                Get Started
              </h2>
              <p className="text-neutral-400">
                Create an account to get started.
              </p>
            </div>

            <div>
              <h2 className="text-xl">How would you like to use Bzy?</h2>
              <RoleSelectionInput accountType="client" />
              <RoleSelectionInput accountType="provider" />
            </div>
          </div>
          <div className="flex flex-1 flex-col">
            <UserInfoForm />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
