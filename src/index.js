// Import necessary modules
import  express  from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import authRouter from './routes/authRoutes.js'
import postRouter from './routes/postRoutes.js'
import authenticate from './middleware/authenticate.js';
// Initialize an Express application
const app = express();

//Creating a rate limiter for some routes to protect against brute force attacks
const apiLimiter = rateLimit({
  windowMs:  15 *  60 *  1000,
  max:  100, 
  message: "Too many requests from this IP, please try again after an hour",
});

// Use various middleware
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security HTTP headers
app.use(morgan('dev')); // Log HTTP requests to the console in 'dev' format
app.use(express.json()); // Parse JSON request bodies

//Routers go here

app.use('/api/auth',rateLimit,authRouter)
app.use(authenticate)
app.use('/api/posts',postRouter)


//error middlware
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Internal server error');
});
// Connect to the database
await connectDB(process.env.MONGO_URI)

// Start the server on the port specified in the environment variables
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
