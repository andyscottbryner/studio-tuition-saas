import './globals.css';

export const metadata = {
  title: 'Studio Tuition Calculator',
  description: 'Instant prorated tuition quotes for gyms and studios.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
