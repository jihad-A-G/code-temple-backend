// Import necessary modules
import  express  from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';

// Initialize an Express application
const app = express();

// Use various middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security HTTP headers
app.use(morgan('dev')); // Log HTTP requests to the console in 'dev' format
app.use(express.json()); // Parse JSON request bodies


// Connect to the database
await connectDB(process.env.MONGO_URI)

// Start the server on the port specified in the environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
