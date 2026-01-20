const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // User exists - update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.emails[0].value.split("@")[0] + "_google",
          // Generate random password for Google users (won't be used for login)
          password: require("crypto").randomBytes(16).toString("hex"),
          plainPassword: "google_auth",
          phoneNumber: "+1234567890", // Default phone number
          role: "user",
          profileImage: profile.photos[0]?.value || null,
          isGoogleAuth: true,
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;


// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const User = require("../models/User");

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "/api/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       try {
//         // Check if user already exists
//         let user = await User.findOne({ googleId: profile.id });

//         if (user) {
//           return done(null, user);
//         }

//         // Check if email already exists in database
//         user = await User.findOne({ email: profile.emails[0].value });

//         if (user) {
//           // Link Google account to existing user
//           user.googleId = profile.id;
//           user.isGoogleAuth = true;
//           await user.save();
//           return done(null, user);
//         }

//         // Create new user
//         const newUser = new User({
//           googleId: profile.id,
//           username: profile.displayName || profile.emails[0].value.split("@")[0],
//           email: profile.emails[0].value,
//           password: null, // No password for Google auth
//           phoneNumber: "+0000000000", // Default phone number
//           role: "user",
//           profileImage: profile.photos?.[0]?.value || null,
//           isGoogleAuth: true,
//         });

//         await newUser.save();
//         done(null, newUser);
//       } catch (error) {
//         done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });

// module.exports = passport;