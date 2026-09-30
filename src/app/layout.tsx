import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { getLocale } from '@/lib/locale';

export const metadata: Metadata = {
  title: {
    default: 'SMART-ELIMU — Formation certifiante, gestion scolaire et orientation en RDC',
    template: '%s · SMART-ELIMU',
  },
  description:
    'SMART-ELIMU est la plateforme congolaise qui réunit la formation certifiante en ligne, la gestion d’établissement scolaire et l’orientation scolaire & académique, en partenariat avec les universités et centres de formation agréés de la RDC.',
  keywords: [
    'formation en ligne RDC',
    'certificat numérique Congo',
    'gestion scolaire Kinshasa',
    'orientation scolaire RDC',
    'universités partenaires Congo',
  ],
  authors: [{ name: 'SMART-ELIMU' }],
  openGraph: {
    title: 'SMART-ELIMU — Éduquer, certifier, orienter la jeunesse congolaise',
    description:
      'Formations certifiantes, gestion d’établissement scolaire et orientation académique, partout en République démocratique du Congo.',
    locale: 'fr_CD',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d2a6b',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
