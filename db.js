// CONNECTING TO mLab DATABASE
require('dotenv').config();
const mongoose = require('mongoose');

/*
 * Mongoose by default sets the auto_reconnect option to true.
 * We recommend setting socket options at both the server and replica set level.
 * We recommend a 30 second connection timeout because it allows for
 * plenty of time in most operating environments.
 */

// OPTIONS FOR CONNECTION TO mLab DATABASE

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

// const mongodbUri = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// mongoose.connect(mongodbUri, options)
//   .then(() => {
//     console.log('Connected to Orbits database');
//   })
//   .catch(err => {
//     console.log('Connection error', err);
//   })



// CONNECTING TO LOCAL DATABASE
mongoose.connect('mongodb://localhost/orbit-database')
  .then(() => {
    console.log('Connected to Orbits database');
  })
  .catch(err => {
    console.log('Cannot connect, wrong path');
  })
