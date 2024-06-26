import { BrowserRouter as Router , Route, Routes } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import Home from './components/home'
import Login from './components/login'
import Signup from './components/signup'
import Dash from './components/dash';
import './App.css';
import EventDetails from './components/event_deatils';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element ={<Login/>}/>
          <Route path = '/signup' element={<Signup/>}/>
          <Route path='/dash' element={<Dash/>}/>
          <Route path='/create' element={<CreateEvent/>}/>
          <Route path='/event_detail/:eventId' element={<EventDetails/>}/>
          <Route path='*' element={<Home/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
