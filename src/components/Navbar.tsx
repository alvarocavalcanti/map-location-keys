import React from "react";
import { Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <Container>
      <nav className="navbar p-3">
        <Link className="nav-item nav-link" to="/">
          Location Keys
        </Link>
        <Link className="nav-item nav-link" to="/help">
          Help
        </Link>
      </nav>
      <Outlet />
    </Container>
  );
};

export default Navbar;
