import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';

export const ChatAvatar = ({ type }) => (
  <div className="f-dir-c shrink-0" style={{ width: '8em' }}>
    <span className="h4">{type}</span>
  </div>
);

export const ChatText = ({ text }) => (
  <div className="f-dir-c">
    <div className="h4" dangerouslySetInnerHTML={{ __html: text }} />
  </div>
);

export const ChatLoading = ({ loading }) => (
  <div
    className="pd-1"
    style={{
      display: loading ? 'flex' : 'none',
    }}
  >
    <ChatAvatar type="ChatGPT"></ChatAvatar>
    <div className="f-dir-c">
      <span className="h4 mg-r-1">努力思考中，請稍候</span>
      <LoadingOutlined size="large" />
    </div>
  </div>
);
