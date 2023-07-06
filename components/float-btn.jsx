import { color } from '../public/color';

const FloatBtn = (props) => {
  const { child, onClick } = props;
  return (
    <button
      className="light green"
      style={{
        width: '75px',
        height: '75px',
        background: color.light.green,
        position: 'fixed',
        right: '48px',
        bottom: '48px',
        borderRadius: '50%',
        border: '0',
        color: color.dark.text,
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {child}
    </button>
  );
};

export default FloatBtn;
