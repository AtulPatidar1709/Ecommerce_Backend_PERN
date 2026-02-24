import { config } from "./config/config.js";
import { app } from "./index.js"

const startServer = async () => {
  try {
    const port = config.port || 5513;

    app.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server', error);
    process.exit(1);
  }
};

startServer();
