import { Routes, Route, Navigate } from "react-router-dom";

import Authenticate from "../pages/authenticate/authenticate";

const RouteComponents = ({currentUser, setCurrentUser, loggedIn, setLoggedIn}) => {
  return (
    <div>
      <Routes>
        <Route path="/authenticate" element={<Authenticate
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
        />}/>
        
        <Route path="*" element={
          <div>
            <h4>
              404. That’s an error.
            </h4>
            <p>
              The requested URL /fdjsalflsadjfldsa was not found on this server. That’s all we know.
            </p>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default RouteComponents