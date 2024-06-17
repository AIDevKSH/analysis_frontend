import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Headroom from "headroom.js";
import {
  Button,
  UncontrolledCollapse,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import { useRecoilState } from 'recoil';
import { emailState, nameState, pictureState, isLoginState } from './../../atoms';

import GoogleOauth from './../../views/examples/GoogleOauth'

const DemoNavbar = () => {
  const [collapseClasses, setCollapseClasses] = useState("");
  const [collapseOpen, setCollapseOpen] = useState(false);

  const [email, setEmail] = useRecoilState(emailState); // Recoil 상태를 가져와서 초기화합니다.
  const [name, setName] = useRecoilState(nameState);
  const [picture, setPicture] = useRecoilState(pictureState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  useEffect(() => {
    const headroom = new Headroom(document.getElementById("navbar-main"));
    headroom.init();
  }, []);

  const onExiting = () => {
    setCollapseClasses("collapsing-out");
  };

  const onExited = () => {
    setCollapseClasses("");
  };

  const navigate = useNavigate();

  return (
    <>
      <header className="header-global">
        <Navbar
          className="navbar-main navbar-transparent navbar-light headroom"
          expand="lg"
          id="navbar-main"
        >
          <Container>
            <NavbarBrand href="#" onClick={(e) => e.preventDefault()}>
              <Link to="/"><h3 className="text-white">분석 사이트</h3></Link>
            </NavbarBrand>
            <button className="navbar-toggler" id="navbar-primary">
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse
              navbar
              toggler="#navbar-primary"
              className={collapseClasses}
              onExiting={onExiting}
              onExited={onExited}
            >
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6"></Col>
                  <Col className="collapse-close" xs="6">
                    <button className="navbar-toggler" id="navbar-primary">
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="ml-lg-auto" navbar>
                <NavItem>
                  <NavLink
                    href="#"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/community");
                    }}
                  >
                    게시판 <span className="sr-only">(current)</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/upload");
                    }}
                  >
                    분석하기
                  </NavLink>
                </NavItem>


                {isLogin ? (
                  // 로그인된 상태일 때
                  <>
                    <NavItem>
                      <NavLink
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/');
                          window.location.reload()
                        }}
                      >
                        로그아웃
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <Media>
                        <Media body>
                          <NavLink
                            href="#"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/mypage");
                            }}
                          >
                          마이페이지
                          </NavLink>
                        </Media>
                        <Media right>
                          <Media object src={picture} alt="User Picture" className="rounded-circle ml-2" style={{ width: '40px', height: '40px' }} />
                        </Media>
                      </Media>
                    </NavItem>
                    
                  </>
                ) : (
                  // 로그인되지 않은 상태일 때
                  <NavItem>
                    <GoogleOauth />
                  </NavItem>
                )}
              </Nav>
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
};

export default DemoNavbar;
