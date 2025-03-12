import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { Route, Router, Routes, useNavigate , Link, useParams } from "react-router-dom";

const TopNav = ({navigate, loggedIn, setLoggedIn}) => {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/"><img src="/image/logoo.jpg.png" style={{width : '80px' , height: 'auto'}}></img></Navbar.Brand>
          <Nav className="me-auto">
            {/* ListPage */}
            <Nav.Link as={Link} to={"/list"}>ListPage</Nav.Link>
            <NavDropdown title="Category" id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item as={Link} to={"/whiskey"}>Whiskey</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/champagne"}>Champagne</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/wine"}>Wine</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/vodka"}>Vodka</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link >Features</Nav.Link>
            
          </Nav>
          {/* CartPage */}
          <Nav>
          <Nav.Link as={Link} to={"/cart"}><FontAwesomeIcon icon={faCartShopping} style={{fontSize:'30px'}}/></Nav.Link>
            
          <Nav.Link>Login</Nav.Link>
          <Nav.Link>Logout</Nav.Link> 
          </Nav>
        </Container>
      </Navbar>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
            
          <Navbar.Brand onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
            Home
          </Navbar.Brand>
          
          <Nav className="me-auto">
            {!loggedIn ? (
              <div className="d-flex gap-2">
                <Nav.Link onClick={() => navigate("/authenticate")}>로그인</Nav.Link>
                <Nav.Link onClick={() => navigate("/signup")}>회원가입</Nav.Link>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Nav.Link onClick={() => {
                  alert("로그아옷 했습니다.")
                  setLoggedIn(false)
                }}>
                  로그아옷
                </Nav.Link>
              </div>
              
            )}

          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default TopNav;