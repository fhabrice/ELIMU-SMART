import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, InfoRow, Stat } from '@/components/ui';
import { queryOne } from '@/lib/sqlite';
import { getSchoolOverview, listClasses } from '@/lib/data/school';
import { SCHOOL_TYPES } from '@/lib/constants';
import { formatNumber } from '@/lib/utils';
import type { School } from '@/lib/types';

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { code } = await params;
  const school = queryOne<School>('SELECT * FROM schools WHERE code = ?', [decodeURIComponent(code)]);
  return { title: school ? `${school.name} — Fiche établissement` : 'Établissement' };
}

export default async function PublicSchoolPage({ params }: { params: Params }) {
  const { code } = await params;
  const school = queryOne<School>('SELECT * FROM schools WHERE code = ?', [decodeURIComponent(code)]);
  if (!school) notFound();

  const overview = getSchoolOverview(school.id, 'T1');
  const classes = listClasses(school.id);

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page py-10">
          <div className="flex flex-wrap items-start gap-6">
            <span
              className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl"
              style={{ backgroundColor: `${school.coverColor}1a` }}
            >
              {school.logoEmoji}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                <Badge tone="blue">{SCHOOL_TYPES[school.type]?.fr ?? school.type}</Badge>
                <Badge tone="neutral">Code {school.code}</Badge>
                <Badge tone="green">Année {school.academicYear}</Badge>
              </div>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">{school.name}</h1>
              <p className="mt-1 text-slate-600">
                📍 {school.city}, {school.province} {school.address ? `· ${school.address}` : ''}
              </p>
              {school.motto && <p className="mt-2 font-serif italic text-elimu-800">« {school.motto} »</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.5fr_0.5fr]">
        <div className="space-y-8">
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Élèves actifs" value={formatNumber(overview.students)} icon="🧑🏾‍🎓" />
            <Stat label="Classes" value={overview.classes} icon="🏫" />
            <Stat label="Enseignants" value={overview.teachers} icon="👩🏾‍🏫" />
            <Stat label="Taux de présence" value={`${overview.attendanceRate} %`} icon="🗓️" hint="30 derniers jours" />
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">Classes ouvertes</h2>
              <p className="text-sm text-slate-500">Répartition des effectifs par classe</p>
            </div>
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Classe</th>
                    <th>Niveau</th>
                    <th>Section</th>
                    <th>Effectif</th>
                    <th>Capacité</th>
                    <th>Moyenne T1</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.byClass.map((row) => (
                    <tr key={row.id}>
                      <td className="font-semibold text-slate-800">{row.name}</td>
                      <td className="text-xs text-slate-500">{row.level}</td>
                      <td className="text-xs text-slate-500">
                        {classes.find((klass) => klass.id === row.id)?.section ?? '—'}
                      </td>
                      <td>{row.students}</td>
                      <td className="text-slate-500">{row.capacity}</td>
                      <td>{row.average ? `${row.average.toFixed(2)} / 100` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-lg font-bold text-slate-900">Un mot sur notre gestion</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Cet établissement utilise SMART-ELIMU School pour la gestion quotidienne de ses élèves, de ses notes et
              de ses frais scolaires. Les bulletins sont générés automatiquement, les présences sont saisies par les
              titulaires et le suivi financier est partagé avec la direction.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/ecoles" className="btn-outline">
                Découvrir SMART-ELIMU School
              </Link>
              <Link href="/ecoles/inscription" className="btn-primary">
                Inscrire mon établissement
              </Link>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="text-sm font-bold text-slate-800">Informations pratiques</p>
            <div className="mt-3">
              <InfoRow label="Direction" value={school.directorName} />
              <InfoRow label="Téléphone" value={school.phone ?? '—'} />
              <InfoRow label="E-mail" value={school.email ?? '—'} />
              <InfoRow label="Adresse" value={school.address ?? '—'} />
              <InfoRow label="Capacité déclarée" value={`${formatNumber(school.capacity)} places`} />
              <InfoRow label="Créé le" value={new Date(school.createdAt).toLocaleDateString('fr-FR')} />
            </div>
          </div>

          <div className="card bg-elimu-50 p-5 text-sm text-elimu-900">
            <p className="font-bold">Vous êtes la direction ?</p>
            <p className="mt-2">
              Connectez-vous pour accéder au tableau de bord complet : élèves, notes, bulletins, présences et
              finances.
            </p>
            <Link href="/connexion" className="btn-primary mt-4 w-full">
              Accéder au tableau de bord
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
