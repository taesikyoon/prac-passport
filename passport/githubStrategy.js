import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import User from '../models/user.js';
import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
export default () => {
  //? auth 라우터에서 /login 요청이 오면 local설정대로 이쪽이 실행되게 된다.
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: 'user:email',
        //* req.body 객체인자 하고 키값이 일치해야 한다.
        /*
            session: true, // 세션에 저장 여부
            passReqToCallback: false, 
            	express의 req 객체에 접근 가능 여부. true일 때, 뒤의 callback 함수에서 req 인자가 더 붙음. 
           		async (req, email, password, done) => { } 가 됨
            */
      },
      //* 콜백함수의  email과 password는 위에서 설정한 필드이다. 위에서 객체가 전송되면 콜백이 실행된다.
      async (accessToken, refreshToken, profile, done) => {
        console.log('/passport/githubStrategy.js');
        console.log(accessToken);
        try {
          // github에서 넘겨준 profile에서 디비에 소셜 아이디 존재 유무 확인
          const exUser = await User.findOne({
            where: { githubId: profile.id },
          });
          // 만일 가입된 회원이면
          if (exUser) {
            const token = Jwt.sign(
              {
                user_name: exUser.userName,
                id: exUser.id,
              },
              'qwe',
              { expiresIn: '1h' }
            );

            exUser.token = token;
            console.log('/passport/githubStrategy.js 기존유저');
            done(null, exUser, { message: '기존 유저' }); //? 성공이면 done()의 2번째 인수에 선언
          } else {
            console.log('/passport/githubStrategy.js 신규유저');
            // 가입되지 않았으면 가입시킨다.
            const newUser = await User.create({
              githubId: profile.id,
              email: profile.emails[0].value,
              userName: profile.username,
            });
            const token = Jwt.sign(
              {
                user_name: newUser.userName,
                id: newUser.id,
              },
              'qwe',
              { expiresIn: '1h' }
            );
            newUser.token = token;
            done(null, newUser, { message: '신규 유저' }); //? 실패면 done()의 2번째 인수는 false로 주고 3번째 인수에 선언
          }
          //? done()을 호출하면, /login 요청온 auth 라우터로 다시 돌아가서 미들웨어 콜백을 실행하게 된다.
        } catch (error) {
          // DB에 해당 이메일이 없다면, 회원 가입 한적이 없다.
          console.log('에러?');
          console.error(error);
          done(error); //? done()의 첫번째 함수는 err용. 특별한것 없는 평소에는 null로 처리.
        }
      }
    )
  );
};
