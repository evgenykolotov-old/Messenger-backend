import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import UserController from './controllers/UserController';
import DialogController from './controllers/DialogController';
import MessageController from './controllers/MessageController';

import updateLastSeen from './middlewares/updateLastSeen';
import checkAuth from './middlewares/checkAuth';

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(updateLastSeen);
app.use(checkAuth);

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/user/:id', UserController.find);
app.delete('/user/:id', UserController.delete);
app.post('/user/register', UserController.create);
app.post('/user/login', UserController.login);

app.get('/dialogs', DialogController.find);
app.delete('/dialogs/:id', DialogController.delete);
app.post('/dialogs', DialogController.create);

app.get('/messages', MessageController.index);
app.post('/messages', MessageController.create);
app.delete('/messages/:id', MessageController.delete);

app.listen(process.env.PORT, () => {
  console.log(`Server: http://localhost:${process.env.PORT}`);
});
