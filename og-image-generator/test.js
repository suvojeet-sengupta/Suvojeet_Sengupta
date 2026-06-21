import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting OG Image Generator server...');
const server = spawn('node', ['index.js'], {
  cwd: __dirname,
  env: { ...process.env, PORT: '5002' }
});

server.stdout.on('data', (data) => {
  console.log(`[Server]: ${data}`);
  if (data.toString().includes('listening on port 5002')) {
    runTest();
  }
});

server.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data}`);
});

async function runTest() {
  console.log('Sending test request to http://localhost:5002/og-image...');
  try {
    const res = await fetch('http://localhost:5002/og-image?title=Hello+World&subtitle=Test+Subtitle&category=Test');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outputPath = path.join(__dirname, 'test-output.png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Test passed! OG Image generated successfully and saved to ${outputPath}`);
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    console.log('Stopping server...');
    server.kill();
    process.exit(0);
  }
}

// Timeout backup
setTimeout(() => {
  console.error('Test timed out after 30 seconds.');
  server.kill();
  process.exit(1);
}, 30000);
