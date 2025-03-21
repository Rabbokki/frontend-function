import "./App.css";
import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import TopNav from "./Components/TopNav.js"
import RouteComponents from "./Components/RouteComponents"

function App() {

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
