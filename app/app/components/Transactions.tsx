import {
  Box,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material'
import { useState, useEffect } from 'react';
import { getTransactions, addTransaction } from '@/app/client';
import {Transaction} from "@/app/types"
import Layout from '@/app/components/Layout';


export default function Transactions({ accountId }: { accountId?: string } = {}) {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('CREDIT');
  const [note, setNote] = useState('');
  const [transactionDate, setTransactionDate] = useState(formattedDate);
  const [filterDate, setFilterDate] = useState(formattedDate);
  const [balance, setBalance] = useState(0);

  const fetchTransactions = async (date?: string) => {
    if (date) {
      setFilterDate(date)
    } else {
      date = filterDate;
    }
    const { transactions = [], balance = 0 } = accountId ? await getTransactions(accountId, date) : await getTransactions(undefined, date);
    setBalance(balance || 0);
    setTransactions(transactions);
  };

  useEffect(() => {
    fetchTransactions();
  }, [accountId, filterDate]);

  const handleAddTransaction = async () => {
    if (!accountId) {
      alert('Error adding transaction');
      return;
    }
    const { error, transaction, balance } = await addTransaction(accountId, { amount, transaction_type: type, note, date: transactionDate });
    if (error) {
      alert('Error adding transaction');
    } else {
      setBalance(balance || 0);
      setTransactions([...transactions as any, transaction]);
    }
    setShowAddTransactionForm(false);
  };

  return (
    <Layout>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 2 }}>
        <Typography variant="h4">
          Transactions
          {!!accountId && ` for Account ${accountId}, Balance: $${balance}`}
        </Typography>
        {
          !!accountId &&
          <Button variant="contained" onClick={() => setShowAddTransactionForm(true)}>Add Transaction</Button>
        }
      </Box>

      {!!accountId && showAddTransactionForm && (
        <Box component="form" onSubmit={handleAddTransaction} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount"
            required
          />
          <TextField
            select
            value={type}
            onChange={(e) => setType(e.target.value)}
            label="Type"
            SelectProps={{ native: true }}
          >
            <option value="CREDIT">CREDIT</option>
            <option value="DEBIT">DEBIT</option>
          </TextField>
          <TextField
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            label="Note"
          />
          <TextField
            type="date"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            label="Transaction Date"
            required
          />
          <Button variant="contained" type="submit">Submit</Button>
        </Box>
      )}
      <Divider style={{marginTop: 20, marginBottom: 20 }} />

      <TextField
        type="date"
        value={filterDate}
        onChange={(e) => fetchTransactions(e.target.value)}
        label="Filter Date"
      />

      <Divider style={{marginTop: 20, marginBottom: 20 }} />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Transaction Type</TableCell>
            <TableCell>Account Number</TableCell>
            <TableCell>Note</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!!transactions?.length && transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.transaction_type}</TableCell>
              <TableCell>{transaction.masked_account_number}</TableCell>
              <TableCell>{transaction.note}</TableCell>
              <TableCell align={"right"}>${transaction.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Layout>
  );
}
