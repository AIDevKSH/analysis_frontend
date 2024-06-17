// atoms.js

import { atom } from 'recoil';

export const emailState = atom({
  key: 'emailState',
  default: '',
});

export const nameState = atom({
  key: 'nameState',
  default: '',
});

export const pictureState = atom({
  key: 'pictureState',
  default: '',
});

export const isLoginState = atom({
  key: 'isLoginState',
  default: false,
});
