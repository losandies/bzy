import Image from 'next/image';
import image from '../../assets/bzy-logo.png';

export const Logo = () => {
  return (
    <Image src={image} width={150} height={150} alt="Bzy Logo" />
  );
};
