import * as process from 'process';

// Polyfill process for browser
(window as any).process = {
  ...process,
  cwd: () => '/',  // Mock cwd function
  env: { NODE_ENV: 'development' }  // Default env
};
