// migration/updateOrderFields.js
const mongoose = require('mongoose');
const Order = require('../models/Order');

async function migrateOrders() {
  try {
    console.log('Starting migration...');
    
    // Find all orders without quantity field
    const ordersWithoutQuantity = await Order.find({ 
      quantity: { $exists: false } 
    });
    
    console.log(`Found ${ordersWithoutQuantity.length} orders without quantity field`);
    
    for (const order of ordersWithoutQuantity) {
      // Set default values for missing fields
      await Order.findByIdAndUpdate(order._id, {
        $set: {
          quantity: 1, // Default value
          sellingUnitPrice: order.unitPrice || 0 // Default to unitPrice if available
        }
      });
      console.log(`Updated order ${order._id}`);
    }
    
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  mongoose.connect(process.env.MONGO_URI, {})
    .then(() => migrateOrders())
    .catch(err => {
      console.error('DB connection failed:', err);
      process.exit(1);
    });
}