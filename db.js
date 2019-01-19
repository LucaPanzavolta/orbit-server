// CONNECTING TO mLab DATABASE
<<<<<<< HEAD
/* const mongoose = require('mongoose');
 */require('dotenv').config();
=======
require('dotenv').config();
const mongoose = require('mongoose');
>>>>>>> 538fba332fb6b3d16e02db65e5e6a99659357a86

/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */

<<<<<<< HEAD
/* const options = {
  server: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 300000,
      connectTimeoutMS: 30000
    }
  }
};

const mongodbUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(mongodbUri, options)
  .then(() => {
    console.log('Connected to Orbits database');
  })
  .catch(err => {
    console.log('Connection error', err);
  }) */
=======
// OPTIONS FOR CONNECTION TO mLab DATABASE
>>>>>>> 538fba332fb6b3d16e02db65e5e6a99659357a86

// const options = {
//   server: {
//     socketOptions: {
//       keepAlive: 300000,
//       connectTimeoutMS: 30000
//     }
//   },
//   replset: {
//     socketOptions: {
//       keepAlive: 300000,
//       connectTimeoutMS: 30000
//     }
//   }
// };

<<<<<<< HEAD
// CONNECTING TO LOCAL DATABASE
const mongoose = require('mongoose');

=======
// const mongodbUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// mongoose.connect(mongodbUri, options)
//   .then(() => {
//     console.log('Connected to Orbits database');
//   })
//   .catch(err => {
//     console.log('Connection error', err);
//   })



// CONNECTING TO LOCAL DATABASE
>>>>>>> 538fba332fb6b3d16e02db65e5e6a99659357a86
mongoose.connect('mongodb://localhost/orbit-database')
  .then(() => {
    console.log('Connected to Orbits database');
  })
  .catch(err => {
    console.log('Cannot connect, wrong path');
  })
