import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { Auth } from './pages/Auth'; // Vamos criar essa
import { Estante } from './pages/Estante';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Auth isLogin={true} />} />
        <Route path="/cadastro" element={<Auth isLogin={false} />} />
        <Route path="/estante" element={<Estante />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;