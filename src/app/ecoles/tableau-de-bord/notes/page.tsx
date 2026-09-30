import Link from 'next/link';
import { Alert, Badge } from '@/components/ui';
import { saveGradesAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { listClasses, listGrades, listStudents, listTeachers, subjectAverages } from '@/lib/data/school';
import { PERIODS, SECONDARY_SUBJECTS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Notes' };

export default async function GradesPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; periode?: string; matiere?: string; enregistre?: string }>;
}) {
  const params = await searchParams;
  const { school } = await requireActiveSchool();

  const classes = listClasses(school.id);
  const teachers = listTeachers(school.id);
  const classId = params.classe ?? classes[0]?.id ?? '';
  const period = params.periode ?? 'T1';
  const subject = params.matiere ?? SECONDARY_SUBJECTS[0];

  const students = classId ? listStudents(school.id, { classId, status: 'ACTIF' }) : [];
  const existing = new Map<string, number>();
  students.forEach((student) => {
    const grade = listGrades(student.id, period).find((item) => item.subject === subject);
    if (grade) existing.set(student.id, grade.score);
  });

  const ranked = students
    .map((student) => {
      const rows = subjectAverages(student.id, period);
      const totalCoef = rows.reduce((sum, row) => sum + row.coefficient, 0);
      const average = totalCoef
        ? rows.reduce((sum, row) => sum + row.average * row.coefficient, 0) / totalCoef
        : null;
      return { student, average };
    })
    .sort((a, b) => (b.average ?? 0) - (a.average ?? 0));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Saisie des notes</h2>
          <p className="text-sm text-slate-500">
            Classe : {classes.find((klass) => klass.id === classId)?.name ?? '—'} · Matière : {subject} · Période :{' '}
            {period}
          </p>
        </div>
        <Badge tone="blue">Notes sur 100 · seuil de réussite 50 %</Badge>
      </div>

      {params.enregistre && (
        <Alert tone="success" title="Notes enregistrées">
          {params.enregistre} note(s) ont été enregistrées pour {subject} ({period}).
        </Alert>
      )}

      <form className="card grid gap-3 p-4 sm:grid-cols-4" action="/ecoles/tableau-de-bord/notes">
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
          <label className="label" htmlFor="matiere">
            Matière
          </label>
          <select id="matiere" name="matiere" className="input" defaultValue={subject}>
            {SECONDARY_SUBJECTS.map((item) => (
              <option key={item} value={item}>
                {item}
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
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-outline w-full">
            🔍 Charger la liste
          </button>
        </div>
      </form>

      <form action={saveGradesAction} className="card overflow-hidden">
        <input type="hidden" name="schoolId" value={school.id} />
        <input type="hidden" name="classId" value={classId} />
        <input type="hidden" name="subject" value={subject} />
        <input type="hidden" name="period" value={period} />

        <div className="grid gap-3 border-b border-slate-100 px-5 py-4 sm:grid-cols-4">
          <div>
            <label className="label" htmlFor="maxScore">
              Note maximale
            </label>
            <input id="maxScore" name="maxScore" type="number" defaultValue={100} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="coefficient">
              Coefficient
            </label>
            <input id="coefficient" name="coefficient" type="number" min={1} max={5} defaultValue={2} className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="teacherName">
              Enseignant
            </label>
            <select id="teacherName" name="teacherName" className="input" defaultValue="">
              <option value="">Non précisé</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={`${teacher.lastName} ${teacher.firstName}`}>
                  {teacher.lastName} {teacher.firstName} — {teacher.subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Élève</th>
                <th className="w-40">Note /100</th>
                <th>Moyenne générale {period}</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map(({ student, average }) => (
                <tr key={student.id}>
                  <td className="font-mono text-xs text-slate-500">{student.matricule}</td>
                  <td className="font-medium text-slate-800">
                    {student.lastName} {student.firstName}
                  </td>
                  <td>
                    <input
                      name={`score_${student.id}`}
                      type="number"
                      min={0}
                      max={100}
                      step="0.5"
                      defaultValue={existing.get(student.id) ?? ''}
                      className="input py-1.5"
                      placeholder="—"
                    />
                  </td>
                  <td>
                    {average !== null ? (
                      <span className={average >= 50 ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'}>
                        {average.toFixed(2)}
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

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">
            Les notes saisies remplacent les valeurs existantes pour cette matière et cette période.
          </p>
          <div className="flex gap-2">
            <Link href={`/ecoles/tableau-de-bord/bulletins?classe=${classId}&periode=${period}`} className="btn-outline">
              Voir les bulletins
            </Link>
            <button type="submit" className="btn-primary">
              💾 Enregistrer les notes
            </button>
          </div>
        </div>
      </form>

      <p className="text-xs text-slate-400">
        Dernière mise à jour de la page : {formatDate(new Date())}
      </p>
    </div>
  );
}
