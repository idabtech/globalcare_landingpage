import { RouterProvider } from 'react-router-dom';
import routerData from './routes/router';
import { Toaster } from 'sonner';
import { AppProvider } from './context/AppContext';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" richColors closeButton />
      <RouterProvider router={routerData} />
    </AppProvider>
  );
}

export default App;
