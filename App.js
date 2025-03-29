import { StatusBar } from 'expo-status-bar';
import { RootLayout } from './_layout';
import { UserProvider } from "@/contexts/userContext"
export default function App() {
  return (
    <UserProvider>
      <StatusBar style="auto" />
      <RootLayout />
    </UserProvider>
  );
}
