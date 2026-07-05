import type { Metadata } from 'next';
import '../styles/globals.css';
import { ThemeProvider } from '../components/theme/ThemeProvider';

export const metadata: Metadata = {
  title: 'Meridian Capital Analytics Dashboard',
  description: 'Institutional portfolio analytics dashboard with configurable widgets and real-time mock data.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
