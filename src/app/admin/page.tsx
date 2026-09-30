import Link from 'next/link';
import { Badge, PageHeader, ProgressBar, Stat } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { ROLES, ROLE_LABELS } from '@/lib/constants';
import { adminOverview, platformStats } from '@/lib/data/stats';
import { listUsers } from '@/lib/data/users';
import { listPartnershipRequests, listProgramApplications } from '@/lib/data/partners';
import { listRecentCertificates } from '@/lib/data/catalog';
import { orientationProfileDistribution } from '@/lib/data/orientation';
import {
  createStaffUserAction,
  revokeCertificateAction,
  updatePartnershipRequestAction,
} from '@/lib/actions/admin';
import { formatCdf, formatDate, formatNumber } from '@/lib/utils';

export const metadata = { title: 'Administration SMART-ELIMU' };

const REQUEST_TONES: Record<string, 'blue' | 'gold' | 'green' | 'red'> = {
  NEW: 'blue',
  CONTACTED: 'gold',
  APPROVED: 'green',
  REJECTED: 'red',
};

export default async function AdminPage() {
  const user = await requireRole([ROLES.ADMIN], '/tableau-de-bord');
  const overview = adminOverview();
  const stats = platformStats();
  const users = listUsers({ limit: 12 });
  const requests = listPartnershipRequests(8);
  const applications = listProgramApplications({ limit: 8 });
  const certificates = listRecentCertificates(6);
  const profiles = orientationProfileDistribution();

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Pilotage de la plateforme"
        description={`Connecté(e) en tant que ${user.name}. Vue consolidée des trois modules et du réseau de partenaires.`}
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{overview.users} comptes</Badge>
          <Badge tone="gold">{overview.certificates} certificats délivrés</Badge>
          <Badge tone="green">{stats.partners} partenaires actifs</Badge>
        </div>
      </PageHeader>

      <div className="container-page space-y-8 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Nouveaux comptes (30 j)" value={overview.newUsers30d} icon="📈" />
          <Stat label="Formations" value={overview.courses} icon="📚" hint={`${overview.draftCourses} en brouillon`} />
          <Stat label="Écoles & élèves" value={`${overview.schools} / ${formatNumber(overview.students)}`} icon="🏫" />
          <Stat label="Encaissements enregistrés" value={formatCdf(overview.revenueCdf)} icon="💰" />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Comptes récents</h2>
              <Badge tone="neutral">{overview.users} au total</Badge>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>E-mail</th>
                    <th>Rôle</th>
                    <th>Ville</th>
                    <th>Inscription</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => (
                    <tr key={item.id}>
                      <td className="font-medium text-slate-800">{item.name}</td>
                      <td className="text-xs text-slate-500">{item.email}</td>
                      <td>
                        <Badge tone={item.role === 'ADMIN' ? 'slate' : item.role === 'SCHOOL_ADMIN' ? 'gold' : 'blue'}>
                          {ROLE_LABELS[item.role]?.fr ?? item.role}
                        </Badge>
                      </td>
                      <td className="text-xs text-slate-500">{item.city ?? '—'}</td>
                      <td className="text-xs text-slate-500">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Répartition par rôle</h2>
            <ul className="mt-4 space-y-4">
              {overview.usersByRole.map((row) => {
                const percent = Math.round((row.total / Math.max(overview.users, 1)) * 100);
                return (
                  <li key={row.role}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{ROLE_LABELS[row.role]?.fr ?? row.role}</span>
                      <span className="font-semibold text-slate-800">{row.total}</span>
                    </div>
                    <ProgressBar value={percent} />
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <h3 className="text-sm font-bold text-slate-800">Créer un compte interne</h3>
              <form action={createStaffUserAction} className="mt-3 space-y-3">
                <input name="name" required placeholder="Nom complet" className="input" />
                <input name="email" type="email" required placeholder="adresse@smart-elimu.cd" className="input" />
                <div className="grid grid-cols-2 gap-2">
                  <select name="role" className="input" defaultValue="TEACHER">
                    <option value="TEACHER">Formateur</option>
                    <option value="SCHOOL_ADMIN">Direction d’école</option>
                    <option value="PARTNER">Partenaire</option>
                    <option value="ADMIN">Administrateur</option>
                  </select>
                  <input name="city" placeholder="Ville" className="input" />
                </div>
                <input name="password" placeholder="Mot de passe provisoire" className="input" defaultValue="elimu2026" />
                <button type="submit" className="btn-primary w-full">
                  Créer le compte
                </button>
              </form>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Demandes de partenariat</h2>
                <p className="text-sm text-slate-500">
                  {overview.pendingPartnerships} nouvelle(s) demande(s) à traiter
                </p>
              </div>
            </div>
            <ul className="divide-y divide-slate-100">
              {requests.map((request) => (
                <li key={request.id} className="px-6 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{request.organizationName}</p>
                      <p className="text-xs text-slate-500">
                        {request.contactName} · {request.email} · {request.city ?? '—'}
                      </p>
                      {request.message && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{request.message}</p>
                      )}
                    </div>
                    <Badge tone={REQUEST_TONES[request.status] ?? 'neutral'}>{request.status}</Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-400">{formatDate(request.createdAt)}</span>
                    {request.status === 'NEW' && (
                      <>
                        <form action={updatePartnershipRequestAction} className="inline">
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="CONTACTED" />
                          <button className="rounded-lg bg-elimu-50 px-2.5 py-1 font-semibold text-elimu-800 hover:bg-elimu-100">
                            Marquer contactée
                          </button>
                        </form>
                        <form action={updatePartnershipRequestAction} className="inline">
                          <input type="hidden" name="requestId" value={request.id} />
                          <input type="hidden" name="status" value="APPROVED" />
                          <button className="rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 hover:bg-emerald-100">
                            Approuver
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Candidatures aux filières</h2>
              <p className="text-sm text-slate-500">{overview.pendingApplications} en attente de traitement</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Programme</th>
                    <th>Partenaire</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="font-medium text-slate-800">
                        {application.fullName}
                        <span className="block text-[11px] text-slate-400">{application.email}</span>
                      </td>
                      <td className="text-xs text-slate-600">{application.programName}</td>
                      <td className="text-xs text-slate-500">{application.partnerName}</td>
                      <td>
                        <Badge
                          tone={
                            application.status === 'ACCEPTED' || application.status === 'ENROLLED'
                              ? 'green'
                              : application.status === 'REJECTED'
                                ? 'red'
                                : 'blue'
                          }
                        >
                          {application.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Profils d’orientation</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {profiles.map((row) => (
                <li key={row.profileCode} className="flex items-center justify-between">
                  <span className="text-slate-600">
                    <span className="font-mono font-semibold text-elimu-700">{row.profileCode}</span> —{' '}
                    {row.profileLabel}
                  </span>
                  <span className="font-semibold">{row.total}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">{stats.orientationTests} tests réalisés au total</p>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Formations les plus suivies</h2>
            <ul className="mt-4 space-y-3">
              {overview.enrollmentsByCourse.map((row) => (
                <li key={row.title}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="line-clamp-1 text-slate-600">{row.title}</span>
                    <span className="font-semibold">{row.total}</span>
                  </div>
                  <ProgressBar
                    value={Math.round(
                      (row.total / Math.max(...overview.enrollmentsByCourse.map((item) => item.total), 1)) * 100,
                    )}
                    tone="gold"
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="card overflow-hidden p-6">
            <h2 className="text-lg font-bold text-slate-900">Certificats récents</h2>
            <ul className="mt-4 space-y-3">
              {certificates.map((certificate) => (
                <li key={certificate.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{certificate.holderName}</p>
                      <Link
                        href={`/certificats/${certificate.code}`}
                        className="font-mono text-[11px] text-elimu-700 hover:underline"
                      >
                        {certificate.code}
                      </Link>
                    </div>
                    <form action={revokeCertificateAction}>
                      <input type="hidden" name="certificateId" value={certificate.id} />
                      <input type="hidden" name="reason" value="Révoqué par l’administration" />
                      <button className="rounded-lg bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100">
                        Révoquer
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              {overview.revokedCertificates} certificat(s) révoqué(s) au total
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
