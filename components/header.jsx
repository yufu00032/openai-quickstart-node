import logo from '../public/logo.png';
import Image from 'next/image';

const Header = () => {
  return (
    <div className="logo pd-l-1">
      <Image src={logo} alt="logo" height={50} />
    </div>
  );
};

export default Header;
