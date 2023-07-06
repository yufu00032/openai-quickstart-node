import { RobotOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Menu, Sider } from 'antd';
import Link from 'next/link';
import { color } from '../public/color';

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
    <Link className="text hover" href="/">
      客服機器人
    </Link>,
    'robot',
    <RobotOutlined />
  ),
  getItem(
    <Link className="text" href="/real-time">
      即時文案
    </Link>,
    'time',
    <AppstoreOutlined />
  ),
];

const Nav = () => {
  const onClick = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
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
