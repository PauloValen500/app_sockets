const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

// Archivos públicos
app.use(express.static('public'));

// Cuando un cliente se conecta
io.on('connection', (socket) => {
  console.log('Un usuario conectado:', socket.id);

  socket.on('crearSala', (nombreSala) => {
    socket.join(nombreSala);
    console.log(`Sala creada o unida: ${nombreSala}`);
    io.emit('salaCreada', nombreSala); //  Solo admins deben usar esto
  });

  socket.on('unirseSala', (nombreSala) => { 
    socket.join(nombreSala);
    console.log(`Usuario ${socket.id} se unió a la sala ${nombreSala}`); //  Evento especial solo para unirse
  });

  socket.on('mensajeSala', ({ sala, mensaje, nombreUsuario }) => {
    io.to(sala).emit('nuevoMensaje', { mensaje, nombreUsuario });
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se desconectó:', socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
