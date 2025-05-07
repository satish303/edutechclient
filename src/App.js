import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExamPage from './ExamPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
