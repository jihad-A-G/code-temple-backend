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
import commentRouter from './routes/commentRoutes.js'
import updateRequestRouter from './routes/updateRequestRoutes.js';
import roomRouter from './routes/roomRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import authenticate from './middleware/authenticate.js';
import io from './config/socket-io.js'
import {createServer} from 'http'
// Initialize an Express application
const app = express();

//Creating a rate limiter for some routes to protect against brute force attacks
const apiLimiter = rateLimit({
  windowMs:  15 *  60 *  1000,
  max:  100, 
  message: "Too many requests from this IP, please try again after an hour",
});

// Use various middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
 })); // Enable CORS
app.use(helmet()); // Set security HTTP headers
app.use(morgan('dev')); // Log HTTP requests to the console in 'dev' format
app.use(express.json()); // Parse JSON request bodies

//Routers go here

app.use('/api/auth',authRouter)
app.use(authenticate)
app.use('/api/posts',postRouter)
app.use('/api/comments',commentRouter)
app.use('/api/requests',updateRequestRouter)
app.use('/api/rooms',roomRouter)
app.use('/api/messages',messageRouter)

//error middlware
app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Internal server error');
});

// Connect to the database
await connectDB(process.env.MONGO_URI)

//connect to socket io
const httpServer = createServer(app)

 io.attach(httpServer)


io.on('connection', (socket)=>{
  console.log('Client id: ',socket.id);
  socket.on('joinRoom',(roomId)=>{
    socket.join(roomId)
    console.log(
      'client joined the room'
    );
  })
  io.on('disconnect',()=>console.log('Client Disconnected'))
})

// Start the server on the port specified in the environment variables
httpServer.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
