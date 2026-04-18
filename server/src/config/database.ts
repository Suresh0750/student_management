import mongoose from "mongoose";


  const DBConnect = async () => {
    try {
        console.log(process.env.MONGODB_URI+' is connected');
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err);
    }
  }

  export default DBConnect;