import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landing from './pages/LandingPage.jsx';
import './App.css'
import { AuthProvider } from "./contexts/AuthContext.jsx";

import Authentication from './pages/Authentication.jsx';
import VideoMeetComponent from './pages/VideoMeet.jsx';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
            <AuthProvider>

        <Routes>
          <Route path="/" element={<Landing />} />
           <Route path="/auth" element={<Authentication />} />
<Route path="/:url"element={<VideoMeetComponent/>}/>
        </Routes>
        </AuthProvider>

      </BrowserRouter>
    </div>
  )
}

export default App;