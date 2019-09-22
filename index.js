const express = require('express'),
      app     = express(),
      path    = require('path');


app.use(express.static(`${__dirname}/public`));

app.get("/", () =>{
    
});

app.listen(process.env.PORT || 1234, () =>{
    console.log("Server is listening");
});