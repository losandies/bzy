/* eslint-disable style/jsx-one-expression-per-line */
import { FaBriefcase, FaCalendarCheck } from 'react-icons/fa';

type RoleSelectionInputProps = {
  accountType: 'client' | 'provider';
};

export function RoleSelectionInput({ accountType }: RoleSelectionInputProps) {
  const isClient = accountType === 'client';

  //   Focus on button goes away after clicking away, need to find a fix.

  return (
    <button className="flex h-24 w-72 cursor-pointer rounded-sm border border-neutral-400 px-4 pt-4 shadow-lg focus:border-green-500 ">
      <div className="mr-3 pt-1">
        {isClient ? <FaCalendarCheck className="text-4xl" /> : <FaBriefcase />}
      </div>
      <div>
        <p>{isClient ? 'Book Services' : 'Offer Services'}</p>
        <p className="text-sm text-neutral-400">
          I'm looking for providers to books services from
        </p>
      </div>
    </button>
  );
}
