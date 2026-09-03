import { createServer } from './app';

const port = Number(process.env.PORT || 4000);
const app = createServer();

app.listen(port, () => {
  console.log(`[inovative-api] listening on http://localhost:${port}`);
});
