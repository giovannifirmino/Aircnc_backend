const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server); 

const connectedUsers = {};


mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-dwaxa.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//GET, POST, PUT, DELETE

//req.query = Acessar query params
//req.params = Acessar route params (para edicao, delete)
//req.body = Acessar corpo da requisicao (para criacao, edicao)

app.use(cors());
app.use(express.json());
app.use(routes);
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

server.listen(process.env.PORT || 3333);
