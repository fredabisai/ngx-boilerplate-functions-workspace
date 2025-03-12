// Add polyfills for Node.js modules
import * as process from 'process';
import { Buffer } from 'buffer';

// Assign to global window object for compatibility
window['process'] = process;
window['Buffer'] = Buffer;
