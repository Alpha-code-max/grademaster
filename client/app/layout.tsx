// app/layout.tsx
import type { Metadata } from "next";
import './globals.css';
import RootClientLayout from './RootClientLayout';

export const metadata: Metadata = {
  title: 'GPA Calculator',
  description: 'Easily compute your GPA with a modern UI, data persistence, and interactive features.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Render client layout which handles auth
  return <RootClientLayout>{children}</RootClientLayout>;
}
