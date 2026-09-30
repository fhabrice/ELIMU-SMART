import Link from 'next/link';
import { Badge, ProgressBar } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { addClassAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { listClasses, listTeachers } from '@/lib/data/school';

export const metadata = { title: 'Classes' };

export default async function ClassesPage() {
  const { school } = await requireActiveSchool();
  const classes = listClasses(school.id);
  const teachers = listTeachers(school.id);
  const totalStudents = classes.reduce((sum, klass) => sum + klass.studentCount, 0);
  const totalCapacity = classes.reduce((sum, klass) => sum + klass.capacity, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Classes et sections</h2>
          <p className="text-sm text-slate-500">
            {classes.length} classe(s) · {totalStudents} élèves · capacité totale {totalCapacity} places
          </p>
        </div>
        <Badge tone="blue">Taux d’occupation {totalCapacity ? Math.round((totalStudents / totalCapacity) * 100) : 0} %</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.4fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {classes.map((klass) => {
            const fill = Math.round((klass.studentCount / Math.max(klass.capacity, 1)) * 100);
            return (
              <div key={klass.id} className="card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{klass.name}</h3>
                    <p className="text-xs text-slate-500">
                      {klass.level}
                      {klass.section ? ` · ${klass.section}` : ''} · Salle {klass.room ?? '—'}
                    </p>
                  </div>
                  <Badge tone={fill > 95 ? 'red' : fill > 75 ? 'gold' : 'green'}>{fill} %</Badge>
                </div>

                <div className="mt-4">
                  <ProgressBar value={fill} tone={fill > 95 ? 'gold' : 'blue'} />
                  <p className="mt-1.5 text-xs text-slate-500">
                    {klass.studentCount} / {klass.capacity} places occupées
                  </p>
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  Titulaire : <span className="font-medium text-slate-700">{klass.mainTeacherName ?? 'non attribué'}</span>
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/ecoles/tableau-de-bord/eleves?classe=${klass.id}`}
                    className="btn-outline px-3 py-1.5 text-xs"
                  >
                    Voir les élèves
                  </Link>
                  <Link
                    href={`/ecoles/tableau-de-bord/notes?classe=${klass.id}`}
                    className="btn-primary px-3 py-1.5 text-xs"
                  >
                    Saisir des notes
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="card h-fit p-5">
          <h3 className="text-base font-bold text-slate-900">➕ Nouvelle classe</h3>
          <div className="mt-4">
            <ActionForm
              action={addClassAction}
              submitLabel="Créer la classe"
              hiddenFields={{ schoolId: school.id }}
              className="space-y-3"
            >
                              <>
                  <div>
                    <label className="label" htmlFor="name">
                      Nom de la classe *
                    </label>
                    <input id="name" name="name" required className="input" placeholder="Ex. 6ème Commerciale A" />
                    <FieldError name="name" />
                  </div>
                  <div>
                    <label className="label" htmlFor="level">
                      Niveau *
                    </label>
                    <input
                      id="level"
                      name="level"
                      required
                      className="input"
                      placeholder="Ex. 1ère année secondaire"
                    />
                    <FieldError name="level" />
                  </div>
                  <div>
                    <label className="label" htmlFor="section">
                      Section
                    </label>
                    <input id="section" name="section" className="input" placeholder="Scientifique, Commerciale…" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="capacity">
                        Capacité
                      </label>
                      <input id="capacity" name="capacity" type="number" min={5} max={120} defaultValue={40} className="input" />
                    </div>
                    <div>
                      <label className="label" htmlFor="room">
                        Salle
                      </label>
                      <input id="room" name="room" className="input" placeholder="L1" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="mainTeacherId">
                      Enseignant titulaire
                    </label>
                    <select id="mainTeacherId" name="mainTeacherId" className="input" defaultValue="">
                      <option value="">Non attribué</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.lastName} {teacher.firstName} — {teacher.subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
