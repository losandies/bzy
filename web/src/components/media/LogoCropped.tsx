import Image from 'next/image';
import image from '../../assets/bzy-logo-cropped.jpg';

type LogoCroppedProps = {
  width: number;
  height: number;
};

export const LogoCropped = ({ width, height }: LogoCroppedProps) => {
  return <Image src={image} width={width} height={height} alt="Bzy Logo" />;
};
