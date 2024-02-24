import {Box, Button, Card, CardContent, Divider, Typography} from '@mui/material'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getAccounts, addAccount } from '@/app/client';
import Layout from '@/app/components/Layout';


export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<any[]>([]);

  const fetchAccounts = async () => {
    const {accounts = []} = await getAccounts();
    setAccounts(accounts);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleAddAccount = () => {
    addAccount().then((newAccount) => fetchAccounts())
  };

  const handleViewTransactions = (accountId: string) => {
    router.push(`/transactions/${accountId}`);
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
        <Typography variant="h4">Accounts</Typography>
        <Button variant="contained" onClick={handleAddAccount}>Add Account</Button>
      </Box>
      <Divider />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
        {accounts.map((account) => (
          <Card key={account.id} sx={{ width: 500 }}>
            <CardContent>
              <Typography variant="h5">Account Number</Typography>
              <Typography variant="body1">{account.account_number}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2, marginTop: 2 }}>
                <Typography variant="h5">Current Balance</Typography>
                <Typography variant="body1">${account.current_balance}</Typography>
              </Box>
              <Button variant="contained" onClick={() => handleViewTransactions(account.id)}>View Transactions</Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}
