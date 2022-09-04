//* 사용자 미들웨어를 직접 구현

const isLoggedIn = (req, res, next) => {
  console.log('/middlewares/어스미들웨어.js is로긴');
  // isAuthenticated()로 검사해 로그인이 되어있으면
  if (req.isAuthenticated()) {
    next(); // 다음 미들웨어
  } else {
    res.status(403).send('로그인 필요');
  }
};
const isNotLoggedIn = (req, res, next) => {
  console.log('/middlewares/어스미들웨어.js isnot로긴');
  if (!req.isAuthenticated()) {
    next(); // 로그인 안되어있으면 다음 미들웨어
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error=${message}`);
  }
};
export { isLoggedIn, isNotLoggedIn };
