import { Badge } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { addTeacherAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { listTeachers } from '@/lib/data/school';
import { SECONDARY_SUBJECTS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Enseignants' };

export default async function TeachersPage() {
  const { school } = await requireActiveSchool();
  const teachers = listTeachers(school.id);
  const permanent = teachers.filter((teacher) => teacher.contractType === 'PERMANENT').length;
  const women = teachers.filter((teacher) => teacher.gender === 'F').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Équipe pédagogique</h2>
          <p className="text-sm text-slate-500">
            {teachers.length} enseignant(s) · {permanent} permanents · {women} femmes
          </p>
        </div>
        <Badge tone="blue">Ratio élèves/enseignant :{' '}
          {teachers.length ? Math.round(540 / teachers.length) : '—'} (indicatif)
        </Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.4fr]">
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-base">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Matière</th>
                  <th>Qualification</th>
                  <th>Contrat</th>
                  <th>Classes</th>
                  <th>Contact</th>
                  <th>Embauche</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="font-medium text-slate-800">
                      {teacher.lastName} {teacher.firstName}
                      <span className="ml-2 text-xs text-slate-400">{teacher.gender}</span>
                    </td>
                    <td>{teacher.subject}</td>
                    <td className="text-xs text-slate-500">{teacher.qualification ?? '—'}</td>
                    <td>
                      <Badge tone={teacher.contractType === 'PERMANENT' ? 'green' : 'gold'}>
                        {teacher.contractType}
                      </Badge>
                    </td>
                    <td>{teacher.classCount}</td>
                    <td className="text-xs text-slate-500">
                      {teacher.phone ?? '—'}
                      {teacher.email && <span className="block text-slate-400">{teacher.email}</span>}
                    </td>
                    <td className="text-xs text-slate-500">{formatDate(teacher.hiredAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card h-fit p-5">
          <h3 className="text-base font-bold text-slate-900">➕ Ajouter un enseignant</h3>
          <div className="mt-4">
            <ActionForm
              action={addTeacherAction}
              submitLabel="Ajouter à l’équipe"
              hiddenFields={{ schoolId: school.id }}
              className="space-y-3"
            >
                              <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="lastName">
                        Nom *
                      </label>
                      <input id="lastName" name="lastName" required className="input" />
                      <FieldError name="lastName" />
                    </div>
                    <div>
                      <label className="label" htmlFor="firstName">
                        Prénom *
                      </label>
                      <input id="firstName" name="firstName" required className="input" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="gender">
                        Sexe
                      </label>
                      <select id="gender" name="gender" className="input" defaultValue="M">
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="contractType">
                        Contrat
                      </label>
                      <select id="contractType" name="contractType" className="input" defaultValue="PERMANENT">
                        <option value="PERMANENT">Permanent</option>
                        <option value="VACATAIRE">Vacataire</option>
                        <option value="STAGIAIRE">Stagiaire</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="subject">
                      Matière enseignée *
                    </label>
                    <select id="subject" name="subject" className="input" defaultValue="Mathématiques">
                      {SECONDARY_SUBJECTS.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                    <FieldError name="subject" />
                  </div>
                  <div>
                    <label className="label" htmlFor="qualification">
                      Qualification
                    </label>
                    <input
                      id="qualification"
                      name="qualification"
                      className="input"
                      placeholder="Licence en pédagogie appliquée"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="phone">
                      Téléphone
                    </label>
                    <input id="phone" name="phone" className="input" placeholder="+243 …" />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">
                      E-mail
                    </label>
                    <input id="email" name="email" type="email" className="input" placeholder="enseignant@ecole.cd" />
                  </div>
                </>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
