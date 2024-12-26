// src/services/passport.ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../constants/variables/env-constants';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id })

        if (existingUser) {
          // Optionally update tokens if needed
          existingUser.accessToken = accessToken;
          await existingUser.save();
          return done(null, existingUser);
        }

        // Create a new user and save tokens
        const user = await new User({
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
          accessToken,
        }).save();

        done(null, user);
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);
