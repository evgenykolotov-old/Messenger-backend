import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import socket from 'socket.io';
import cors from 'cors';

const app = express();
const http = require('http').Server(app);
export const io = require('socket.io')(http, {
  cors: { origin: 'http://localhost:3000' },
});
dotenv.config();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import dialogsRoutes from './routes/dialogs';
import messagesRoutes from './routes/messages';

import updateLastSeen from './middlewares/updateLastSeen';
import checkAuth from './middlewares/checkAuth';

app.use(cors());
app.use(express.json());
app.use(checkAuth);
app.use(updateLastSeen);

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/dialogs', dialogsRoutes);
app.use('/messages', messagesRoutes);

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

io.on('connection', (socket: socket.Socket) => {
  //TODO: Socket connection;
});

http.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`);
});
