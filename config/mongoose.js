const mongoose = require('mongoose');

const connectToDatabase = () => {
  mongoose.connect('mongodb+srv://puneethchandran22:ehgICGBXriX56UzK@cluster0.qecaewe.mongodb.net/test')
    .then(() => {
      console.log('Database connected');
    })
    .catch((err) => {
      console.log('Error connecting to database');
      console.log(err);
    });
};

module.exports = connectToDatabase;
