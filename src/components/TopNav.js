import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { Route, Router, Routes, useNavigate , Link, useParams } from "react-router-dom";

const TopNav = ({navigate, loggedIn, setLoggedIn}) => {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/"><img src="/image/logoo.jpg.png" style={{width : '80px' , height: 'auto'}}></img></Navbar.Brand>
          <Nav className="me-auto">
            {/* ListPage */}
            <Nav.Link as={Link} to={"/search-list"}>ListPage</Nav.Link>
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
            
          <Nav className="me-auto">
            <div className="d-flex gap-2">
              <Nav.Link onClick={!loggedIn ? (() => navigate("/authenticate")) : (() => navigate("/myPage"))}><FontAwesomeIcon icon={faUser} style={{fontSize:'30px'}}/></Nav.Link>
            </div>
          </Nav>
          </Nav>
        </Container>
      </Navbar>
    </div>
  )
}

export default TopNav;