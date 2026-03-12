import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import OrderDetail from './pages/OrderDetail';
import TaskCenter from './pages/TaskCenter';
import WalletRecords from './pages/WalletRecords';
import WalletAccounts from './pages/WalletAccounts';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/order/:id" element={<OrderDetail />} />
          <Route path="/tasks" element={<TaskCenter />} />
          <Route path="/wallet/records" element={<WalletRecords />} />
          <Route path="/wallet/accounts" element={<WalletAccounts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;