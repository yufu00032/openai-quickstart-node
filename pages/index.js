import { useEffect, useRef, useState } from 'react';
import API from './api';
import { Input, Button } from 'antd';
import { color } from '../public/color';
import { ChatAvatar, ChatText, ChatLoading } from '../components/chat';

export default function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState([]);
  // const [result, setResult] = useState([
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  //   { type: 'You', text: '1234567890' },
  //   { type: 'ChatGPT', text: 'hello world' },
  // ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(undefined);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [loading]);

  const handleSend = async () => {
    const currentData = [...result, { type: 'You', text: value }];
    setResult(currentData);
    setLoading(true);
    setValue('');

    try {
      const { data } = await API.sendFaq({ value });
      const newData = data.result?.questions
        ? { type: 'ChatGPT', text: `${data.result.questions}<br />${data.result.answers}` }
        : { type: 'ChatGPT', text: data.result };
      setResult([...currentData, newData]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response.status === 503) {
        const newData = { type: 'ChatGPT', text: '很抱歉，現在太忙了，請稍候再次呼叫我', error: 503 };
        setResult([...currentData, newData]);
        setLoading(false);
        return;
      }

      const newData = { type: 'ChatGPT', text: error.message, error: error.response.status };
      setResult([...currentData, newData]);
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="chat-container f-dir-c">
        {result.map((item, i) => {
          return (
            <div
              key={i}
              className={item.type === 'You' ? 'user-input flex pd-1' : 'flex pd-1'}
              style={{
                background: item.error ? color.red : '',
              }}
            >
              <ChatAvatar type={item.type}></ChatAvatar>
              <ChatText text={item.text}></ChatText>
            </div>
          );
        })}
        <ChatLoading loading={loading}></ChatLoading>
        <div ref={chatRef}></div>
      </main>
      <div className="w-100 f-dir-c">
        <div className="flex ali-c">
          <Input className="h4 section send mg-r-1" value={value} onChange={(e) => setValue(e.target.value)} />
          <Button type="primary" className="h4 send green" onClick={handleSend} disabled={loading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
