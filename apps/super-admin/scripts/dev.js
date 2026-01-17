const { spawn } = require('child_process');
const os = require('os');

function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();
const port = 3003;

console.log('\n🚀 Starting Super Admin...\n');
console.log(`  ✓ Local:   http://localhost:${port}`);
console.log(`  ✓ Network: http://${localIP}:${port}`);
console.log('\n');

// Start Next.js dev server
const next = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true
});

next.on('close', (code) => {
    process.exit(code);
});

process.on('SIGINT', () => {
    next.kill('SIGINT');
});

process.on('SIGTERM', () => {
    next.kill('SIGTERM');
});
