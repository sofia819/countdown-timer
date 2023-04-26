import { useEffect, useState } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

const App = () => {
  const [connection, setConnection] = useState(null);
  const [timeUntil, setTimeUntil] = useState(-1);
  const [userSelections, setUserSelections] = useState({});

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

          connection.on('ReceiveSelection', (userSelections) => {
            setUserSelections(userSelections);
          });
        })
        .catch((e) => console.log('Connection failed: ', e));
    }
  }, [connection]);

  const userId = 'one';

  const [selection, setSelection] = useState(null);

  const handleUpdateSelection = (e) => {
    setSelection(e.target.value);
  };

  const makeSelection = async () => {
    // call endpoint
    const userSelection = {
      Id: userId,
      Selection: selection,
    };
    console.log(JSON.stringify(userSelection));
    try {
      await fetch('http://localhost:5103/timer/select', {
        method: 'POST',
        body: JSON.stringify(userSelection),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      console.log('Sending message failed.', e);
    }
    setSelection('');
  };

  return (
    <>
      <h1>{timeUntil}</h1>
      <>
        <h3>user: {userId}</h3>
        <input onChange={handleUpdateSelection} value={selection} />
        <button onClick={makeSelection}>send</button>
      </>
      <p>
        Current selections
        {Object.keys(userSelections).map((k) =>
          userSelections[k].map((sel) => (
            <p>
              {k}: {sel}
            </p>
          ))
        )}
      </p>
    </>
  );
};

export default App;
