import dns from 'dns';
import { promisify } from 'util';

const resolveSrv = promisify(dns.resolveSrv);
const resolveTxt = promisify(dns.resolveTxt);

async function resolveMongoSRV() {
  try {
    console.log('Attempting to resolve MongoDB SRV records...\n');
    
    const srvDomain = '_mongodb._tcp.cluster0.oz3yftq.mongodb.net';
    console.log(`Looking up: ${srvDomain}`);
    
    const records = await resolveSrv(srvDomain);
    console.log('\n✅ SRV Records found:');
    records.forEach((record, i) => {
      console.log(`  ${i + 1}. ${record.name}:${record.port} (priority: ${record.priority})`);
    });
    
    // Try to get TXT records for connection options
    try {
      const txtRecords = await resolveTxt('cluster0.oz3yftq.mongodb.net');
      console.log('\n📝 TXT Records:');
      txtRecords.forEach(record => {
        console.log(`  ${record.join('')}`);
      });
    } catch (txtError) {
      console.log('\n⚠️  No TXT records found');
    }
    
    // Construct standard connection string
    const hosts = records.map(r => `${r.name}:${r.port}`).join(',');
    console.log('\n📋 Standard Connection String:');
    console.log(`mongodb://tinclo_amar:Tinclo2026@${hosts}/job-swipe-matcher?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority`);
    console.log('\nNote: Replace "atlas-xxxxx-shard-0" with your actual replica set name from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Error resolving SRV records:', error.message);
    console.log('\nThis means:');
    console.log('1. The cluster might not exist or is not accessible');
    console.log('2. Your network might be blocking DNS SRV lookups');
    console.log('3. The cluster name might be incorrect');
    console.log('\nPlease check your MongoDB Atlas dashboard and verify:');
    console.log('- The cluster exists and is running');
    console.log('- Your IP is whitelisted in Network Access');
    console.log('- The cluster name is exactly "Cluster0"');
  }
}

resolveMongoSRV();
