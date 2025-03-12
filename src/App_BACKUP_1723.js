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
  useEffect(()=>{
    fetch("/api/post")
        .then((response)=>{
          return response.json();
        })
        .then((data)=>{
            setMessage(data);
            console.log("요기")
        });
  },[]);
  return (
<<<<<<< HEAD
    <div className="App">
      <TopNav navigate={navigate} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>

      <RouteComponents
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
      />
=======
    <div>
      {message.map((x,y)=>(
        <div key={x.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
          <h3>{x.content}</h3>
          <p><strong>Title : </strong>{x.title}</p>
          <p><strong>Price : </strong>{x.price}</p>
          <h4>Comments : </h4>
          {x.commentDtos.length > 0 ? (
            x.commentDtos.map((comment) => (
              <div key={comment.id}>
                <p><strong>{comment.nickname}:</strong> {comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments</p>
          )}
        </div>
      ))}
>>>>>>> main
    </div>
  )
}

export default App;
