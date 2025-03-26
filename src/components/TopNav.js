import { useSelector } from 'react-redux';
import { useNavigate, Link } from "react-router-dom"; // Import navigate & Link
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faWineBottle, faUser } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useRef } from 'react';

const TopNav = () => {
  const navigate = useNavigate()
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const inputRef = useRef(null)
  const onSearch = ()=>{
    const searchText = inputRef.current.value;
    if(searchText){
      axios.get(`/api/liqour`)
      .then((response) =>{
        if(response.data.length > 0){
          alert("검색이 되었습니다")
        }else{
          alert("검색결과가 없습니다");
        }
      })
      .catch((error)=>{
        alert("오류")
      });
    }
    inputRef.current.value='';
  };

  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">
            <img src="/image/logo.jpg" style={{ width: "100px", height: "auto" }} alt="Logo" />
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
            <div className='searchBox'>
              <input type='text' placeholder='category' ref={inputRef} className='searchInput'></input>
              <button onClick={onSearch} id='search-Btn'><img src='/image/image.png' alt='search icon' className='search-Img'></img></button>
            </div>
          <Nav>
            <Nav.Link as={Link} to={"/newPost"}>
              <FontAwesomeIcon icon={faWineBottle} style={{ fontSize: "50px" }} />
            </Nav.Link>
            <Nav.Link as={Link} to={"/cart"}>
              <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: "50px" }} />
            </Nav.Link>
            <div className="d-flex gap-2">
              <Nav.Link onClick={() => {
                console.log(loggedIn)
                navigate(loggedIn ? "/account" : "/authenticate")}}>
                {/* <FontAwesomeIcon icon={faUser} style={{ fontSize: "30px" }} />
                {navigate(loggedIn ? "/myPage" : "/authenticate")} */}
                <FontAwesomeIcon icon={faUser} style={{ fontSize: "50px" }} />
              </Nav.Link>
            </div>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopNav;
