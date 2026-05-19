import app from './app.js';
import { env } from './lib/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 DompetKu API running at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
  console.log(`📊 Environment:  ${env.NODE_ENV}\n`);
});
