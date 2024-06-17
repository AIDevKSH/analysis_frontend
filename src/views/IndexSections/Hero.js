import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Row, Col } from "reactstrap";
import { useRecoilState } from 'recoil';
import { nameState, isLoginState } from './../../atoms';

const Hero = () => {
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [name, setName] = useRecoilState(nameState);

  return (
    <>
      <div className="position-relative">
        {/* Hero for FREE version */}
        <section className="section section-hero section-shaped">
          {/* Background circles */}
          <div className="shape shape-style-1 shape-default">
            <span className="span-150" />
            <span className="span-50" />
            <span className="span-50" />
            <span className="span-75" />
            <span className="span-100" />
            <span className="span-75" />
            <span className="span-50" />
            <span className="span-100" />
            <span className="span-50" />
            <span className="span-100" />
          </div>
          <Container className="shape-container d-flex align-items-center py-lg">
            <div className="col px-0">
              <Row className="align-items-center justify-content-center">
                <Col className="text-center" lg="6">
                  <p className="lead text-white">
                    csv 파일만 주면 상관 분석, 선형 회귀 분석, 랜덤 포레스트 분석 해주는 사이트입니다.
                  </p>
                  <div className="btn-wrapper mt-5">
                    <Button
                      className="btn-white btn-icon mb-3 mb-sm-0"
                      color="default"
                      href=""
                      size="lg"
                    >
                      <span className="btn-inner--icon mr-1">
                        <i className="fa fa-list" />
                      </span>
                      <span className="btn-inner--text">
                        <Link to="/community">구경하기</Link>
                      </span>
                    </Button>{" "}
                    <Button
                      className="btn-icon mb-3 mb-sm-0"
                      color="github"
                      href=""
                      size="lg"
                      target="_blank"
                    >
                      <span className="btn-inner--icon mr-1">
                        <i className="fa fa-google" />
                      </span>
                      <span className="btn-inner--text">
                        {isLogin ? (
                          // 로그인된 상태일 때
                          <span className="text-warning mr-1">
                            <Link to="/upload">{name}의 분석 시작하기</Link>
                          </span>
                        ) : (
                          // 로그인되지 않은 상태일 때
                          <span className="text-warning mr-1">
                            <Link to="/login">시작하기</Link>
                          </span>
                        )}
                      </span>
                    </Button>
                  </div>
                  <div className="mt-5">
                    <small className="text-white font-weight-bold mb-0 mr-2">
                      소프트웨어 설계 : 팀프로젝트
                    </small>
                  </div>
                </Col>
              </Row>
            </div>
          </Container>
          {/* SVG separator */}
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
      </div>
    </>
  );
};

export default Hero;
