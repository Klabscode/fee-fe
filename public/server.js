const { execSync } = require('child_process');
const localIpUrl = require('local-ip-url');

const ip = localIpUrl('public');
const port = 3001;

console.log(`Starting server on http://${ip}:${port}`);
execSync(`react-scripts start`, { stdio: 'inherit', env: { ...process.env, PORT: port, HOST: ip } });