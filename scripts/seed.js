const { execSync } = require('child_process');

const maxAttempts = 15;
const delayMs = 2000;

for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
  try {
    console.log(`Attempt ${attempt}/${maxAttempts} to run seed.populate...`);
    execSync('npx convex run seed.populate --deployment local', {
      stdio: 'inherit',
      shell: true,
    });
    console.log('Seed mutation completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error(`Attempt ${attempt} failed.`);
    if (attempt === maxAttempts) {
      console.error('Seed mutation failed after maximum retries.');
      console.error(error.message);
      process.exit(1);
    }
    console.log(`Retrying in ${delayMs / 1000}s...`);
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
  }
}
