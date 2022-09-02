import express from 'express';
import express_session from 'express-session';
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
      callbackURL: 'http://localhost:5000/github/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      // console.log(`accessToken = ${accessToken}`);
      // console.log(`refreshToken = ${refreshToken}`);
      // console.log(`profile = ${profile.username}`);
      console.log(profile);
      const {
        _json: { id, email },
      } = profile;

      try {
        const user = await User.findOne({ email });
        if (user) {
          user.githubId = id;
          user.save();
          return cb(null, user);
        } else {
          const user2 = await User.create({
            githubId: profile.id,
          });
          // console.log(user2);
          return cb(null, user2);
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
// controller
app.get('/auth/github', passport.authenticate('github'));

// 라우터자리
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.listen(app.get('port'), () => console.log(app.get('port')));
