import React, {useState, useEffect} from 'react';

function App() {
  const [message, setMessage]=useState([]);
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
    </div>
  );
}

export default App;
