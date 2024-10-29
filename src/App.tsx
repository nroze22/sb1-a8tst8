import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Routes } from '@/components/Routes';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="talosix-theme">
        <Routes />
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;