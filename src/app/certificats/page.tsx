import Link from 'next/link';
import { Alert, Badge, PageHeader } from '@/components/ui';
import { getCertificateByCode, listRecentCertificates } from '@/lib/data/catalog';
import { getTranslator } from '@/lib/locale';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Vérification de certificat' };

type SearchParams = Promise<{ code?: string }>;

export default async function CertificatesPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const { t, locale } = await getTranslator();
  const code = params.code?.trim();
  const certificate = code ? getCertificateByCode(code) : null;
  const recent = listRecentCertificates(6);

  return (
    <div>
      <PageHeader eyebrow="Vérification" title={t('cert.title')} description={t('cert.subtitle')}>
        <form action="/certificats" className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
          <input
            name="code"
            defaultValue={code ?? ''}
            placeholder={t('cert.placeholder')}
            className="input font-mono uppercase"
            aria-label={t('cert.placeholder')}
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            🔎 {t('cert.verify')}
          </button>
        </form>
      </PageHeader>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          {code && !certificate && (
            <Alert tone="error" title={t('cert.invalid')}>
              Aucun certificat ne correspond au code <strong className="font-mono">{code}</strong>. Vérifiez la saisie
              (format attendu : SE-ANNÉE-XXXX-XXXX) ou contactez l’établissement émetteur.
            </Alert>
          )}

          {certificate && (
            <div className="space-y-4">
              {certificate.revoked ? (
                <Alert tone="error" title={t('cert.revoked')}>
                  {certificate.revokeReason ?? 'Ce certificat a été révoqué par SMART-ELIMU.'}
                </Alert>
              ) : (
                <Alert tone="success" title={t('cert.valid')}>
                  Ce certificat a été délivré par SMART-ELIMU et n’a pas été révoqué.
                </Alert>
              )}

              <article className="card overflow-hidden">
                <div className="border-b border-gold-200 bg-gradient-to-r from-elimu-900 to-elimu-700 px-6 py-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-300">SMART-ELIMU · RDC</p>
                  <h2 className="mt-1 text-xl font-bold">{certificate.title}</h2>
                </div>
                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t('cert.holder')}</p>
                    <p className="text-lg font-bold text-slate-900">{certificate.holderName}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Code</p>
                    <p className="font-mono text-base font-semibold text-elimu-800">{certificate.code}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t('cert.issuedAt')}</p>
                    <p className="text-sm font-medium text-slate-800">{formatDate(certificate.issuedAt, locale === 'en' ? 'en-GB' : 'fr-FR')}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Score obtenu</p>
                    <p className="text-sm font-medium text-slate-800">
                      {certificate.score} % · {certificate.grade}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">{t('cert.course')}</p>
                    <p className="text-sm font-medium text-slate-800">{certificate.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Volume horaire</p>
                    <p className="text-sm font-medium text-slate-800">{certificate.hours} heures</p>
                  </div>
                  {certificate.partnerName && (
                    <div className="sm:col-span-2">
                      <p className="text-xs uppercase tracking-wide text-slate-400">Partenaire co-signataire</p>
                      <p className="text-sm font-medium text-slate-800">
                        {certificate.partnerLogo} {certificate.partnerName}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                  <Link href={`/certificats/${certificate.code}`} className="btn-primary">
                    {t('common.viewDetails')} →
                  </Link>
                  <span className="text-xs text-slate-500">
                    Vérifié le {formatDate(new Date(), locale === 'en' ? 'en-GB' : 'fr-FR')}
                  </span>
                </div>
              </article>
            </div>
          )}

          {!code && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-slate-900">Comment vérifier un certificat ?</h2>
              <ol className="mt-3 space-y-2 text-sm text-slate-600">
                <li>
                  1. Saisissez le code inscrit en bas du certificat (format{' '}
                  <span className="font-mono">SE-2026-XXXX-XXXX</span>).
                </li>
                <li>2. La plateforme affiche le titulaire, la formation, la date de délivrance et le score.</li>
                <li>3. Le QR code imprimé sur le document mène directement à cette page de vérification.</li>
              </ol>
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Les employeurs et les établissements peuvent ainsi authentifier un certificat en quelques secondes,
                même sans compte.
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">🕒 Derniers certificats délivrés</p>
            <ul className="mt-3 space-y-3">
              {recent.map((item) => (
                <li key={item.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <Link href={`/certificats/${item.code}`} className="group block">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-elimu-700">
                      {item.holderName}
                    </p>
                    <p className="line-clamp-1 text-xs text-slate-500">{item.courseTitle}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">{item.code}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card bg-gold-50 p-5 text-sm text-gold-900">
            <p className="font-bold">🎓 Obtenir mon certificat</p>
            <p className="mt-2 text-gold-800">
              Terminez une formation certifiante (100 % des leçons + 70 % à l’évaluation finale) pour recevoir
              automatiquement votre certificat numérique.
            </p>
            <Link href="/formations" className="btn-primary mt-4 w-full">
              Voir les formations
            </Link>
          </div>

          <div className="card p-5 text-sm text-slate-600">
            <p className="font-bold text-slate-800">Sécurité</p>
            <p className="mt-2">
              Chaque certificat contient une empreinte HMAC-SHA256 calculée côté serveur, affichée sur le document.
              Toute modification manuelle invalide l’empreinte.
            </p>
            <Badge tone="neutral" className="mt-3">
              Conforme aux usages de vérification numérique
            </Badge>
          </div>
        </aside>
      </div>
    </div>
  );
}
