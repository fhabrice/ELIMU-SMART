import Link from 'next/link';
import { Badge } from '@/components/ui';
import { requireActiveSchool } from '@/lib/school-context';
import { buildReportCard, classRanking, listClasses, listStudents } from '@/lib/data/school';
import { mentionFromAverage, decisionFromAverage, PERIODS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';

export const metadata = { title: 'Bulletins' };

export default async function ReportCardsPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string; eleve?: string }>;
}) {
  const params = await searchParams;
  const { school } = await requireActiveSchool();

  const classes = listClasses(school.id);
  const classId = params.classe ?? classes[0]?.id ?? '';
  const period = params.periode ?? 'T1';
  const students = classId ? listStudents(school.id, { classId, status: 'ACTIF' }) : [];
  const ranking = classId ? classRanking(classId, period) : [];
  const selectedId = params.eleve ?? students[0]?.id;
  const report = selectedId ? buildReportCard(selectedId, period) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Bulletins et classements</h2>
          <p className="text-sm text-slate-500">
            {classes.find((klass) => klass.id === classId)?.name ?? '—'} · Période {period} · {students.length}{' '}
            élève(s)
          </p>
        </div>
        <Badge tone="blue">Moyennes pondérées par coefficient · mention automatique</Badge>
      </div>

      <form className="card grid gap-3 p-4 sm:grid-cols-3" action="/ecoles/tableau-de-bord/bulletins">
        <div>
          <label className="label" htmlFor="classe">
            Classe
          </label>
          <select id="classe" name="classe" className="input" defaultValue={classId}>
            {classes.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="periode">
            Période
          </label>
          <select id="periode" name="periode" className="input" defaultValue={period}>
            {PERIODS.map((item) => (
              <option key={item} value={item}>
                Trimestre {item.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-outline w-full">
            🔍 Afficher
          </button>
        </div>
      </form>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        {/* --------------------------------------------------- Classement */}
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-bold text-slate-800">Classement du trimestre</p>
            <p className="text-xs text-slate-500">Cliquez sur un élève pour afficher son bulletin.</p>
          </div>
          <div className="max-h-[560px] overflow-y-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Élève</th>
                  <th>Moyenne</th>
                  <th>Mention</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((entry) => (
                  <tr key={entry.studentId} className={entry.studentId === selectedId ? 'bg-elimu-50' : undefined}>
                    <td className="font-semibold text-slate-700">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : entry.rank}
                    </td>
                    <td>
                      <Link
                        href={`/ecoles/tableau-de-bord/bulletins?classe=${classId}&periode=${period}&eleve=${entry.studentId}`}
                        className="font-medium text-elimu-800 hover:underline"
                      >
                        {entry.fullName}
                      </Link>
                      <span className="block font-mono text-[11px] text-slate-400">{entry.matricule}</span>
                    </td>
                    <td className={entry.average >= 50 ? 'text-emerald-700' : 'text-rose-700'}>
                      {entry.average.toFixed(2)}
                    </td>
                    <td className="text-xs text-slate-500">{mentionFromAverage(entry.average)}</td>
                  </tr>
                ))}
                {ranking.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-sm text-slate-500">
                      Aucune note saisie pour cette classe et cette période.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --------------------------------------------------- Bulletin */}
        <div className="card p-6">
          {!report || report.rows.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucun bulletin disponible.{' '}
              <Link href={`/ecoles/tableau-de-bord/notes?classe=${classId}&periode=${period}`} className="text-elimu-700 underline">
                Saisir des notes
              </Link>
            </p>
          ) : (
            <article>
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-elimu-900 text-lg font-bold text-gold-300">
                    SE
                  </span>
                  <div>
                    <p className="text-sm font-bold text-elimu-900">{school.name}</p>
                    <p className="text-xs text-slate-500">
                      {school.code} · {school.city} · Année {school.academicYear}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="font-semibold text-slate-700">BULLETIN — {period}</p>
                  <p>Édité le {formatDate(new Date())}</p>
                </div>
              </header>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Élève</p>
                  <p className="text-lg font-bold text-slate-900">
                    {report.student.lastName} {report.student.firstName}
                  </p>
                  <p className="font-mono text-xs text-slate-500">{report.student.matricule}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Classe</p>
                  <p className="font-semibold text-slate-800">{report.class?.name ?? '—'}</p>
                  <p className="text-xs text-slate-500">{report.class?.level ?? ''}</p>
                </div>
              </div>

              <table className="table-base mt-5">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Moyenne</th>
                    <th>Coef.</th>
                    <th>Points</th>
                    <th>Appréciation</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={row.subject}>
                      <td className="font-medium text-slate-800">{row.subject}</td>
                      <td className={row.average >= 50 ? 'text-emerald-700' : 'text-rose-700'}>
                        {row.average.toFixed(2)}
                      </td>
                      <td>{row.coefficient}</td>
                      <td>{(row.average * row.coefficient).toFixed(1)}</td>
                      <td className="text-xs text-slate-500">{mentionFromAverage(row.average)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-elimu-50 p-3">
                  <p className="text-xs text-elimu-700">Moyenne générale</p>
                  <p className="text-lg font-bold text-elimu-900">{report.average.toFixed(2)} / 100</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Rang</p>
                  <p className="text-lg font-bold text-slate-800">
                    {report.rank ?? '—'} / {report.classSize || '—'}
                  </p>
                </div>
                <div className="rounded-xl bg-gold-50 p-3">
                  <p className="text-xs text-gold-700">Mention</p>
                  <p className="text-lg font-bold text-gold-900">{report.mention}</p>
                </div>
                <div
                  className={cn(
                    'rounded-xl p-3',
                    report.average >= 50 ? 'bg-emerald-50' : 'bg-rose-50',
                  )}
                >
                  <p className={cn('text-xs', report.average >= 50 ? 'text-emerald-700' : 'text-rose-700')}>
                    Décision
                  </p>
                  <p className={cn('text-sm font-bold', report.average >= 50 ? 'text-emerald-900' : 'text-rose-900')}>
                    {decisionFromAverage(report.average)}
                  </p>
                </div>
              </div>

              <footer className="mt-6 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200 pt-4 text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700">Absences enregistrées</p>
                  <p>{report.hoursAbsent} absence(s) sur l’année scolaire</p>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-300 pb-1 font-serif text-sm italic text-elimu-900">
                    {school.directorName}
                  </div>
                  <p className="mt-1 uppercase tracking-wide">Direction</p>
                </div>
              </footer>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link href={`/ecoles/tableau-de-bord/eleves/${report.student.id}`} className="btn-outline">
                  Dossier complet de l’élève
                </Link>
                <Link href={`/ecoles/tableau-de-bord/notes?classe=${classId}&periode=${period}`} className="btn-ghost">
                  Modifier les notes
                </Link>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
