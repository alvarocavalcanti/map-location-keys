import React from "react";
import { Container } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import { isDevMode } from "../utils";

const Navbar: React.FC = () => {
  return (
    <Container>
      {isDevMode() ? (
        <div className="alert alert-warning p-3">Development Mode</div>
      ) : null}
      <nav className="navbar p-3">
        <Link className="nav-item nav-link" to="/">
          Location Keys
        </Link>
        <Link className="nav-item nav-link" to="/import-export">
          Import/Export
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
