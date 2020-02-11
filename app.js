const config = require('config');
const express = require('express');
const path = require('path');
const app = express();
const PORT = config.get('PORT') || 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./api/auth');
const feedRoutes = require('./api/feed');

const createFakeData = require('./utils/fake_data')


app.use(cors());
app.use(bodyParser.json());



async function run() {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT || PORT, () => {
      createFakeData();
      console.log(`Server is running on port ${ PORT }...`)
    })
  } catch (err) {
    console.log("Server Error", err);
    process.exit(1)
  }
}



if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send(200, "This is \"Hello\" from The Blog server!")
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/feed', feedRoutes);



run();
