import app from './app';
import config from './config';

const PORT = config.port || 3005;

app.listen(PORT, () => {
  console.log(`SK8 Payment Service is running on port ${PORT}`);
});