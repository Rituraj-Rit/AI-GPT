let mongoose = require("mongoose");

async function ConnectToDB() {
  try {
    await mongoose.connect(process.env.MONOGODB_URL).then(() => {
      console.log("Connect To DB");
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = ConnectToDB