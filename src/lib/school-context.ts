import 'server-only';
import { redirect } from 'next/navigation';
import { requireUser, type SessionUser } from './auth';
import { getSchoolByOwner, listSchools } from './data/school';
import { ROLES } from './constants';
import type { School } from './types';

/**
 * Détermine l'établissement actif pour l'espace de gestion.
 * Un directeur voit son établissement ; l'administrateur, le premier de la liste.
 */
export async function getActiveSchool(): Promise<{ user: SessionUser; school: School } | null> {
  const user = await requireUser('/ecoles/tableau-de-bord');

  if (user.role === ROLES.ADMIN) {
    const [first] = listSchools();
    return first ? { user, school: first } : null;
  }

  const school = getSchoolByOwner(user.id);
  return school ? { user, school } : null;
}

export async function requireActiveSchool(): Promise<{ user: SessionUser; school: School }> {
  const context = await getActiveSchool();
  if (!context) redirect('/ecoles/inscription');
  return context;
}
