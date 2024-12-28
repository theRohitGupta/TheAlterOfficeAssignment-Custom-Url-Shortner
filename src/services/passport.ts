import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../constants/variables/env-constants';
import User from '../models/user';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-__v'); // Exclude version key __v from query.
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
      proxy: true, // Required when behind a reverse proxy
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with the given Google ID
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          // If user exists, update their access token and return them
          existingUser.accessToken = accessToken;
          await existingUser.save();
          return done(null, existingUser);
        } else {
          // If user does not exist, create a new one
          const user = await new User({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            name: profile.displayName,
            accessToken, // Save access token
          }).save();

          return done(null, user);
        }
      } catch (err) {
        done(err, undefined);
      }
    }
  )
);