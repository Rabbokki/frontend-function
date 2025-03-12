import "./App.css";
import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

import TopNav from "./components/TopNav"
import RouteComponents from "./components/RouteComponents"

function App() {
  const [message, setMessage]=useState([]);
  const [currentUser, setCurrentUser] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  let navigate = useNavigate();
  
  return (
    <div className="App">
      <TopNav navigate={navigate} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

      <RouteComponents
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
    </div>
  )
}

export default App;
