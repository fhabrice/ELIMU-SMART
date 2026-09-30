import Link from 'next/link';
import { Badge, EmptyState, ProgressBar, Stat } from '@/components/ui';
import { ActionForm, FieldError } from '@/components/forms';
import { addInvoiceAction, recordPaymentAction } from '@/lib/actions/school';
import { requireActiveSchool } from '@/lib/school-context';
import { financeTotals, getInvoice, listClasses, listInvoices, listPaymentsForInvoice } from '@/lib/data/school';
import { INVOICE_STATUS, PAYMENT_METHODS } from '@/lib/constants';
import { formatCdf, formatDate } from '@/lib/utils';

export const metadata = { title: 'Frais scolaires' };

function paymentMethodLabel(method: string): string {
  const table = PAYMENT_METHODS as Record<string, { fr: string; en: string } | undefined>;
  return table[method]?.fr ?? method;
}

export default async function FinancePage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; q?: string; facture?: string }>;
}) {
  const params = await searchParams;
  const { school } = await requireActiveSchool();

  const totals = financeTotals(school.id);
  const classes = listClasses(school.id);
  const invoices = listInvoices(school.id, { status: params.statut, q: params.q, limit: 80 });
  const selectedInvoice = params.facture
    ? invoices.find((invoice) => invoice.id === params.facture) ?? getInvoice(params.facture)
    : null;
  const payments = selectedInvoice ? listPaymentsForInvoice(selectedInvoice.id) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Frais scolaires</h2>
          <p className="text-sm text-slate-500">
            {totals.count} facture(s) · {totals.collectionRate} % de recouvrement · devise de référence : CDF
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue">Mobile Money · Espèces · Banque</Badge>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total facturé" value={formatCdf(totals.invoiced)} icon="🧾" />
        <Stat label="Encaissé" value={formatCdf(totals.collected)} icon="✅" hint={`${totals.collectionRate} % du facturé`} />
        <Stat label="Reste à percevoir" value={formatCdf(totals.outstanding)} icon="⏳" />
        <Stat label="Factures" value={totals.count} icon="📄" hint="Hors factures annulées" />
      </section>

      <div className="card p-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
          <span>Taux de recouvrement global</span>
          <span className="font-semibold">{totals.collectionRate} %</span>
        </div>
        <ProgressBar value={totals.collectionRate} tone={totals.collectionRate >= 80 ? 'green' : 'gold'} />
      </div>

      <form className="card grid gap-3 p-4 sm:grid-cols-3" action="/ecoles/tableau-de-bord/finances">
        <div className="sm:col-span-2">
          <label className="label" htmlFor="q">
            Rechercher un élève
          </label>
          <input id="q" name="q" defaultValue={params.q ?? ''} className="input" placeholder="Nom ou matricule" />
        </div>
        <div>
          <label className="label" htmlFor="statut">
            Statut
          </label>
          <div className="flex gap-2">
            <select id="statut" name="statut" className="input" defaultValue={params.statut ?? ''}>
              <option value="">Tous</option>
              <option value="IMPAYE">Impayé</option>
              <option value="PARTIEL">Partiel</option>
              <option value="PAYE">Payé</option>
            </select>
            <button type="submit" className="btn-outline">
              🔍
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        <div className="card overflow-hidden">
          {invoices.length === 0 ? (
            <EmptyState title="Aucune facture" description="Créez une facture pour une classe ou pour toute l’école." icon="🧾" />
          ) : (
            <div className="overflow-x-auto">
              <table className="table-base">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>Classe</th>
                    <th>Libellé</th>
                    <th>Montant</th>
                    <th>Payé</th>
                    <th>Solde</th>
                    <th>Échéance</th>
                    <th>Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="font-medium text-slate-800">
                        {invoice.lastName} {invoice.firstName}
                        <span className="block font-mono text-[11px] text-slate-400">{invoice.matricule}</span>
                      </td>
                      <td className="text-xs text-slate-500">{invoice.className ?? '—'}</td>
                      <td className="text-sm">{invoice.label}</td>
                      <td>{formatCdf(invoice.amount)}</td>
                      <td className="text-emerald-700">{formatCdf(invoice.paid)}</td>
                      <td className={invoice.balance > 0 ? 'font-semibold text-rose-700' : 'text-slate-500'}>
                        {formatCdf(Math.max(invoice.balance, 0))}
                      </td>
                      <td className="text-xs text-slate-500">{formatDate(invoice.dueDate)}</td>
                      <td>
                        <Badge
                          tone={
                            invoice.status === 'PAYE' ? 'green' : invoice.status === 'PARTIEL' ? 'gold' : 'red'
                          }
                        >
                          {INVOICE_STATUS[invoice.status]?.fr ?? invoice.status}
                        </Badge>
                      </td>
                      <td>
                        <Link
                          href={`/ecoles/tableau-de-bord/finances?facture=${invoice.id}`}
                          className="text-sm font-semibold text-elimu-700 hover:underline"
                        >
                          Paiement →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* --------------------------------------------------- Paiement */}
          <div className="card p-5">
            <h3 className="text-base font-bold text-slate-900">💵 Enregistrer un paiement</h3>
            {!selectedInvoice ? (
              <p className="mt-2 text-sm text-slate-500">
                Sélectionnez une facture dans la liste (« Paiement → ») pour enregistrer un versement.
              </p>
            ) : (
              <>
                <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-800">
                    {selectedInvoice.lastName} {selectedInvoice.firstName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedInvoice.label} · solde {formatCdf(Math.max(selectedInvoice.balance, 0))}
                  </p>
                </div>

                <div className="mt-4">
                  <ActionForm
                    action={recordPaymentAction}
                    submitLabel="Enregistrer le paiement"
                    pendingLabel="Enregistrement…"
                    hiddenFields={{ schoolId: school.id, invoiceId: selectedInvoice.id }}
                    className="space-y-3"
                  >
                                          <>
                        <div>
                          <label className="label" htmlFor="amount">
                            Montant (CDF) *
                          </label>
                          <input
                            id="amount"
                            name="amount"
                            type="number"
                            min={1}
                            step="500"
                            required
                            defaultValue={Math.max(selectedInvoice.balance, 0)}
                            className="input"
                          />
                          <FieldError name="amount" />
                        </div>
                        <div>
                          <label className="label" htmlFor="method">
                            Mode de paiement
                          </label>
                          <select id="method" name="method" className="input" defaultValue="MOBILE_MONEY">
                            {Object.entries(PAYMENT_METHODS).map(([value, meta]) => (
                              <option key={value} value={value}>
                                {meta.fr}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="label" htmlFor="reference">
                            Référence / reçu
                          </label>
                          <input id="reference" name="reference" className="input" placeholder="MP-2026-12345" />
                        </div>
                      </>
                  </ActionForm>
                </div>

                {payments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Historique des versements
                    </p>
                    <ul className="mt-2 space-y-2 text-sm">
                      {payments.map((payment) => (
                        <li key={payment.id} className="flex items-center justify-between gap-3">
                          <span className="text-slate-600">{formatDate(payment.paidAt)}</span>
                          <span className="text-xs text-slate-400">{paymentMethodLabel(payment.method)}</span>
                          <span className="font-semibold text-emerald-700">{formatCdf(payment.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {/* --------------------------------------------------- Facturation */}
          <div className="card p-5">
            <h3 className="text-base font-bold text-slate-900">🧾 Créer des factures</h3>
            <p className="mt-1 text-xs text-slate-500">
              Une facture par élève actif de la classe sélectionnée.
            </p>
            <div className="mt-4">
              <ActionForm
                action={addInvoiceAction}
                submitLabel="Générer les factures"
                hiddenFields={{ schoolId: school.id }}
                className="space-y-3"
              >
                                  <>
                    <div>
                      <label className="label" htmlFor="classId">
                        Classe
                      </label>
                      <select id="classId" name="classId" className="input" defaultValue="">
                        <option value="">Toute l’école</option>
                        {classes.map((klass) => (
                          <option key={klass.id} value={klass.id}>
                            {klass.name} ({klass.studentCount} élèves)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="label">
                        Libellé *
                      </label>
                      <input
                        id="label"
                        name="label"
                        required
                        className="input"
                        defaultValue="Frais scolaires — Trimestre 3"
                      />
                      <FieldError name="label" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label" htmlFor="period">
                          Période
                        </label>
                        <select id="period" name="period" className="input" defaultValue="T3">
                          <option value="T1">T1</option>
                          <option value="T2">T2</option>
                          <option value="T3">T3</option>
                        </select>
                      </div>
                      <div>
                        <label className="label" htmlFor="currency">
                          Devise
                        </label>
                        <select id="currency" name="currency" className="input" defaultValue="CDF">
                          <option value="CDF">CDF</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="amount">
                        Montant par élève *
                      </label>
                      <input id="amount" name="amount" type="number" min={1000} step="500" required className="input" defaultValue={140000} />
                      <FieldError name="amount" />
                    </div>
                    <div>
                      <label className="label" htmlFor="dueDate">
                        Échéance *
                      </label>
                      <input
                        id="dueDate"
                        name="dueDate"
                        type="date"
                        required
                        className="input"
                        defaultValue={new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)}
                      />
                      <FieldError name="dueDate" />
                    </div>
                  </>
              </ActionForm>
            </div>
          </div>

          <div className="card bg-slate-50 p-5 text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Rappel des statuts</p>
            <ul className="mt-2 space-y-1">
              {Object.entries(INVOICE_STATUS).map(([key, meta]) => (
                <li key={key}>
                  • <strong>{meta.fr}</strong> —{' '}
                  {key === 'IMPAYE' && 'aucun versement enregistré'}
                  {key === 'PARTIEL' && 'versement incomplet'}
                  {key === 'PAYE' && 'solde soldé'}
                  {key === 'ANNULE' && 'facture annulée par la direction'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
