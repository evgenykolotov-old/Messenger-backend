import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import UserController from './controllers/UserController';
import DialogController from './controllers/DialogController';
import MessageController from './controllers/MessageController';

const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.get('/user/:id', UserController.find);
app.delete('/user/:id', UserController.delete);
app.post('/user/register', UserController.create);

app.get('/dialogs/:id', DialogController.find);
app.delete('/dialogs/:id', DialogController.delete);
app.post('/dialogs', DialogController.create);

app.get('/messages', MessageController.index);
app.post('/messages', MessageController.create);

app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
