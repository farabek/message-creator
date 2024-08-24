import ReactDOM from 'react-dom/client';
import '../src/assets/styles/index.scss';
import StartPage from './pages/StartPage/StartPage';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<StartPage />);
