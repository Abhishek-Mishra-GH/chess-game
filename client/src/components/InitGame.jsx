import React, { useState } from 'react';
import { Stack, TextField } from '@mui/material';
import Button  from '@mui/material/Button';
import CustomDialog from './CustomDialog';
import socket from '../socket';

function InitGame({ setRoom, setOrientation, setPlayers}) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [roomInput, setRoomInput] = useState("");
  const [roomError, setRoomError] = useState("");

  const handleJoinRoom = () => {
    // join a room 
    if(!roomInput) return;
    socket.emit("joinRoom", { roomId: roomInput }, (r) => {
      if(r.error) return roomError(r.message);
      console.log("response: ", r);
      setRoom(r?.roomId);
      setPlayers(r?.players);
      setOrientation("black");
    });
    setRoomDialogOpen(false);
  }


  return (
    <Stack 
      justifyContent="center"
      alignItems="center"
      sx={{py: 1, height: "100dvh"}}
    >
      <CustomDialog 
        open={roomDialogOpen}
        title="Select Room to Join" 
        contentText="Enter a valid room ID to join the game"
        handleContinue={handleJoinRoom}
      >

        <TextField 
          autoFocus
          required
          margin='dense'
          fullWidth
          name='room'
          value={roomInput}
          onChange={(e) => setRoomInput(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === 'Enter') handleJoinRoom();
          }}
          variant='standard'
          error={Boolean(roomError)}
          helperText={roomError ? "Enter a room ID" : "Invalid room ID"}

        />
      </CustomDialog>

        <button
          className='btn btn-outlined'
          onClick={() => {
            socket.emit("createRoom", async (room) => {
              console.log(room);
              setRoom(room);
              setOrientation("white");
            });
          }}
        >
          Start a game
        </button>

        <button
          className='btn btn-contained'
          onClick={() => setRoomDialogOpen(true)}
        >
          Join a game
        </button>
    </Stack>
  );
}



export default InitGame
