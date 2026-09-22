import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'AniDex - Animal Fauna Pokédex',
  description: 'Pokédex-styled fauna scanner to capture, identify animal species, explore habitats, listen to hands-free voice audio guides, and maintain a field journal gallery.',
  openGraph: {
    title: 'AniDex - Animal Fauna Pokédex',
    description: 'Pokédex-styled fauna scanner to capture, identify animal species, explore habitats, listen to hands-free voice audio guides, and maintain a field journal gallery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AniDex - Animal Fauna Pokédex',
    description: 'Pokédex-styled fauna scanner to capture, identify animal species, explore habitats, listen to hands-free voice audio guides, and maintain a field journal gallery.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
