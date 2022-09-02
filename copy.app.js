import express from 'express';
import GitHubStrategy from 'passport-github';
import passport from 'passport';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import User from './models/user.js';
dotenv.config();

const app = express();

app.set('port', 5000);

sequelize
  .sync({ force: false })
  .then(() => console.log('db connect'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(`accessToken = ${accessToken}`);
      console.log(`refreshToken = ${refreshToken}`);
      console.log(`profile.id = ${profile.id}`);
      console.log(`profile.username = ${profile.username}`);
      console.log(`profile.profileUrl = ${profile.profileUrl}`);
      console.log(`profile.provider = ${profile.provider}`);

      return cd(
        null,
        await User.create({ githubId: profile.id }),
        (err, user) => {
          return cb(err, user);
        }
      );
    }
  )
);
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
  done(null, id);
});

app.get('/auth/github', passport.authenticate('github'), (req, res) => {
  console.log('어떤 상황이죠');
});

app.get(
  '/callback',
  passport.authenticate('github', {
    successRedirect: '/success',
    failureRedirect: '/',
  }),
  (req, res) => {
    console.log(' 도착 했니');
    // Successful authentication, redirect home.
    res.redirect('/success');
  }
);
app.get('/success', (req, res) => {
  res.send('성공했어요 로그인을');
});

app.listen(app.get('port'), () => console.log(app.get('port')));
