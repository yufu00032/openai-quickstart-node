import Head from 'next/head';
import { useState } from 'react';
import styles from './index.module.css';
import api from './api';
import { Input, Button, message } from 'antd';
import Image from 'next/image';
import { color } from '../public/color';

const data = [
  { type: 'You', text: 'What is Lorem Ipsum?' },
  {
    type: 'ChatGPT',
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s,',
  },
  { type: 'You', text: 'Where does it come from?' },
  { type: 'ChatGPT', text: 'Contrary to popular belief, Lorem Ipsum is not simply random text.' },
];

export default function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState();

  const handleSend = async () => {
    try {
      const { data } = await api.sendRobot({ value });

      setResult(data.result);
      setValue('');
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  async function onSubmit(e) {
    e.preventDefault();

    try {
      // if (res.status !== 200) {
      //   throw data.error || new Error(`Request failed with status ${res.status}`);
      // }
      const { data } = await api.sendRobot({ value });

      setResult(data.result);
      setValue('');
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <main className="chat-container f-dir-c">
        {data.map((item, i) => {
          return (
            <div
              key={i}
              className={item.type === 'You' ? 'user-input flex' : 'flex'}
              style={{
                padding: '1em',
              }}
            >
              <div className="f-dir-c shrink-0" style={{ width: '8em' }}>
                <span className="h4">{item.type}</span>
              </div>
              <div className="f-dir-c">
                <span className="h4">{item.text}</span>
              </div>
            </div>
          );
        })}
        {/* <div></div>
        <h1>Test Input</h1>
        <form onSubmit={onSubmit}>
          <input type="text" name="value" value={value} onChange={(e) => setValue(e.target.value)} />
          <input type="submit" value="Submit" />
        </form>
        <div className={styles.result}>{result}</div> */}
      </main>
      <div className="w-100 f-dir-c">
        <div className="flex ali-c">
          <Input
            className="h4 section send"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ marginRight: '1em' }}
          />
          <Button type="primary" className="h4 send green" onClick={handleSend}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
