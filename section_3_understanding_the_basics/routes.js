const fs = require('fs');

const requestHandler = (req, res) => {

    const url = req.url;
    const method = req.method;

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>My First Page</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></input></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/message' && method === 'POST') {

        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });

        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            console.log(parsedBody);
            const msg = parsedBody.split('=')[1];
            fs.writeFile('message.txt', msg, err => {
                console.log("message.txt written to disk.");
            });
        });
    };

    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();

}

// export multiple things
module.exports = {
    handler: requestHandler,
    someText: 'Some hard coded text'
};

// this also works.
// module.exports.handler = requestHandler;
// module.exports.someText = 'Some hard coded text';

// this also works
// exports.handler = requestHandler;
// exports.someText = 'Some hard coded text';