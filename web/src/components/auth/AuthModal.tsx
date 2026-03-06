import { Dialog, DialogContent } from '../ui/dialog';
import { RoleSelectionInput } from './RoleSelectionInput';

type AuthModalProps = {
  open: boolean;
  openOnChange: (open: boolean) => void;
};

export function AuthModal({ open, openOnChange }: AuthModalProps) {
  return (
    <Dialog open={open} onOpenChange={openOnChange}>
      <DialogContent className="sm:max-w-3xl">
        <div className="flex w-full">
          {/* Left Side Div */}
          <div className="w-[50%]">
            <div className="mb-6">
              <h2 className="text-3xl font-medium mb-2">Get Bzy.</h2>
              <p className="font-sans text-neutral-400">
                Create an account to get started.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-medium mb-4">
                What would you like to do?
              </h2>
              <RoleSelectionInput accountType="client" />
            </div>
          </div>
          <div className="w-[50%]">hi</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
