const http = require('http');

http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>A list of Users</title></head>');
        res.write('<body>');
        res.write('<h2>Hello!</h2>');
        res.write('<form action="/create-user" method="POST"><input type="text" name="username"><button type="submit">Send</button></input></form>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    } else if (url === '/users') {
        res.write('<html>');
        res.write('<head><title>A list of Users</title></head>');
        res.write('<body>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('</body>');
        res.write('</html>');
        res.end();
    } else if (url === '/create-user' && method === 'POST') {
        const form_body = [];
        req.on('data', chunk => {
            form_body.push(chunk);
        })
        req.on('end', () => {
            console.log(form_body.length);
            console.log(form_body);
            console.log(Buffer.concat(form_body).toString().split("=")[1]);
        })
        res.statusCode = 302;
        res.setHeader('Location', '/');
        res.end();
    }
}).listen(3000);