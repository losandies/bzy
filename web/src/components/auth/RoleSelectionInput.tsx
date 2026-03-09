/* eslint-disable style/quotes */
/* eslint-disable style/multiline-ternary */
/* eslint-disable style/jsx-one-expression-per-line */
import { FaBriefcase, FaCalendarCheck } from 'react-icons/fa';

type RoleSelectionInputProps = {
  accountType: 'client' | 'provider';
  selected: boolean;
  onClick: () => void;
};

const roleConfig = {
  client: {
    icon: FaCalendarCheck,
    title: 'Book Services',
    description: "I'm looking for providers to book services from",
  },
  provider: {
    icon: FaBriefcase,
    title: 'Offer Services',
    description: 'I want to offer my services and get bzy.',
  },
};

export function RoleSelectionInput({
  accountType,
  selected,
  onClick,
}: RoleSelectionInputProps) {
  const { icon: Icon, title, description } = roleConfig[accountType];

  //   Focus on button goes away after clicking away, need to find a fix.

  return (
    <button
      type="button"
      onClick={onClick}
      className={`my-4 flex h-24 w-70 cursor-pointer rounded-sm border  px-4 pt-4 font-light shadow-sm ${selected ? 'border-green-500' : 'border-neutral-200 hover:border-neutral-400 '} `}
    >
      <div className="mt-3 mr-5">
        <Icon className="text-4xl" />
      </div>
      <div className="text-left">
        <p>{title}</p>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
    </button>
  );
}
