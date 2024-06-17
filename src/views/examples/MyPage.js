/*!

=========================================================
* Argon Design System React - v1.1.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import DemoNavbar from "components/Navbars/DemoNavbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import { useRecoilState } from 'recoil';
import { isLoginState, emailState } from './../../atoms';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MyPage = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6); // Number of posts per page

  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useRecoilState(isLoginState);
  const [email, setEmail] = useRecoilState(emailState);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;

    if (!isLogin) {
      navigate("/login");
    }

    axios.get(`http://34.64.92.85:3000/mypage/${email}`)
      .then(response => {
        setPosts(response.data.posts)
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Handle delete post
  const handleDelete = (id) => {
    axios.delete(`http://34.64.92.85:3000/delete/${id}`)
      .then(response => {
        console.log('Post deleted:', response);
        // Update the posts state by filtering out the deleted post
        setPosts(posts.filter(post => post.id !== id));
      })
      .catch(error => {
        console.error('Error deleting post:', error);
      });
  };

  return (
    <>
      <DemoNavbar />
      <main>
        <div className="position-relative">
          <section className="section section-lg section-shaped pb-250">
            <div className="shape shape-style-1 shape-default">
              {[...Array(9)].map((_, i) => <span key={i} />)}
            </div>
            <Container className="py-lg-md d-flex">
              <div className="col px-0">
                <Row>
                  <Col lg="6">
                    <h1 className="display-3 text-white">
                      A beautiful 마이페이지
                    </h1>
                    <div className="btn-wrapper"></div>
                  </Col>
                </Row>
              </div>
            </Container>
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
        </div>

        <section className="section section-lg pt-lg-0 mt--200">
          <Container>
            <Row className="justify-content-center">
              <Col lg="12">
                <Row className="row-grid">
                  {currentPosts.map((item, index) => (
                    <Col lg="4" className="my-4" key={index}>
                      <Card className="card-lift--hover shadow border-0">
                        <CardBody className="py-5">
                          <h6 className="text-primary text-uppercase mb-4">
                            {item.title}
                          </h6>
                          <p className="description mt-3">{item.users.name}</p>
                          <p className="description mt-3">{item.created_at}</p>
                          <p className="description mt-3">
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </p>
                          <Button
                            className="mt-4"
                            color="primary"
                            tag={Link} // Use Link from react-router-dom
                            to={`/detail/${item.id}`} // Navigate to detail page
                          >
                            더보기
                          </Button>
                          <Button
                            className="mt-4"
                            color="danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            삭제하기
                          </Button>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Pagination */}
        <section className="section section-lg">
          <Container className="text-center">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                >
                  이전
                </Button>
              </li>
              {/* Example of page numbers, adjust based on total posts */}
              <li className="page-item">
                <Button className="page-link" onClick={() => paginate(1)}>
                  1
                </Button>
              </li>
              <li className="page-item">
                <Button className="page-link" onClick={() => paginate(2)}>
                  2
                </Button>
              </li>
              <li className="page-item">
                <Button className="page-link" onClick={() => paginate(3)}>
                  3
                </Button>
              </li>
              {/* Add more page buttons as needed */}
              <li className={`page-item ${currentPage === Math.ceil(posts.length / postsPerPage) ? 'disabled' : ''}`}>
                <Button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
                  다음
                </Button>
              </li>
            </ul>
          </Container>
        </section>

        
        
      </main>
      <SimpleFooter />
    </>
  );
};

export default MyPage;
