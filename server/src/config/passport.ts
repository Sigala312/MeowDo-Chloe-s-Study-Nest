import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthService } from '../modules/auth/auth.service.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const result = await AuthService.handleGoogleUser(profile, accessToken, refreshToken);
        return done(null, result);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;