const WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m';

const socket = new WebSocket(WS_URL);

const listeners = [];

socket.onmessage = function ({data}) {
    data = JSON.parse(data);
	let btcPrice = (parseInt(data.k.c * 100)/100).toFixed(2);

    listeners.forEach((listener) => {
        listener(btcPrice);
    })
}

// Función para suscribir componentes al WebSocket.
function subscribeToWebSocket(listener) {
    listeners.push(listener);
  
    // Devuelve una función de limpieza para cancelar la suscripción cuando sea necesario.
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }
  
  export { subscribeToWebSocket };