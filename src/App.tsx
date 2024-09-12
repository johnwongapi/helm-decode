import React from 'react';
import HelmDecode from './components/HelmDecode';
import { BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/">
      <div>
        <h1>Welcome to Helm Decode</h1>
        <HelmDecode />
      </div>
    </BrowserRouter>
  );
};

export default App;