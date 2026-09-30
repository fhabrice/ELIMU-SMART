import Link from 'next/link';
import { Badge, EmptyState, PageHeader, Stat } from '@/components/ui';
import { requireUser } from '@/lib/auth';
import { ROLES } from '@/lib/constants';
import { listPartners, listProgramApplications, listProgramsByPartner } from '@/lib/data/partners';
import { listPartnershipRequests } from '@/lib/data/partners';
import { updateApplicationStatusAction } from '@/lib/actions/partners';
import { formatDate, formatUsd } from '@/lib/utils';

export const metadata = { title: 'Espace partenaire' };

const STATUS_FLOW = ['REVIEWING', 'ACCEPTED', 'REJECTED', 'ENROLLED'];

export default async function PartnerSpacePage() {
  const user = await requireUser('/partenaires/espace');
  const isAdmin = user.role === ROLES.ADMIN;

  // Un partenaire est rattaché à l'institution portant son domaine e-mail ;
  // l'administrateur voit l'ensemble du réseau.
  const partners = listPartners({ limit: 40 });
  const partner = isAdmin ? partners[0] : partners.find((item) => user.email.endsWith(item.email?.split('@')[1] ?? '')) ?? partners[0];
  const programs = partner ? listProgramsByPartner(partner.id) : [];
  const applications = listProgramApplications({ partnerId: partner?.id, limit: 60 });
  const requests = isAdmin ? listPartnershipRequests(6) : [];

  const pending = applications.filter((application) => application.status === 'SUBMITTED').length;
  const accepted = applications.filter((application) =>
    ['ACCEPTED', 'ENROLLED'].includes(application.status),
  ).length;

  return (
    <div>
      <PageHeader
        eyebrow="Espace partenaire"
        title={partner ? partner.name : 'Réseau SMART-ELIMU'}
        description={
          partner
            ? `${partner.city}, ${partner.province} · ${programs.length} filière(s) publiée(s) · ${applications.length} candidature(s) reçue(s)`
            : 'Suivi des candidatures et de l’activité du réseau.'
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">{user.name}</Badge>
          <Badge tone="gold">{partner?.accreditation ?? 'Réseau'}</Badge>
        </div>
      </PageHeader>

      <div className="container-page space-y-8 py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Candidatures reçues" value={applications.length} icon="📨" />
          <Stat label="En attente de traitement" value={pending} icon="⏳" />
          <Stat label="Dossiers acceptés" value={accepted} icon="✅" />
          <Stat label="Filières publiées" value={programs.length} icon="🎓" />
        </section>

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Candidatures</h2>
            <p className="text-sm text-slate-500">
              Traitez chaque dossier : examen, acceptation et inscription définitive.
            </p>
          </div>
          {applications.length === 0 ? (
            <EmptyState
              title="Aucune candidature reçue"
              description="Les candidatures déposées depuis votre page partenaire apparaîtront ici."
              icon="📨"
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Contact</th>
                    <th>Filière demandée</th>
                    <th>Reçue le</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="font-medium text-slate-800">{application.fullName}</td>
                      <td className="text-xs text-slate-500">
                        {application.email}
                        {application.phone && <span className="block">{application.phone}</span>}
                      </td>
                      <td className="text-sm text-slate-600">{application.programName}</td>
                      <td className="text-xs text-slate-500">{formatDate(application.createdAt)}</td>
                      <td>
                        <Badge
                          tone={
                            ['ACCEPTED', 'ENROLLED'].includes(application.status)
                              ? 'green'
                              : application.status === 'REJECTED'
                                ? 'red'
                                : application.status === 'REVIEWING'
                                  ? 'gold'
                                  : 'blue'
                          }
                        >
                          {application.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1.5">
                          {STATUS_FLOW.filter((status) => status !== application.status).map((status) => (
                            <form action={updateApplicationStatusAction} key={status}>
                              <input type="hidden" name="applicationId" value={application.id} />
                              <input type="hidden" name="status" value={status} />
                              <button className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200">
                                {status === 'REVIEWING'
                                  ? 'En examen'
                                  : status === 'ACCEPTED'
                                    ? 'Accepter'
                                    : status === 'REJECTED'
                                      ? 'Refuser'
                                      : 'Marquer inscrit'}
                              </button>
                            </form>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Filières publiées</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {programs.map((program) => (
                <li key={program.id} className="flex items-center justify-between gap-4 px-6 py-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{program.name}</p>
                    <p className="text-xs text-slate-500">
                      {program.field} · {program.degree.replace('_', ' ')} · {program.durationMonths} mois
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-elimu-800">
                      {program.tuitionUsd ? formatUsd(program.tuitionUsd) : '—'}
                    </p>
                    <p className="text-xs text-slate-400">par an</p>
                  </div>
                </li>
              ))}
              {programs.length === 0 && (
                <li className="px-6 py-6 text-sm text-slate-500">
                  Aucune filière publiée pour le moment.
                </li>
              )}
            </ul>
          </section>

          <section className="space-y-6">
            {isAdmin && (
              <div className="card overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h2 className="text-lg font-bold text-slate-900">Demandes de partenariat (réseau)</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {requests.map((request) => (
                    <li key={request.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{request.organizationName}</p>
                          <p className="text-xs text-slate-500">
                            {request.contactName} · {request.city ?? '—'}
                          </p>
                        </div>
                        <Badge tone={request.status === 'NEW' ? 'blue' : request.status === 'APPROVED' ? 'green' : 'gold'}>
                          {request.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card bg-elimu-50 p-6 text-sm text-elimu-900">
              <p className="font-bold">Développer votre attractivité</p>
              <ul className="mt-3 space-y-2">
                <li>• Complétez vos fiches filières (débouchés, conditions, frais)</li>
                <li>• Publiez vos bourses : elles sont visibles sur la page Bourses</li>
                <li>• Proposez vos propres formations certifiantes en ligne</li>
                <li>• Répondez aux candidatures sous 72 heures pour maximiser l’inscription</li>
              </ul>
              <Link href="/partenaires/devenir" className="btn-outline mt-4">
                Voir le dossier de partenariat
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
