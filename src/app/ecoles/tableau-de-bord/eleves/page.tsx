import Link from 'next/link';
import { Badge, EmptyState } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { addStudentAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { listClasses, listStudents } from '@/lib/data/school';
import { getTranslator } from '@/lib/locale';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Élèves' };

const STATUS_TONES: Record<string, 'green' | 'gold' | 'red' | 'neutral'> = {
  ACTIF: 'green',
  TRANSFERE: 'gold',
  ABANDON: 'red',
  DIPLOME: 'neutral',
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; q?: string; statut?: string }>;
}) {
  const params = await searchParams;
  const { school } = await requireActiveSchool();
  const { t } = await getTranslator();

  const classes = listClasses(school.id);
  const students = listStudents(school.id, {
    classId: params.classe,
    q: params.q,
    status: params.statut,
  });
  const girls = students.filter((student) => student.gender === 'F').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('school.students')}</h2>
          <p className="text-sm text-slate-500">
            {students.length} élève(s) affiché(s) · {girls} fille(s) · {students.length - girls} garçon(s)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">Année {school.academicYear}</Badge>
          <Badge tone="neutral">{classes.length} classes</Badge>
        </div>
      </div>

      {/* ------------------------------------------------------------ Filtres */}
      <form className="card grid gap-3 p-4 sm:grid-cols-4" action="/ecoles/tableau-de-bord/eleves">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="q">
            Rechercher
          </label>
          <input id="q" name="q" defaultValue={params.q ?? ''} className="input" placeholder="Nom, matricule…" />
        </div>
        <div>
          <label className="label" htmlFor="classe">
            {t('school.class')}
          </label>
          <select id="classe" name="classe" defaultValue={params.classe ?? ''} className="input">
            <option value="">{t('common.all')}</option>
            {classes.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="label" htmlFor="statut">
              {t('common.status')}
            </label>
            <select id="statut" name="statut" defaultValue={params.statut ?? ''} className="input">
              <option value="">{t('common.all')}</option>
              <option value="ACTIF">Actif</option>
              <option value="TRANSFERE">Transféré</option>
              <option value="ABANDON">Abandon</option>
              <option value="DIPLOME">Diplômé</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">
            🔍
          </button>
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.4fr]">
        {/* --------------------------------------------------------- Tableau */}
        <div className="card overflow-hidden">
          {students.length === 0 ? (
            <EmptyState title="Aucun élève trouvé" description="Ajustez les filtres ou inscrivez un nouvel élève." icon="🧑🏾‍🎓" />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>{t('school.matricule')}</th>
                    <th>Nom complet</th>
                    <th>{t('school.class')}</th>
                    <th>Sexe</th>
                    <th>{t('school.guardian')}</th>
                    <th>{t('common.status')}</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 60).map((student) => (
                    <tr key={student.id}>
                      <td className="font-mono text-xs text-slate-500">{student.matricule}</td>
                      <td className="font-medium text-slate-800">
                        {student.photoEmoji} {student.lastName} {student.firstName}
                      </td>
                      <td>{student.className ?? '—'}</td>
                      <td>{student.gender === 'F' ? 'F' : 'M'}</td>
                      <td className="text-xs text-slate-500">
                        {student.guardianName ?? '—'}
                        {student.guardianPhone && <span className="block text-slate-400">{student.guardianPhone}</span>}
                      </td>
                      <td>
                        <Badge tone={STATUS_TONES[student.status] ?? 'neutral'}>{student.status}</Badge>
                      </td>
                      <td>
                        <Link
                          href={`/ecoles/tableau-de-bord/eleves/${student.id}`}
                          className="text-sm font-semibold text-elimu-700 hover:underline"
                        >
                          Dossier →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {students.length > 60 && (
            <p className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Affichage limité aux 60 premiers résultats ({students.length} au total). Affinez votre recherche.
            </p>
          )}
        </div>

        {/* ------------------------------------------------------ Inscription */}
        <div className="card h-fit p-5">
          <h3 className="text-base font-bold text-slate-900">➕ {t('school.addStudent')}</h3>
          <p className="mt-1 text-xs text-slate-500">Le matricule est généré automatiquement.</p>

          <div className="mt-4">
            <ActionForm
              action={addStudentAction}
              submitLabel="Inscrire l’élève"
              pendingLabel="Enregistrement…"
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
                      <FieldError name="firstName" />
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
                      <label className="label" htmlFor="classId">
                        {t('school.class')}
                      </label>
                      <select id="classId" name="classId" className="input" defaultValue="">
                        <option value="">Non affecté</option>
                        {classes.map((klass) => (
                          <option key={klass.id} value={klass.id}>
                            {klass.name} ({klass.studentCount}/{klass.capacity})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="birthDate">
                        Date de naissance
                      </label>
                      <input id="birthDate" name="birthDate" type="date" className="input" />
                    </div>
                    <div>
                      <label className="label" htmlFor="placeOfBirth">
                        Lieu de naissance
                      </label>
                      <input id="placeOfBirth" name="placeOfBirth" className="input" placeholder="Kinshasa" />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="guardianName">
                      {t('school.guardian')}
                    </label>
                    <input id="guardianName" name="guardianName" className="input" placeholder="Nom du parent ou tuteur" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label" htmlFor="guardianRelation">
                        Lien
                      </label>
                      <select id="guardianRelation" name="guardianRelation" className="input" defaultValue="Père">
                        {['Père', 'Mère', 'Oncle', 'Tante', 'Tuteur'].map((relation) => (
                          <option key={relation} value={relation}>
                            {relation}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="guardianPhone">
                        Téléphone
                      </label>
                      <input id="guardianPhone" name="guardianPhone" className="input" placeholder="+243 …" />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="address">
                      Adresse
                    </label>
                    <input id="address" name="address" className="input" placeholder="Avenue, quartier, commune" />
                  </div>

                  <p className="text-xs text-slate-400">
                    Inscrit aujourd’hui — {formatDate(new Date())}
                  </p>
                </>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
