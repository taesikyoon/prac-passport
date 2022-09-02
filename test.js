import passport from 'passport';
import express from 'express';
import Strategy from 'passport-strategy';
const app = express();

// passport init
app.use(passport.initialize());

// Strategy 인증 방법
passport.use(new Strategy((username, password, done) => {}));

// 인증 요청
app.post('/login', passport.authenticate('인증요청'));
// 인증 성공 시 메세지와 코드 / 성공 페이지 이동
// 인증 실패 시 메세지와 코드 / 실패 페이지 이동

// 세션 기록과 읽기
// serializeUser 기록
// 로그인이 성공했을 때 동작 ( 로그인 요청 마다)
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserializeUser 읽기
// 모든 요청마다 사용자의 인증 정보 ( 인증된 사용자만 가능한 )
// 세션에서 읽어온 데아터 req.user
passport.deserializeUser((id, done) => {
  done(null, user);
});
