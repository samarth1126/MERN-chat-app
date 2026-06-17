const mongoose=require("mongoose");
const colors = require("colors");
const connectDB=async()=>{
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        // useFindAndModify: true,
      });
      console.log(
        `Connected Successfully to MongoDB : ${conn.connection.host}`.cyan.bold,
      );
    } catch (error) {
      console.log("FULL ERROR:");
      console.dir(error, { depth: null });
      process.exit(1);
    }
}

module.exports=connectDB;