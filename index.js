const http = require('http');
const fs = require('fs');
const ngrok = require('ngrok');

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Serve index.html file
  fs.readFile('index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Start ngrok to port forward
  ngrok.connect(PORT)
    .then(url => {
      console.log(`ngrok tunnel running at ${url}`);
    })
    .catch(err => {
      console.error('Error starting ngrok:', err);
    });
});

// Save authentication info
server.on('request', (req, res) => {
  // Assuming authentication data is sent via POST request
  if (req.method === 'POST' && req.url === '/authenticate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Parse authentication data
      const authData = JSON.parse(body);
      // Save authentication data to a file or database
      fs.writeFile('authData.json', JSON.stringify(authData), err => {
        if (err) {
          console.error('Error saving authentication data:', err);
          res.writeHead(500);
          return res.end('Error saving authentication data');
        }
        res.writeHead(200);
        res.end('Authentication data saved successfully');
      });
    });
  }
});

