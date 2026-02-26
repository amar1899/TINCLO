import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Test standard MongoDB connection
const standardUri = 'mongodb+srv://tinclo_amar:Tinclo2026@cluster0.oz3yftq.mongodb.net/job-swipe-matcher?retryWrites=true&w=majority';

console.log('Testing standard MongoDB connection...');
console.log('Attempting to connect to:', standardUri.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(standardUri, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('✅ SUCCESS! Standard MongoDB connection works!');
    console.log('You can now use POST, PUT, DELETE operations.');
    console.log('\nUpdate your .env file to use this connection string.');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ FAILED! Standard MongoDB connection error:', error.message);
    console.error('\nPossible reasons:');
    console.error('1. Your IP address is not whitelisted in MongoDB Atlas');
    console.error('2. Network/firewall blocking the connection');
    console.error('3. DNS resolution issues');
    console.error('\nYour current IP address is: (checking...)');
    
    // Try to get IP
    import('https').then(https => {
      https.get('https://api.ipify.org?format=json', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          const ip = JSON.parse(data).ip;
          console.error(`Your IP: ${ip}`);
          console.error(`\nGo to MongoDB Atlas → Network Access → Add IP Address: ${ip}`);
          process.exit(1);
        });
      }).on('error', () => {
        console.error('Could not determine IP address');
        process.exit(1);
      });
    });
  });
