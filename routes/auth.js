import express from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/authmiddleware.js';
import User from '../models/user.js';

const router = express.Router();

/* **************************************************************************************** */

//* 로그인 요청
// 사용자 미들웨어 isNotLoggedIn 통과해야 async (req, res, next) => 미들웨어 실행
router.get('/auth/github', passport.authenticate('github'));

router.get(
  '/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    const token = req.user.token;
    console.log(token);
    res.json({ token, success: true });
  }
);

/* **************************************************************************************** */

//* 로그아웃 (isLoggedIn 상태일 경우)
router.get('/logout', isLoggedIn, (req, res) => {
  // req.user (사용자 정보가 안에 들어있다. 당연히 로그인되어있으니 로그아웃하려는 거니까)
  req.logout();
  req.session.destroy(); // 로그인인증 수단으로 사용한 세션쿠키를 지우고 파괴한다. 세션쿠키가 없다는 말은 즉 로그아웃 인 말.
  res.redirect('/');
});

export default router;

// 내 서버 띄워서 post 요청으로 진행 되는지 보기
