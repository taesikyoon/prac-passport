import passport from 'passport';
import passportConfig from './passport.js';
import authRouter from './routes/auth.js';
import express from 'express';
import { sequelize } from './models/index.js';
import dotenv from 'dotenv';
const app = express();

dotenv.config();
passportConfig(); // 패스포트 설정

app.set('port', 5000);

sequelize
  .sync({ force: false })
  .then(() => console.log('db connect'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

//* 라우터
app.use('/auth', authRouter);

app.listen(app.get('port'), () => console.log(app.get('port')));
