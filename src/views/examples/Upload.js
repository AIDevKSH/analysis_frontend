import React, { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Spinner } from "reactstrap";

// reactstrap components
import { Card, Container, Row } from "reactstrap";

// core components
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";

import { useRecoilState } from 'recoil';
import { isLoginState } from './../../atoms';

const Upload = () => {
  const mainRef = useRef(null);

  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
    if (!isLogin) {
      navigate("/login");
    }
  }, []);

  const [independentVars, setIndependentVars] = useState("");
  const [dependentVar, setDependentVar] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      alert("CSV파일 올리셈여");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("independentVars", independentVars);
    formData.append("dependentVar", dependentVar);

    try {
      const response = await axios.post(
        "http://34.64.92.85:3000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      const cor = data.correlation_analysis;
      const lr = data.linear_regression;
      const rf = data.random_forest_regression;
      const vif = data.vif;
      const yValues = data.y_values;
      const ay = yValues.actual_y;
      const lry = yValues.linear_regression_y;
      const rfy = yValues.random_forest_regression_y;
      const gpt = response.data.gpt_response;

      navigate("/write", { state: { cor, ay, lry, rfy, gpt } });
    } catch (error) {
      console.error("Error uploading file:", error);
      setLoading(false); 
      setError("정확한 변수명을 입력하셈여"); 
    } finally {
      setLoading(false); 
    }
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
          <Container>
            <Card className="card-profile shadow mt--300">
              <div className="px-4">
                <Row className="justify-content-center"></Row>
                <div className="text-center mt-5 mb-5">
                  <div className="h6 font-weight-300">
                    <div>
                      <h1 className="mb-4">CSV Uploader</h1>
                      <form onSubmit={handleSubmit}>
                        <div
                          {...getRootProps()}
                          style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            cursor: "pointer",
                          }}
                          className="mb-4"
                        >
                          <input {...getInputProps()} />
                          <p>파일을 드래그 하거나 더블클릭 해보세요.</p>
                        </div>
                        <div className="mb-2">
                          <label>
                            독립변수들 (쉼표로 구분):
                            <input
                              type="text"
                              value={independentVars}
                              onChange={(e) =>
                                setIndependentVars(e.target.value)
                              }
                              required
                            />
                          </label>
                        </div>
                        <div className="mb-2">
                          <label>
                            종속변수:
                            <input
                              type="text"
                              value={dependentVar}
                              onChange={(e) => setDependentVar(e.target.value)}
                              required
                            />
                          </label>
                        </div>
                        <Button className="btn-1" color="primary" type="submit" disabled={loading}>
                          {loading ? <Spinner size="sm" /> : "업로드"}
                        </Button>
                        {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Container>
        </section>
      </main>
      <SimpleFooter />
    </>
  );
};

export default Upload;
