import { useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom"; // Import navigate & Link
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const TopNav = () => {
  const navigate = useNavigate()
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">
            <img src="/image/logoo.jpg.png" style={{ width: "80px", height: "auto" }} alt="Logo" />
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to={"/search-list"}>ListPage</Nav.Link>
            <NavDropdown title="Category" id="basic-nav-dropdown" className="custom-dropdown">
              <NavDropdown.Item as={Link} to={"/whiskey"}>Whiskey</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/champagne"}>Champagne</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/wine"}>Wine</NavDropdown.Item>
              <NavDropdown.Item as={Link} to={"/vodka"}>Vodka</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link>Features</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to={"/cart"}>
              <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: "30px" }} />
            </Nav.Link>
            <div className="d-flex gap-2">
              <Nav.Link onClick={() => {
                console.log(loggedIn)
                navigate(loggedIn ? "/account" : "/authenticate")}}>
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "30px" }} />
              </Nav.Link>
            </div>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopNav;
