import { useEffect, useRef, useState } from 'react';
import API from '../api';
import { color } from '../../public/color';
import { ChatAvatar, ChatText, ChatLoading } from '../../components/chat';
import USER from '../../public/user.json';
import HOTEL from '../../public/hotel.json';

export default function UserRecommend() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(undefined);
  let findTags = USER.map((user) => {
    let tags = [];
    HOTEL.filter((hotel) => user.mostHotels.find((id) => hotel.id === id)).forEach((hotel) => tags.push(...hotel.tag));
    return [...new Set(tags)];
  });

  useEffect(() => {
    chatRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [result]);

  const handleSend = async (user) => {
    const currentData = [...result, { type: 'You', text: user.name }];
    setResult(currentData);
    setLoading(true);

    try {
      const { data } = await API.sendUserRecommend({ user });
      let response = '';

      if (data.result[0]?.hotel) {
        data.result.forEach((item, i) => {
          if (i !== data.result.length - 1) {
            response += `${item.hotel}<br />${item.description}<br /><br />`;
          } else {
            response += `${item.hotel}<br />${item.description}`;
          }
        });
      } else {
        response = data.result;
      }

      const newData = { type: 'ChatGPT', text: response };
      setResult([...currentData, newData]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 503) {
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
      <div className="flex w-100 jus-sb">
        {USER.map((user, i) => (
          <div
            className="flex f-dir-c pd-1 section"
            onClick={() => {
              if (!loading) handleSend(user);
            }}
            style={{
              boxShadow: '3px 3px 5px #ccc',
              borderRadius: '20px',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? '0.5' : '1.0',
            }}
          >
            <p className="h4">{user.name}</p>
            <p>{findTags[i].join(' ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
