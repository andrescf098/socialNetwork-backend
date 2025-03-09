const db = require("mongoose");
const config = require("../config");

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);
const URI = `mongodb+srv://${USER}:${PASSWORD}@cluster0.vde6448.mongodb.net/${config.db}?retryWrites=true&w=majority&appName=Cluster0`;
db.Promise = global.Promise;
const clientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

const connect = async () => {
  try {
    await db.connect(URI, clientOptions);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};
module.exports = connect;
