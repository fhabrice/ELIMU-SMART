import Link from 'next/link';
import { ProgressBar, Stat } from '@/components/ui';
import { requireActiveSchool } from '@/lib/school-context';
import { getSchoolOverview, listInvoices, recentAttendanceDays, listTeachers } from '@/lib/data/school';
import { getTranslator } from '@/lib/locale';
import { formatCdf, formatDate, formatNumber } from '@/lib/utils';

export const metadata = { title: 'Tableau de bord établissement' };

export default async function SchoolDashboardPage() {
  const { school } = await requireActiveSchool();
  const { t } = await getTranslator();

  const overview = getSchoolOverview(school.id, 'T1');
  const recentDays = recentAttendanceDays(school.id, 6);
  const unpaid = listInvoices(school.id, { status: 'IMPAYE', limit: 6 });
  const teachers = listTeachers(school.id);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={t('school.students')}
          value={formatNumber(overview.students)}
          icon="🧑🏾‍🎓"
          hint={`${overview.girls} filles · ${overview.boys} garçons`}
        />
        <Stat label={t('school.classes')} value={overview.classes} icon="🏫" hint={`Capacité ${school.capacity} places`} />
        <Stat label={t('school.teachers')} value={overview.teachers} icon="👩🏾‍🏫" hint="Équipe pédagogique" />
        <Stat
          label="Taux de présence (30 j)"
          value={`${overview.attendanceRate} %`}
          icon="🗓️"
          hint={`${formatNumber(overview.attendanceWindow)} pointages`}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Effectifs et moyennes par classe</h2>
            <Link href="/ecoles/tableau-de-bord/classes" className="text-sm font-semibold text-elimu-700 hover:underline">
              Gérer les classes →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Classe</th>
                  <th>Niveau</th>
                  <th>Effectif</th>
                  <th>Taux de remplissage</th>
                  <th>Moyenne T1</th>
                </tr>
              </thead>
              <tbody>
                {overview.byClass.map((row) => (
                  <tr key={row.id}>
                    <td className="font-semibold text-slate-800">{row.name}</td>
                    <td className="text-slate-500">{row.level}</td>
                    <td>
                      {row.students} / {row.capacity}
                    </td>
                    <td className="w-40">
                      <ProgressBar value={Math.round((row.students / Math.max(row.capacity, 1)) * 100)} />
                    </td>
                    <td>
                      {row.average ? (
                        <span className={row.average >= 50 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                          {row.average.toFixed(2)} / 100
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">💰 {t('school.finance')}</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Total facturé</p>
              <p className="text-lg font-bold text-slate-800">{formatCdf(overview.invoicedCdf)}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-700">Encaissé</p>
              <p className="text-lg font-bold text-emerald-800">{formatCdf(overview.collectedCdf)}</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4">
              <p className="text-xs uppercase tracking-wide text-rose-700">Reste à percevoir</p>
              <p className="text-lg font-bold text-rose-800">{formatCdf(overview.outstandingCdf)}</p>
              <p className="mt-1 text-xs text-rose-700">{overview.defaulters} élève(s) en défaut de paiement</p>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>{t('school.paidRate')}</span>
                <span className="font-semibold">{overview.collectionRate} %</span>
              </div>
              <ProgressBar value={overview.collectionRate} tone="gold" />
            </div>
            <Link href="/ecoles/tableau-de-bord/finances" className="btn-primary w-full">
              Gérer les frais scolaires
            </Link>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">🗓️ Présences des derniers jours</h2>
            <Link href="/ecoles/tableau-de-bord/presences" className="text-sm font-semibold text-elimu-700 hover:underline">
              Saisir →
            </Link>
          </div>
          {recentDays.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucun pointage enregistré.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentDays.map((day) => {
                const rate = day.total > 0 ? Math.round((day.present / day.total) * 100) : 0;
                return (
                  <li key={day.date}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{formatDate(day.date)}</span>
                      <span className="font-semibold text-slate-700">
                        {rate} % ({day.present}/{day.total})
                      </span>
                    </div>
                    <ProgressBar value={rate} tone={rate >= 90 ? 'green' : rate >= 75 ? 'blue' : 'gold'} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">⚠️ Frais impayés — priorités</h2>
            <Link href="/ecoles/tableau-de-bord/finances" className="text-sm font-semibold text-elimu-700 hover:underline">
              Tout voir →
            </Link>
          </div>
          {unpaid.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucune facture impayée 🎉</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100">
              {unpaid.map((invoice) => (
                <li key={invoice.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {invoice.lastName} {invoice.firstName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {invoice.matricule} · {invoice.className ?? 'Sans classe'} · {invoice.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-700">{formatCdf(invoice.balance)}</p>
                    <p className="text-xs text-slate-400">échue le {formatDate(invoice.dueDate)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">👩🏾‍🏫 Équipe pédagogique</h2>
          <Link href="/ecoles/tableau-de-bord/enseignants" className="text-sm font-semibold text-elimu-700 hover:underline">
            Gérer →
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.slice(0, 6).map((teacher) => (
            <div key={teacher.id} className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-800">
                {teacher.firstName} {teacher.lastName}
              </p>
              <p className="text-xs text-slate-500">{teacher.subject}</p>
              <p className="mt-1 text-xs text-slate-400">
                {teacher.contractType} · {teacher.classCount} classe(s) principale(s)
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
