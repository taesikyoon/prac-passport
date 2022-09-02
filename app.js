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
  .sync({ force: true })
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
    },
    async function (accessToken, refreshToken, profile, cb) {
      console.log(`accessToken = ${accessToken}`);
      console.log(`refreshToken = ${refreshToken}`);
      console.log(`profile = ${profile}`);

      await User.create({ githubId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

app.get('/auth/github', passport.authenticate('github'));

app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.listen(app.get('port'), () => console.log(app.get('port')));
