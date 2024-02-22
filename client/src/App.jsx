import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { Container, TextField } from '@mui/material'
import CustomDialog from './components/CustomDialog';
import Game from './Game';
import InitGame from './components/InitGame';
import socket from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);

  const [room, setRoom] = useState("");
  const [orientation, setOrientation] = useState("");
  const [players, setPlayers] = useState([]);

  const cleanup = useCallback(() => {
    setRoom("");
    setOrientation("");
    setPlayers([]);
  }, []);

  useEffect(() => {

    socket.on('opponentJoined', (roomData) => {
      alert(`${roomData.players[1].username} joined the game`);
      console.log("roomData", roomData)
      setPlayers(roomData.players);
    });

  }, []);

  const handleDialogContinue = () => {
    if(!username) return;
    socket.emit("username", username);
    setUsernameSubmitted(true);
  }

  return (
    <main >
      <CustomDialog
        open={!usernameSubmitted }
        title="Pick a username"
        contentText="Please enter your username to continue"
        handleContinue={handleDialogContinue}
      >

        <TextField 
          autoFocus
          required
          margin='dense'
          id='username'
          label='username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter') handleDialogContinue()
          }}
          type='text'
          fullWidth
          variant='standard'
        />

      </CustomDialog>
      {(room) ? (
        <Game 
          room={room}
          orientation={orientation}
          players={players}
          cleanup={cleanup}
        />
      ) : (
        <InitGame 
          setRoom={setRoom}
          setOrientation={setOrientation}
          setPlayers={setPlayers}
        />
      )}
    </main>
    );
}

export default App
