import React from 'react';
import ReactDOM from 'react-dom';
import PopupPage from './components/Popup/PopupPage';

import './index-popup.css';

ReactDOM.render(
  <React.StrictMode>
    <PopupPage />
  </React.StrictMode>,
  document.getElementById('popup')
);
