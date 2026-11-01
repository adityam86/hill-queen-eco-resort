// Hill Queen Eco Resort - GoDaddy cPanel / Passenger Production Server
// Compatible with Node.js 18.x, 20.x, and 22.x

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error handling request:', req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    });

    server.listen(port, () => {
      console.log(`> Hill Queen Eco Resort is listening on port ${port} (PID: ${process.pid})`);
      console.log(`> Domain: https://hillqueenecoresorts.com`);
    });
  })
  .catch((err) => {
    console.error('Failed to start Next.js production server:', err);
    process.exit(1);
  });

