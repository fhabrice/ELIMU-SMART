import Link from 'next/link';
import { PageHeader } from '@/components/ui';
import { OrientationRunner } from '@/components/orientation-runner';
import { getCurrentUser } from '@/lib/auth';
import { getTranslator } from '@/lib/locale';

export const metadata = { title: 'Test d’orientation' };

export default async function OrientationTestPage() {
  const { t } = await getTranslator();
  const user = await getCurrentUser();

  return (
    <div>
      <PageHeader eyebrow="Pathways" title="Test d’orientation SMART-ELIMU" description={t('orientation.subtitle')}>
        <p className="text-sm text-slate-500">
          Répondez spontanément : il n’y a ni bonne ni mauvaise réponse. Votre rapport est généré immédiatement à la
          fin du questionnaire.{' '}
          <Link href="/orientation" className="text-elimu-700 underline">
            En savoir plus
          </Link>
        </p>
      </PageHeader>

      <div className="container-page max-w-4xl py-10">
        <OrientationRunner
          defaultName={user?.name ?? ''}
          defaultEmail={user?.email ?? ''}
          defaultProvince={user?.province ?? 'Kinshasa'}
        />
      </div>
    </div>
  );
}
