import { TranslationOutlined } from '@ant-design/icons';
import FloatBtn from '../../components/float-btn';
import { Input } from 'antd';
import { useState } from 'react';
import RealTimeModal from '../../components/realtime-modal';

const { TextArea } = Input;

export default () => {
  const [value, setValue] = useState({
    tw: '私享旅遊為您精選各國奢華酒店，無需額外付費即可輕鬆享受奢華旅遊！想要出國旅行散散心，感受旅行的美好？就找頂級奢華旅遊－私享旅遊！',
    en: 'Curators of Travel is an expert in global luxury hotels. Booking through us and enjoying multiple VIP benefits without an additional cost. Instant confirmation, no hidden fees and it’s hassle free.',
  });
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="f-dir-c">
        <div className="flex" style={{ marginBottom: '3em' }}>
          <div className="h4" style={{ width: '8em' }}>
            行銷文案
          </div>
          <TextArea
            className="section h4"
            value={value.tw}
            onChange={(e) => setValue({ tw: e.target.value, en: value.en })}
            autoSize
          />
        </div>
        <div className="flex">
          <div className="h4" style={{ width: '8em' }}>
            EN - 行銷文案
          </div>
          <TextArea
            className="section h4"
            value={value.en}
            onChange={(e) => setValue({ tw: value.tw, en: e.target.value })}
            autoSize
          />
        </div>
      </div>
      <FloatBtn child={<TranslationOutlined style={{ fontSize: '2rem' }} />} onClick={() => setOpen(true)} />
      <RealTimeModal open={open} setOpen={setOpen} />
    </>
  );
};
