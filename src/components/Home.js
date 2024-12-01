import { useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import { Navbar, Nav, NavDropdown,  Button, Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    // if used in more components, this should be in context 
    // axios to /logout endpoint setAuth({});
    navigate('/linkpage');
  }

  return (
    <>
      <Navbar bg="light" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="#">My Ecommerce Site</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/product">
                 <Link to="/product">Products</Link>
              </Nav.Link>
              <Nav.Link href="/company">Company</Nav.Link>
              <Nav.Link href="/order">Orders</Nav.Link>
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                <NavDropdown.Item href="/lounge">Lounge</NavDropdown.Item>
                <NavDropdown.Item href="/linkpage">Link Page</NavDropdown.Item>
              </NavDropdown> */}
            </Nav>
            <Nav>
              <Nav.Link onClick={logout}>Sign Out</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8}>
            <h1 className="text-center">Welcome to My Ecommerce Site!</h1>
            <p className="text-center">You are logged in!</p>
            {/* <Row className="justify-content-center">
              <Col xs={12} md={6}>
                <Link to="/product" className="btn btn-primary btn-block mb-3">Go to the Products page</Link>
              </Col>
              <Col xs={12} md={6}>
                <Link to="/admin" className="btn btn-primary btn-block mb-3">Go to the Admin page</Link>
              </Col>
              <Col xs={12} md={6}>
                <Link to="/lounge" className="btn btn-primary btn-block mb-3">Go to the Lounge</Link>
              </Col>
              <Col xs={12} md={6}>
                <Link to="/linkpage" className="btn btn-primary btn-block mb-3">Go to the link page</Link>
              </Col>
            </Row> */}
            <div className="text-center">
              <Button onClick={logout} variant="primary">Sign Out</Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home