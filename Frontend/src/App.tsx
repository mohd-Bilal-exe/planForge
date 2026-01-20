import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Questions from './pages/Questions';
import Plan from './pages/plans/plan';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="w-dvw h-dvh overflow-auto select-none nunito">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions/:id" element={<Questions />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plan/:id" element={<Plan />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
