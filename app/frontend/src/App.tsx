import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import OrderDetail from './pages/OrderDetail';
import TaskCenter from './pages/TaskCenter';
import WalletRecords from './pages/WalletRecords';
import WalletAccounts from './pages/WalletAccounts';
import Withdraw from './pages/Withdraw';
import Profile from './pages/Profile';
import MediaAccounts from './pages/MediaAccounts';
import Notifications from './pages/Notifications';
import AccountSecurity from './pages/AccountSecurity';
import HelpCenter from './pages/HelpCenter';
import SettingsPage from './pages/SettingsPage';
import EditProfile from './pages/EditProfile';
import AuthCallback from './pages/AuthCallback';
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
          <Route path="/wallet/withdraw" element={<Withdraw />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/media-accounts" element={<MediaAccounts />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/account-security" element={<AccountSecurity />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;