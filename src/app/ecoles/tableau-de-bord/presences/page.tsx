import { Alert, Badge } from '@/components/ui';
import { saveAttendanceAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { listAttendanceForDate, listClasses, listStudents } from '@/lib/data/school';
import { ATTENDANCE_STATUS } from '@/lib/constants';
import { cn, formatDate } from '@/lib/utils';

export const metadata = { title: 'Présences' };

const STATUSES = ['PRESENT', 'ABSENT', 'RETARD', 'EXCUSE'] as const;

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; date?: string; enregistre?: string }>;
}) {
  const params = await searchParams;
  const { school } = await requireActiveSchool();

  const today = new Date().toISOString().slice(0, 10);
  const date = params.date ?? today;
  const classes = listClasses(school.id);
  // Par défaut, on ouvre la feuille de la première classe : pointer 500 élèves
  // d'un coup serait impraticable pour un titulaire.
  const classId = params.classe ?? classes[0]?.id ?? '';
  const students = listStudents(school.id, { classId, status: 'ACTIF' });
  const existing = listAttendanceForDate(school.id, date, classId);
  const existingMap = new Map(existing.map((record) => [record.studentId, record.status]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Feuille de présence</h2>
          <p className="text-sm text-slate-500">
            Classe : {classes.find((klass) => klass.id === classId)?.name ?? '—'} · {students.length} élève(s) ·{' '}
            {formatDate(date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={existing.length > 0 ? 'green' : 'gold'}>
            {existing.length > 0 ? 'Pointage déjà saisi — modifiable' : 'Aucun pointage pour cette date'}
          </Badge>
        </div>
      </div>

      {params.enregistre === '1' && (
        <Alert tone="success" title="Présences enregistrées">
          La feuille du {formatDate(date)} a été mise à jour pour {students.length} élève(s).
        </Alert>
      )}

      <form className="card grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]" action="/ecoles/tableau-de-bord/presences">
        <div>
          <label className="label" htmlFor="classe">
            Classe
          </label>
          <select id="classe" name="classe" className="input" defaultValue={classId}>
            {classes.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name} ({klass.studentCount})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="date">
            Date
          </label>
          <input id="date" name="date" type="date" defaultValue={date} className="input" />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-outline">
            🔍 Afficher
          </button>
        </div>
      </form>

      <form action={saveAttendanceAction} className="card overflow-hidden">
        <input type="hidden" name="schoolId" value={school.id} />
        <input type="hidden" name="date" value={date} />
        <input type="hidden" name="classId" value={classId} />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-sm font-bold text-slate-800">Pointage du jour</p>
            <p className="text-xs text-slate-500">
              P = présent · A = absent · R = retard · E = excusé. Les valeurs par défaut sont « présent ».
            </p>
          </div>
          <button type="submit" className="btn-primary">
            💾 Enregistrer les présences
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Élève</th>
                <th>Classe</th>
                {STATUSES.map((status) => (
                  <th key={status} className="text-center">
                    {ATTENDANCE_STATUS[status].fr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const current = existingMap.get(student.id) ?? 'PRESENT';
                return (
                  <tr key={student.id}>
                    <td className="font-mono text-xs text-slate-500">{student.matricule}</td>
                    <td className="font-medium text-slate-800">
                      {student.lastName} {student.firstName}
                    </td>
                    <td className="text-xs text-slate-500">{student.className ?? '—'}</td>
                    {STATUSES.map((status) => (
                      <td key={status} className="text-center">
                        <input
                          type="radio"
                          name={`status_${student.id}`}
                          value={status}
                          defaultChecked={current === status}
                          className={cn(
                            'h-4 w-4 border-slate-300 focus:ring-elimu-400',
                            status === 'PRESENT' ? 'text-emerald-600' : status === 'ABSENT' ? 'text-rose-600' : 'text-gold-500',
                          )}
                          aria-label={`${ATTENDANCE_STATUS[status].fr} — ${student.lastName} ${student.firstName}`}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            {existing.length > 0
              ? 'Les pointages existants sont préchargés.'
              : 'Aucun pointage existant : tous les élèves sont considérés présents par défaut.'}
          </p>
          <button type="submit" className="btn-primary">
            💾 Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
