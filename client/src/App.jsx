import { useState } from 'react'
import './App.css'
import { Container } from '@mui/material'
import CustomDialog from './components/CustomDialog';
import Game from './Game';

function App() {


  return (
    <Container >
      <Game />
    </Container>
    );
}

export default App
