import Link from 'next/link';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import { Alert, Badge } from '@/components/ui';
import { getCertificateByCode } from '@/lib/data/catalog';
import { certificateFingerprint } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';
import { formatDate } from '@/lib/utils';

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { code } = await params;
  const certificate = getCertificateByCode(code);
  return {
    title: certificate ? `Certificat ${certificate.code}` : 'Certificat introuvable',
    description: certificate
      ? `Certificat délivré à ${certificate.holderName} pour la formation « ${certificate.courseTitle} ».`
      : undefined,
  };
}

export default async function CertificatePage({ params }: { params: Params }) {
  const { code } = await params;
  const certificate = getCertificateByCode(decodeURIComponent(code));
  if (!certificate) notFound();

  const { t, locale } = await getTranslator();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const verifyUrl = `${appUrl}/certificats/${certificate.code}`;
  const fingerprint = certificateFingerprint(certificate.code, certificate.holderName, certificate.issuedAt);
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 240,
    color: { dark: '#0d2a6b', light: '#ffffff' },
  });

  return (
    <div className="bg-slate-100 py-10">
      <div className="container-page max-w-4xl">
        <div className="no-print mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link href="/certificats" className="text-sm font-medium text-elimu-700 hover:underline">
            ← {t('cert.title')}
          </Link>
          <div className="flex gap-2">
            <Badge tone={certificate.revoked ? 'red' : 'green'}>
              {certificate.revoked ? t('cert.revoked') : t('cert.valid')}
            </Badge>
            <span className="badge bg-slate-200 text-slate-700">Empreinte {fingerprint.slice(0, 8)}…</span>
          </div>
        </div>

        {certificate.revoked && (
          <div className="no-print mb-5">
            <Alert tone="error" title={t('cert.revoked')}>
              {certificate.revokeReason ?? 'Ce certificat a été révoqué.'}
            </Alert>
          </div>
        )}

        {/* ----------------------------------------------------- Le certificat */}
        <article className="relative overflow-hidden rounded-2xl border-4 border-gold-400 bg-white p-8 shadow-pop print:border-2 sm:p-12">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0d2a6b, transparent 70%)' }}
          />
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-elimu-900 text-xl font-bold text-gold-300">
                SE
              </span>
              <div>
                <p className="text-lg font-extrabold tracking-tight text-elimu-900">SMART-ELIMU</p>
                <p className="text-xs text-slate-500">
                  Plateforme d’éducation · République démocratique du Congo
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-mono text-sm font-semibold text-elimu-800">{certificate.code}</p>
              <p className="mt-1">
                {t('cert.issuedAt')} {formatDate(certificate.issuedAt, locale === 'en' ? 'en-GB' : 'fr-FR')}
              </p>
            </div>
          </header>

          <div className="py-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold-600">
              Certificat de réussite
            </p>
            <h1 className="mt-4 text-3xl font-extrabold text-elimu-950 sm:text-4xl">{certificate.holderName}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600">
              a suivi avec succès l’ensemble du parcours de formation certifiante
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-xl font-bold text-elimu-800">{certificate.title}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600">
              {certificate.hours} heures de formation · score final de {certificate.score} % · mention{' '}
              <strong>{certificate.grade}</strong>
            </p>
            {certificate.partnerName && (
              <p className="mt-4 text-sm text-slate-600">
                En partenariat avec {certificate.partnerLogo} <strong>{certificate.partnerName}</strong>
              </p>
            )}
          </div>

          <footer className="flex flex-wrap items-end justify-between gap-6 border-t border-slate-200 pt-6">
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Empreinte de sécurité (HMAC-SHA256)</p>
              <p className="mt-1 break-all font-mono text-[10px] leading-relaxed">{fingerprint}</p>
              <p className="mt-3">
                Vérifiable en ligne : <span className="font-mono">{verifyUrl}</span>
              </p>
            </div>
            <div className="text-center">
              <img src={qrDataUrl} alt={`QR code de vérification ${certificate.code}`} className="h-32 w-32" />
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">Scannez pour vérifier</p>
            </div>
            <div className="text-center">
              <div className="mx-2 border-b border-slate-300 pb-1 font-serif text-lg italic text-elimu-900">
                Direction académique
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">SMART-ELIMU</p>
            </div>
          </footer>
        </article>

        <div className="no-print mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-card">
          <div className="text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Partager ce certificat</p>
            <p className="text-xs">
              Copiez le lien de vérification pour l’envoyer à un employeur ou à une université.
            </p>
            <p className="mt-2 break-all font-mono text-xs text-elimu-700">{verifyUrl}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/certificats" className="btn-outline">
              {t('cert.verify')}
            </Link>
            <Link href="/formations" className="btn-primary">
              Voir les formations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
