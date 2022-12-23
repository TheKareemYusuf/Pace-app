const app = require('./app');


const PORT = process.env.PORT || 8000


app.listen(PORT, () => {
    console.log(`app is listening on the port ${PORT}`);
  });