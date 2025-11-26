const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/books/stats',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Resposta:', data);
  });
});

req.on('error', (err) => {
  console.error('Erro:', err.message);
});

req.end();
