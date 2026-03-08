/* eslint-disable style/quotes */
/* eslint-disable style/multiline-ternary */
/* eslint-disable style/jsx-one-expression-per-line */
import { FaBriefcase, FaCalendarCheck } from 'react-icons/fa';

type RoleSelectionInputProps = {
  accountType: 'client' | 'provider';
};

export function RoleSelectionInput({ accountType }: RoleSelectionInputProps) {
  const isClient = accountType === 'client';

  //   Focus on button goes away after clicking away, need to find a fix.

  return (
    <button className="my-4 flex h-24 w-70 cursor-pointer rounded-sm border border-neutral-200 px-4 pt-4 font-light shadow-sm hover:border-neutral-400 focus:border-2 focus:border-green-500">
      <div className="mr-5 mt-3">
        {isClient ? (
          <FaCalendarCheck className="text-4xl" />
        ) : (
          <FaBriefcase className="text-4xl" />
        )}
      </div>
      <div className="text-left">
        <p>{isClient ? 'Book Services' : 'Offer Services'}</p>
        <p className="text-sm text-neutral-400">
          {isClient
            ? "I'm looking for providers to books services from"
            : 'I want to offer my services and get bzy.'}
        </p>
      </div>
    </button>
  );
}
