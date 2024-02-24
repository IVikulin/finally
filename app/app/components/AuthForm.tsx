import { useState } from 'react';
import { Button, TextField, Box, Container, Typography, Snackbar } from '@mui/material';
import {router} from "next/client"
import {AxiosError} from "axios"


interface AuthFormProps {
  title: string;
  submitFunction: (username: string, password: string) => Promise<{ error?: Error | AxiosError }>;
  switchAuthMode: () => void;
  switchText: string;
  switchButtonText: string;
}


export default function AuthForm({
    title,
    submitFunction,
    switchAuthMode,
    switchText,
    switchButtonText,
  }: AuthFormProps)
{
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    let problem: any

    try {
      const { error} = await submitFunction(username, password)
      problem = error
    } catch (error:any) {
      problem = error
    }

    if (problem) {
      const message = problem?.response?.data?.error || problem?.message
      alert(`Error during login: ${message}`)
    } else {
      router.push('/accounts');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          padding: (theme) => theme.spacing(2),
          borderRadius: '10px',
        }}
      >
        <Typography component="h1" variant="h5">
          GPA: {title}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {title}
          </Button>
          <Typography variant="body2" color="text.secondary" align="center">
            {switchText}{' '}
            <Button color="primary" onClick={switchAuthMode}>
              {switchButtonText}
            </Button>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
