import { Box, Button, Container, Drawer, List, ListItem, Typography, Divider } from '@mui/material';
import { useRouter } from 'next/router';
import {useEffect, useState} from "react"


export default function Layout({ children }: any) {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const username = typeof window !== 'undefined' ? localStorage.getItem('username') : "";
    setUsername(username || '');
  }, []);

  return (
    <Container>
      <Drawer variant="permanent" open>
        <Box sx={{ display: 'flex', justifyContent: 'left', p: 2 }}>
          <Typography variant="h5">Hi {username}!</Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => router.push('/accounts')}>
            <Typography variant="h6">Accounts</Typography>
          </ListItem>
          <ListItem button onClick={() => router.push('/transactions')}>
            <Typography variant="h6">Transactions</Typography>
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ ml: 7, p: 3 }}>
        {children}
      </Box>
    </Container>
  );
}
