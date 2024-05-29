import React from "react";
import {
  Col,
  Container,
  Nav,
  NavDropdown,
  Navbar as RBNavbar,
  Row,
} from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import { isDevMode } from "../utils";
import { paths } from "./util/constants";

const Navbar: React.FC = () => {
  return (
    <Container>
      {isDevMode() ? (
        <div className="alert alert-warning p-3">Development Mode</div>
      ) : null}
      <RBNavbar>
        <Container>
          <Row>
            <Col xs={8} className="text-right">
              <RBNavbar.Brand>
                <Link className="nav-item nav-link" to="/">
                  Location Keys
                </Link>
              </RBNavbar.Brand>
            </Col>
            <Col xs={4}>
              <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
              <RBNavbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto navbar-right">
                  <NavDropdown title="Menu" id="basic-nav-dropdown">
                    <NavDropdown.Item>
                      <Link className="nav-item nav-link" to="/">
                        Home
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link
                        className="nav-item nav-link"
                        to={paths.bulkActions}
                      >
                        Bulk Actions
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link
                        className="nav-item nav-link"
                        to={paths.importExport}
                      >
                        Import/Export
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item>
                      <Link className="nav-item nav-link" to={paths.help}>
                        Help
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </RBNavbar.Collapse>
            </Col>
          </Row>
        </Container>
      </RBNavbar>
      <Outlet />
    </Container>
  );
};

export default Navbar;
