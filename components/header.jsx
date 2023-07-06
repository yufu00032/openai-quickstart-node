import { color } from '../public/color';
import logo from '../public/logo.png';
import Image from 'next/image';

const Header = () => {
  return (
    <div style={{ background: color.dark.bg, paddingLeft: '1em' }}>
      <Image src={logo} alt="logo" height={50} />
    </div>
  );
};

export default Header;
