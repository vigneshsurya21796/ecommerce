const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conectdb = await mongoose.connect(process.env.serverDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Databse is connected: ${conectdb.connection.host}`.red.underline
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
