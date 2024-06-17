// GoogleOauth.js

import React from 'react';
import { GoogleLogin } from "@react-oauth/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from 'recoil';
import { emailState, nameState, pictureState, isLoginState } from './../../atoms'; // atoms.js 파일의 상태를 가져옵니다.

const clientId = '827572178162-s3v1tdhui2v3j7f0oc05co7mk3iimsp8.apps.googleusercontent.com';

function GoogleOauth() {
  const [email, setEmail] = useRecoilState(emailState); // Recoil 상태를 가져와서 초기화합니다.
  const [name, setName] = useRecoilState(nameState);
  const [picture, setPicture] = useRecoilState(pictureState);
  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const navigate = useNavigate();

  const handleSuccess = async (res) => {

    var token = res.credential;
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const decodedPayload = new TextDecoder().decode(
      Uint8Array.from(atob(tokenParts[1]), c => c.charCodeAt(0))
    );
    const payload = JSON.parse(decodedPayload);

    const userName = payload.given_name
    const userEmail = payload.email
    const userPicture = payload.picture

    const dataToSend = {
      name: userName,
      email: userEmail,
      picture: userPicture,
    };

    try {
      const response = await axios.post("http://34.64.92.85:3000/login", dataToSend);
      setEmail(userEmail) // Recoil 상태를 업데이트합니다.
      setName(userName)
      setPicture(userPicture)
      setIsLogin(true)
      navigate('/')
    } catch (error) {
      console.error("Error :", error);
    }
  };


  const handleFailure = (err) => {
    console.log(err);
  };

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onFailure={handleFailure}
        />
      </GoogleOAuthProvider>
    </>
  );
}

export default GoogleOauth;
