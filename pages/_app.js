import './style.css';
import Header from '../components/header';
import Nav from '../components/nav';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="bg" style={{ minHeight: '100vh' }}>
      <Header />
      <div className="flex">
        <div className="f-dir-c">
          <Nav />
        </div>
        <div className="f-dir-c pd-2 w-100">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  );
}
