import { WebSocketServer } from 'ws';
import { SerialPort, ReadlineParser } from 'serialport';

const WS_PORT = 8001;
const SERIAL_PORT = '/dev/cu.usbmodem1101';
const BAUD_RATE = 9600;

const wss = new WebSocketServer({ port: WS_PORT });

wss.on('connection', function connection(ws) {
  console.log("WebSocket client connected");
  ws.on('error', console.error);

  ws.send('connected');
});

const port = new SerialPort({
  path: SERIAL_PORT,
  baudRate: BAUD_RATE,
}); 

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

parser.on('data', function (data) {
  console.log(data);
  
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

port.on('error', function (err) {
  console.error('Serial Port Error:', err.message);
});
