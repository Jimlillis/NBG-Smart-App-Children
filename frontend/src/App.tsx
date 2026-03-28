
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashboard/dashboard';
import LoginPage from './pages/loginPage/loginPage';
// import Quiz from './pages/quiz/quiz';
import ParentPage from './pages/parentPage/parentPage';
import Savings from './pages/savings/savings';
import Learning from './pages/learning/learning';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Η αρχική σελίδα θα είναι το Login (ή το Dashboard αν είναι ήδη συνδεδεμένος) */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Οι υπόλοιπες σελίδες */}
         <Route path="/dashboard" element={<Dashboard />} /> 
        {/* <Route path="/quiz" element={<Quiz />} /> */}
        <Route path="/parent-page" element={<ParentPage />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/learning" element={<Learning />} />

        
        {/* Αν ο χρήστης βάλει λάθος URL, μπορείς να τον στείλεις κάπου αλλού */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;