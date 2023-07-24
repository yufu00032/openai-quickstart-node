import { RobotOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import Link from 'next/link';

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(
    <Link className="h3 hover" href="/">
      FAQ
    </Link>,
    'faq',
    <RobotOutlined className="h3" />
  ),
  getItem(
    <Link className="h3 hover" href="/hotel-recommend">
      酒店推薦
    </Link>,
    'hotelrecommend',
    <AppstoreOutlined className="h3" />
  ),
];

const Nav = () => {
  return (
    <Menu
      className="section min-h-nav"
      style={{
        width: 256,
      }}
      mode="inline"
      items={items}
    />
  );
};
export default Nav;
