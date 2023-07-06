import { Modal, Input, message, Button } from 'antd';
import api from '../pages/api';
import { useState } from 'react';

const { TextArea } = Input;

const RealTimeModal = (props) => {
  const [value, setValue] = useState('');

  const { open, setOpen } = props;

  const handleSend = async () => {
    try {
      const { data } = await api.sendRealTime({ value });

      setResult(data.result);
      setValue('');
      setOpen(false);
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleCancel = async () => {
    setOpen(false);
    setValue('');
  };

  return (
    <Modal
      title="ChatGPT Conversation"
      open={open}
      setOpen={setOpen}
      onOk={handleSend}
      onCancel={handleCancel}
      // okText={
      //   <Button type="primary" className="green">
      //     Send
      //   </Button>
      // }
    >
      <div className="f-dir-c">
        <div className="h4 bg" style={{ marginBottom: '1em' }}>
          Speak to chatGPT
        </div>
        <TextArea
          className="h4 section"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
      </div>
    </Modal>
  );
};

export default RealTimeModal;
