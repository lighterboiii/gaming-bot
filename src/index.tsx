/* eslint-disable import/order */
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import store from './services/store';

import './index.css';

import reportWebVitals from './reportWebVitals';
import { App } from './components/App/App';
import { WebSocketProvider } from './socket/WebSocketContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Provider store={store}>
    <WebSocketProvider>
      <Router>
        <App />
      </Router>
    </WebSocketProvider>
  </Provider>);

reportWebVitals();
