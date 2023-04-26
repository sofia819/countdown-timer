import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {
  const [connection, setConnection] = useState(null);
  const [timeUntil, setTimeUntil] = useState(-1);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5103/timer')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log('Connected!');

          connection.on('ReceiveTimerCountdown', (secondsUntil) => {
            setTimeUntil(secondsUntil);
          });
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);

  return (
    <>
      <h1>{timeUntil}</h1>
    </>
  );
};

export default App;
