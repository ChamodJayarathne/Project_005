const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const migrateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users without provider field
    const users = await User.find({ provider: { $exists: false } });
    
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      // Check if user has Google ID
      if (user.googleId) {
        user.provider = 'google';
        console.log(`Migrating Google user: ${user.email}`);
      } else {
        user.provider = 'local';
        console.log(`Migrating local user: ${user.email}`);
      }
      await user.save();
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
};

migrateUsers();