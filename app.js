import express from 'express';
import session from 'express-session';
import GitHubStrategy from 'passport-github2';
import passport from 'passport';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import User from './models/user.js';
import fetch from 'node-fetch';
import axios from 'axios';

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
      callbackURL: 'http://localhost:5000/github/callback',
      scope: ['user:email'],
    },
    async function (accessToken, refreshToken, profile, cb) {
      // console.log(`accessToken = ${accessToken}`);
      // console.log(`refreshToken = ${refreshToken}`);
      // console.log(`profile = ${profile.username}`);
      // console.log(profile);
      const {
        _json: { id, email },
      } = profile;

      try {
        const user = await User.findOne({ where: id });
        if (user) {
          user.githubId = id;
          user.save();
          return cb(null, user, { message: 'true' });
        } else {
          const user2 = await User.create({
            githubId: profile.id,
          });
          // console.log(user2);
          return cb(false, user2);
        }
      } catch (error) {
        return cb(error);
      }
      // await User.create({ githubId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});
// controller
app.get('/auth/github', passport.authenticate('github'));

// 라우터자리
app.get(
  '/github/callback',
  passport.authenticate('github', (error, userInfo, isUser) => {
    console.log(isUser);
    console.log(userInfo);
    res.redirect('/test');
  })
);

app.get('/test', (req, res, next) => {
  res.send('성공했다');
});

app.listen(app.get('port'), () => console.log(app.get('port')));
