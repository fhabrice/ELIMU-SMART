import Link from 'next/link';

export const metadata = { title: 'Page introuvable' };

export default function NotFound() {
  const links = [
    { href: '/formations', label: 'Formations certifiantes', emoji: '🎓' },
    { href: '/orientation', label: 'Orientation scolaire', emoji: '🧭' },
    { href: '/ecoles', label: 'Gestion d’établissement', emoji: '🏫' },
    { href: '/bourses', label: 'Bourses d’études', emoji: '💸' },
    { href: '/partenaires', label: 'Universités & centres partenaires', emoji: '🤝' },
    { href: '/certificats', label: 'Vérifier un certificat', emoji: '🔍' },
  ];

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-6xl font-black text-elimu-200">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        Cette page n’existe pas ou a été déplacée
      </h1>
      <p className="mt-3 max-w-xl text-sm text-slate-600">
        Vérifiez l’adresse saisie ou reprenez la navigation depuis l’un des espaces ci-dessous. Si vous cherchez un
        certificat, utilisez son code (par exemple <span className="font-mono">SE-2026-XXXX-XXXX</span>) sur la page de
        vérification.
      </p>

      <div className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="card card-hover flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-slate-800"
          >
            <span className="text-xl">{link.emoji}</span>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          ⌂ Retour à l’accueil
        </Link>
        <Link href="/connexion" className="btn-outline">
          Se connecter
        </Link>
      </div>
    </div>
  );
}
