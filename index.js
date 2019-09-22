const express     = require('express'),
      app         = express(),
      compression = require('compression');;


app.use(express.static(`${__dirname}/public`));
app.use(compression());


app.get("/", (req, res) => {

    res.status(200)
        .type('html')
        .sendFile(__dirname + '/views' + '/index.html');

});


app.get('*', function (req, res) {
    res.status(404).send('what???');
});


app.listen(process.env.PORT || 1234, () => {
    console.log("Server is listening");
});



// trying to get the compression middleware design to be in a modular / OOP Style 


// request comes in
// look at header to find compression options 
// compress the body of our request with chosen Compression technique
