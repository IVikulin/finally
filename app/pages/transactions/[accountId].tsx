import { useRouter } from 'next/router';
import Transactions from '@/app/components/Transactions';


export default function TransactionsPage() {
  const router = useRouter();
  const accountId = router.query?.accountId as string
  return <Transactions accountId={accountId} />;
}
