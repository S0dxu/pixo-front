import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import Player from './components/Player/Player';
import ForYou from './pages/ForYou/ForYou';
import Explore from './pages/Explore/Explore';
import Home from './pages/Home/Home';
import Create from './pages/Create/Create';
import Upload from './pages/Upload/Upload';

function App() {
  return (
    <Router>
      <Navbar />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/activity" element={<Explore />} />
          <Route path="/create" element={<Create />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </div>
      {/* <Player /> */}
    </Router>
  );
}

export default App;
