import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  Row,
  Col,
  FormGroup,
  Input,
} from "reactstrap";
import Plot from "react-plotly.js";
import ReactMarkdown from "react-markdown";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

import { useRecoilState } from 'recoil';
import { emailState, isLoginState } from './../../atoms';

const Write = () => {
  const mainRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useRecoilState(emailState); // Recoil 상태를 가져와서 초기화합니다.
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const { cor, ay, lry, rfy, gpt } = location.state || {};

  const [lrY, setLrY] = useState({ actual_y: [], pred_y: [] });
  const [rfY, setRfY] = useState({ actual_y: [], pred_y: [] });

  const [title, setTitle] = useState("");

  const keys = Object.keys(cor || {});
  const values = keys.map((key) => Object.values(cor[key]));

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    
    if (!isLogin) {
      navigate("/login");
    } else if (!location.state) {
      navigate("/");
    } else {
      setLrY({ actual_y: ay, pred_y: lry });
      setRfY({ actual_y: ay, pred_y: rfy });
    }
  }, [isLogin, location.state, navigate]);

  const handleInputChange = (e) => {
    setTitle(e.target.value);
  };

  const residuals = lrY.actual_y.map((y, i) => y - lrY.pred_y[i]);
  const residuals2 = rfY.actual_y.map((y, i) => y - lrY.pred_y[i]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("제목입력해조잉");
      return;
    }
    
    const 보낼거 = {
      cor,
      lrY,
      rfY,
      gpt,
      email,
      title
    };

    axios.post("http://34.64.92.85:3000/post", 보낼거)
    .then(response => {
      console.log(response.data.postId); 
      navigate(`/detail/${response.data.postId}`);
    })
    .catch(error => {
        if (error.response) {
            console.error('Response Error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request Error:', error.request);
        } else {
            console.error('Error:', error.message);
        }
        console.error('Config:', error.config);
    });
  };

  return (
    <>
      <DemoNavbar />
      <main className="profile-page" ref={mainRef}>
        <section className="section-profile-cover section-shaped my-0">
          {/* Circles background */}
          <div className="shape shape-style-1 shape-default alpha-4">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          {/* SVG separator */}
          <div className="separator separator-bottom separator-skew">
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
        <section className="section">
          <Card className="card-profile mt--300">
            <Row className="justify-content-center py-5">
              <Col xs="12" md="4">
                <FormGroup>
                  <h1 className="text-center mb-4">제목입력하셈요</h1>
                  <Input
                    placeholder="제목입력하셈요"
                    type="text"
                    value={title}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <form onSubmit={handleSubmit}>
              <div className="text-center mt-2 mb-5">
                <Button className="btn-1" color="primary" type="submit">
                  저장하기
                </Button>
              </div>
            </form>

            <div className="px-5 py-5">
              <Row className="row-grid">
                <Col lg="12" className="text-center">
                  <Plot
                    data={[
                      {
                        z: values,
                        x: keys,
                        y: keys,
                        type: "heatmap",
                        colorscale: "Viridis",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "상관계수 히트맵",
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: lrY.actual_y,
                        y: lrY.pred_y,
                        mode: "markers",
                        type: "scatter",
                        name: "Data points",
                      },
                      {
                        x: [
                          Math.min(...lrY.actual_y),
                          Math.max(...lrY.actual_y),
                        ],
                        y: [
                          Math.min(...lrY.actual_y),
                          Math.max(...lrY.actual_y),
                        ],
                        mode: "lines",
                        type: "scatter",
                        name: "Regression Line",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "선형회귀 산점도 그래프",
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: rfY.actual_y,
                        y: rfY.pred_y,
                        mode: "markers",
                        type: "scatter",
                        name: "Data points",
                      },
                      {
                        x: [
                          Math.min(...rfY.actual_y),
                          Math.max(...rfY.actual_y),
                        ],
                        y: [
                          Math.min(...rfY.actual_y),
                          Math.max(...rfY.actual_y),
                        ],
                        mode: "lines",
                        type: "scatter",
                        name: "Regression Line",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "랜덤 포레스트 산점도 그래프",
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: lrY.pred_y,
                        y: residuals,
                        mode: "markers",
                        type: "scatter",
                        name: "Residuals",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "선형 회귀 잔차 히스토그램",
                      xaxis: { title: "Predicted Y" },
                      yaxis: { title: "Residuals" },
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: rfY.pred_y,
                        y: residuals2,
                        mode: "markers",
                        type: "scatter",
                        name: "Residuals",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "랜덤 포레스트 잔차 히스토그램",
                      xaxis: { title: "Predicted Y" },
                      yaxis: { title: "Residuals" },
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: residuals,
                        type: "histogram",
                        name: "Residuals",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "선형 회귀 잔차",
                      xaxis: { title: "Residuals" },
                    }}
                  />
                </Col>

                <Col lg="6">
                  <Plot
                    data={[
                      {
                        x: residuals2,
                        type: "histogram",
                        name: "Residuals",
                      },
                    ]}
                    layout={{
                      width: 600,
                      height: 400,
                      title: "랜덤 포레스트 잔차",
                      xaxis: { title: "Residuals" },
                    }}
                  />
                </Col>
              </Row>

              <Row className="justify-content-center py-5">
                <Col xs="12" md="6">
                  <ReactMarkdown>{gpt}</ReactMarkdown>;
                </Col>
              </Row>
            </div>
          </Card>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Write;
