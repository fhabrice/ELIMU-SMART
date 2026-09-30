import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge, InfoRow, ProgressBar } from '@/components/ui';
import { updateStudentStatusAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import {
  attendanceByStudent,
  buildReportCard,
  getStudent,
  studentInvoices,
} from '@/lib/data/school';
import { formatCdf, formatDate } from '@/lib/utils';

type Params = Promise<{ id: string }>;

export default async function StudentFilePage({ params }: { params: Params }) {
  const { id } = await params;
  const { school } = await requireActiveSchool();
  const student = getStudent(id);
  if (!student || student.schoolId !== school.id) notFound();

  const report = buildReportCard(student.id, 'T1');
  const attendance = attendanceByStudent(student.id, 15);
  const invoices = studentInvoices(student.id);

  const absences = attendance.filter((item) => item.status === 'ABSENT').length;
  const lates = attendance.filter((item) => item.status === 'RETARD').length;
  const totalDue = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elimu-50 text-3xl">
            {student.photoEmoji}
          </span>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {student.lastName} {student.firstName}
            </h2>
            <p className="text-sm text-slate-500">
              Matricule {student.matricule} · {student.className ?? 'sans classe'} ·{' '}
              {student.gender === 'F' ? 'Fille' : 'Garçon'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={student.status === 'ACTIF' ? 'green' : 'gold'}>{student.status}</Badge>
          <Link href="/ecoles/tableau-de-bord/eleves" className="btn-outline px-3 py-1.5 text-xs">
            ← Retour à la liste
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900">📄 Bulletin — Trimestre 1</h3>
          {report && report.rows.length > 0 ? (
            <>
              <div className="mt-4 overflow-x-auto">
                <table className="table-base">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Moyenne</th>
                      <th>Coef.</th>
                      <th>Points</th>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl bg-elimu-50 p-3">
                  <p className="text-xs text-elimu-700">Moyenne générale</p>
                  <p className="text-lg font-bold text-elimu-900">{report.average.toFixed(2)}</p>
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
                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-700">Décision</p>
                  <p className="text-sm font-bold text-emerald-900">{report.decision}</p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-slate-500">
              Aucune note enregistrée pour ce trimestre.{' '}
              <Link href="/ecoles/tableau-de-bord/notes" className="text-elimu-700 underline">
                Saisir des notes
              </Link>
            </p>
          )}
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-base font-bold text-slate-900">Fiche de l’élève</h3>
            <div className="mt-3">
              <InfoRow label="Date de naissance" value={student.birthDate ? formatDate(student.birthDate) : '—'} />
              <InfoRow label="Lieu de naissance" value={student.placeOfBirth ?? '—'} />
              <InfoRow
                label="Responsable"
                value={
                  student.guardianName
                    ? `${student.guardianName} (${student.guardianRelation ?? 'tuteur'})`
                    : '—'
                }
              />
              <InfoRow label="Téléphone" value={student.guardianPhone ?? '—'} />
              <InfoRow label="Adresse" value={student.address ?? '—'} />
              <InfoRow label="Inscrit le" value={formatDate(student.enrolledAt)} />
            </div>

            <form action={updateStudentStatusAction} className="mt-4 space-y-2">
              <input type="hidden" name="schoolId" value={school.id} />
              <input type="hidden" name="studentId" value={student.id} />
              <label className="label" htmlFor="status">
                Changer le statut
              </label>
              <select id="status" name="status" className="input" defaultValue={student.status}>
                <option value="ACTIF">Actif</option>
                <option value="TRANSFERE">Transféré</option>
                <option value="ABANDON">Abandon</option>
                <option value="DIPLOME">Diplômé</option>
              </select>
              <button type="submit" className="btn-outline w-full">
                Mettre à jour
              </button>
            </form>
          </div>

          <div className="card p-6">
            <h3 className="text-base font-bold text-slate-900">🗓️ Assiduité (15 derniers pointages)</h3>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-rose-50 p-3">
                <p className="text-xs text-rose-700">Absences</p>
                <p className="text-xl font-bold text-rose-800">{absences}</p>
              </div>
              <div className="rounded-xl bg-gold-50 p-3">
                <p className="text-xs text-gold-700">Retards</p>
                <p className="text-xl font-bold text-gold-900">{lates}</p>
              </div>
            </div>
            <ul className="mt-3 space-y-1.5 text-sm">
              {attendance.slice(0, 6).map((record) => (
                <li key={record.id} className="flex items-center justify-between">
                  <span className="text-slate-500">{formatDate(record.date)}</span>
                  <Badge
                    tone={
                      record.status === 'PRESENT' ? 'green' : record.status === 'ABSENT' ? 'red' : 'gold'
                    }
                  >
                    {record.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-base font-bold text-slate-900">💰 Situation financière</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-500">Total facturé</p>
            <p className="text-lg font-bold text-slate-800">{formatCdf(totalDue)}</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs text-emerald-700">Total payé</p>
            <p className="text-lg font-bold text-emerald-800">{formatCdf(totalPaid)}</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-xs text-rose-700">Solde restant</p>
            <p className="text-lg font-bold text-rose-800">{formatCdf(Math.max(totalDue - totalPaid, 0))}</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0} tone="green" />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="table-base">
            <thead>
              <tr>
                <th>Libellé</th>
                <th>Période</th>
                <th>Montant</th>
                <th>Payé</th>
                <th>Solde</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.label}</td>
                  <td>{invoice.period}</td>
                  <td>{formatCdf(invoice.amount)}</td>
                  <td className="text-emerald-700">{formatCdf(invoice.paid)}</td>
                  <td className={invoice.balance > 0 ? 'font-semibold text-rose-700' : 'text-slate-500'}>
                    {formatCdf(Math.max(invoice.balance, 0))}
                  </td>
                  <td>
                    <Badge
                      tone={
                        invoice.status === 'PAYE' ? 'green' : invoice.status === 'PARTIEL' ? 'gold' : 'red'
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/ecoles/tableau-de-bord/finances" className="btn-outline mt-4">
          Enregistrer un paiement →
        </Link>
      </div>
    </div>
  );
}


