export type SeedProgram = {
  name: string;
  field: string;
  degree: 'LICENCE' | 'MASTER' | 'BTS' | 'CERTIFICAT' | 'DIPLOME_PRO';
  durationMonths: number;
  language?: string;
  tuitionUsd: number;
  requirements: string;
  description: string;
  careers: string[];
  pathwayTags: string[];
  isFeatured?: boolean;
};

export type SeedPartner = {
  name: string;
  slug: string;
  type: 'UNIVERSITY' | 'TRAINING_CENTER' | 'INSTITUTE' | 'HIGH_SCHOOL';
  city: string;
  province: string;
  logoEmoji: string;
  coverColor: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  accreditation: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  foundedYear: number;
  studentsCount: number;
  isFeatured?: boolean;
  programs: SeedProgram[];
};

export const PARTNERS: SeedPartner[] = [
  {
    name: 'Université Nouvelle Vision',
    slug: 'unv-kinshasa',
    type: 'UNIVERSITY',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '🎓',
    coverColor: '#1c60f0',
    description:
      'Université privée agréée par le Ministère de l’Enseignement supérieur et universitaire, l’UNV forme des cadres en sciences commerciales, informatique, droit et communication. Elle co-délivre les certificats SMART-ELIMU de ses filières.',
    website: 'https://unv-kinshasa.cd',
    email: 'partenariat@unv-kinshasa.cd',
    phone: '+243 812 000 101',
    accreditation: 'ESU/MINESU/2019/0471',
    foundedYear: 2004,
    studentsCount: 4200,
    isFeatured: true,
    programs: [
      {
        name: 'Licence en Informatique de gestion',
        field: 'Informatique & Data',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 850,
        requirements: 'Diplôme d’État (section scientifique, commerciale ou technique) — test d’admission en mathématiques et logique.',
        description:
          'Formation de trois ans orientée développement d’applications, bases de données et gestion de projets numériques. Les étudiants réalisent un stage en entreprise au cours de la dernière année.',
        careers: ['Développeur d’applications', 'Administrateur de bases de données', 'Chef de projet numérique', 'Analyste métier'],
        pathwayTags: ['I', 'C'],
        isFeatured: true,
      },
      {
        name: 'Licence en Sciences commerciales et financières',
        field: 'Sciences commerciales',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 780,
        requirements: 'Diplôme d’État toutes sections — entretien de motivation.',
        description:
          'Comptabilité OHADA, fiscalité, marketing, gestion financière et audit. Parcours le plus demandé dans le secteur privé congolais.',
        careers: ['Comptable', 'Auditeur interne', 'Contrôleur de gestion', 'Analyste financier'],
        pathwayTags: ['C', 'E'],
      },
      {
        name: 'Master en gestion des entreprises et entrepreneuriat',
        field: 'Entrepreneuriat',
        degree: 'MASTER',
        durationMonths: 24,
        tuitionUsd: 1450,
        requirements: 'Licence ou graduat en gestion, économie ou domaine connexe — dossier et entretien.',
        description:
          'Master professionnel destiné aux cadres et créateurs d’entreprise. Accompagnement d’un projet réel jusqu’au financement auprès d’un partenaire bancaire.',
        careers: ['Dirigeant de PME', 'Consultant en organisation', 'Responsable développement', 'Entrepreneur'],
        pathwayTags: ['E', 'C'],
        isFeatured: true,
      },
      {
        name: 'Licence en Communication et journalisme',
        field: 'Communication & Médias',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 720,
        requirements: 'Diplôme d’État — épreuve écrite et entretien.',
        description:
          'Rédaction, reportage, production audiovisuelle, communication digitale et déontologie. Salle de montage et studio radio sur le campus.',
        careers: ['Journaliste', 'Chargé de communication', 'Community manager', 'Producteur de contenus'],
        pathwayTags: ['A', 'S'],
      },
    ],
  },
  {
    name: 'Institut Supérieur du Numérique de Kinshasa',
    slug: 'unikin-numerique',
    type: 'INSTITUTE',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '💡',
    coverColor: '#154bdc',
    description:
      'Institut technique spécialisé dans les métiers du numérique : développement logiciel, réseaux, cybersécurité et science des données. Laboratoires équipés et formateurs praticiens.',
    email: 'admission@isn-kin.cd',
    phone: '+243 812 000 102',
    accreditation: 'ESU/MINESU/2016/0233',
    foundedYear: 2011,
    studentsCount: 1650,
    isFeatured: true,
    programs: [
      {
        name: 'BTS Développement d’applications web et mobile',
        field: 'Informatique & Data',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 690,
        requirements: 'Diplôme d’État ou attestation de fin d’études — test de logique et entretien.',
        description:
          'Deux ans intensifs sur JavaScript, Python, bases de données et déploiement d’applications. Projets réels commandés par des entreprises partenaires.',
        careers: ['Développeur web', 'Développeur mobile', 'Intégrateur', 'Technicien support applicatif'],
        pathwayTags: ['I', 'R'],
        isFeatured: true,
      },
      {
        name: 'BTS Cybersécurité et administration réseau',
        field: 'Informatique & Data',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 740,
        requirements: 'Diplôme d’État technique ou scientifique — test d’entrée.',
        description:
          'Sécurité des systèmes d’information, administration de serveurs, gestion des incidents et protection des données personnelles.',
        careers: ['Technicien cybersécurité', 'Administrateur réseau', 'Analyste SOC', 'Responsable sécurité SI'],
        pathwayTags: ['I', 'C'],
      },
      {
        name: 'Certificat professionnel en analyse de données',
        field: 'Statistiques',
        degree: 'CERTIFICAT',
        durationMonths: 6,
        tuitionUsd: 320,
        requirements: 'Bonne maîtrise de l’ordinateur — aucun prérequis statistique.',
        description:
          'Six mois pour maîtriser Excel avancé, SQL, Power BI et la restitution de résultats à des décideurs. Formation du soir, compatible avec un emploi.',
        careers: ['Analyste de données junior', 'Assistant suivi-évaluation', 'Chargé de reporting'],
        pathwayTags: ['C', 'I'],
      },
    ],
  },
  {
    name: 'Institut Supérieur de Technologies Appliquées de Goma',
    slug: 'istag-goma',
    type: 'INSTITUTE',
    city: 'Goma',
    province: 'Nord-Kivu',
    logoEmoji: '🏗️',
    coverColor: '#0f766e',
    description:
      'Institut des métiers techniques du Nord-Kivu : génie civil, électromécanique, énergies renouvelables et gestion de l’environnement en zone volcanique.',
    email: 'info@istag-goma.cd',
    phone: '+243 992 000 103',
    accreditation: 'ESU/MINESU/2014/0187',
    foundedYear: 2009,
    studentsCount: 1380,
    programs: [
      {
        name: 'Licence en Génie civil',
        field: 'Génie civil',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 900,
        requirements: 'Diplôme d’État section scientifique ou technique — bonnes bases en mathématiques et physique.',
        description:
          'Béton armé, topographie, hydraulique, routes et bâtiments. Chantiers-écoles encadrés par des ingénieurs en activité au Nord-Kivu.',
        careers: ['Ingénieur de chantier', 'Topographe', 'Métreur', 'Responsable travaux publics'],
        pathwayTags: ['R', 'I'],
        isFeatured: true,
      },
      {
        name: 'BTS Électromécanique et énergies renouvelables',
        field: 'Mécanique & Électromécanique',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 720,
        requirements: 'Diplôme d’État technique — test pratique.',
        description:
          'Installation et maintenance de systèmes électriques, groupes électrogènes et panneaux solaires, très recherchés dans une région où l’énergie est un défi quotidien.',
        careers: ['Électromécanicien', 'Installateur solaire', 'Technicien de maintenance', 'Chef d’atelier'],
        pathwayTags: ['R', 'C'],
        isFeatured: true,
      },
      {
        name: 'BTS Environnement et gestion des risques naturels',
        field: 'Sciences environnementales',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 640,
        requirements: 'Diplôme d’État — entretien de motivation.',
        description:
          'Gestion des risques volcaniques, inondations, érosion et assainissement urbain. Travaux pratiques sur le terrain à Goma et Sake.',
        careers: ['Technicien environnement', 'Agent de prévention des risques', 'Animateur communautaire', 'Agent d’assainissement'],
        pathwayTags: ['I', 'S'],
      },
    ],
  },
  {
    name: 'Centre de Formation Professionnelle Umoja',
    slug: 'cfp-umoja-lubumbashi',
    type: 'TRAINING_CENTER',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    logoEmoji: '🛠️',
    coverColor: '#db7b02',
    description:
      'Centre agréé par le Ministère de la Formation professionnelle et des Métiers. Ateliers de soudure, mécanique, électricité, couture et froid industriel, plus un incubateur de petites entreprises.',
    email: 'inscription@cfp-umoja.cd',
    phone: '+243 971 000 104',
    accreditation: 'MFPM/AGR/2020/0912',
    foundedYear: 2013,
    studentsCount: 2100,
    programs: [
      {
        name: 'Certificat en soudure et structures métalliques',
        field: 'Métiers techniques',
        degree: 'CERTIFICAT',
        durationMonths: 9,
        tuitionUsd: 420,
        requirements: 'Aucun diplôme exigé, savoir lire et écrire, aptitude physique.',
        description:
          'Soudure à l’arc, MIG, lecture de plans et sécurité au travail. 70 % du temps en atelier et stage garanti chez un industriel de Lubumbashi.',
        careers: ['Soudeur professionnel', 'Chaudronnier', 'Monteur de structures', 'Chef d’atelier métallique'],
        pathwayTags: ['R', 'C'],
        isFeatured: true,
      },
      {
        name: 'Certificat en froid et climatisation',
        field: 'Métiers techniques',
        degree: 'CERTIFICAT',
        durationMonths: 8,
        tuitionUsd: 480,
        requirements: 'Savoir lire et compter, entretien de sélection.',
        description:
          'Installation et dépannage des groupes frigorifiques, chambres froides et climatiseurs. Un métier à forte demande à Lubumbashi et Kolwezi.',
        careers: ['Frigoriste', 'Technicien climatisation', 'Installateur froid commercial', 'Dépanneur à son compte'],
        pathwayTags: ['R'],
      },
      {
        name: 'Certificat en coupe, couture et création de mode',
        field: 'Mode & Textile',
        degree: 'CERTIFICAT',
        durationMonths: 10,
        tuitionUsd: 380,
        requirements: 'Aucun diplôme exigé — motivation et assiduité.',
        description:
          'Patronage, coupe, assemblage, finition et gestion d’un petit atelier de couture. Un accompagnement à la création d’entreprise est inclus.',
        careers: ['Couturier(ère)', 'Styliste-modéliste', 'Gérant d’atelier', 'Retoucheur(se)'],
        pathwayTags: ['A', 'R'],
      },
      {
        name: 'Diplôme professionnel en électromécanique automobile',
        field: 'Mécanique & Électromécanique',
        degree: 'DIPLOME_PRO',
        durationMonths: 18,
        tuitionUsd: 780,
        requirements: 'Diplôme d’État technique ou certificat du centre — test pratique.',
        description:
          'Diagnostic électronique, moteurs diesel et essence, boîtes de vitesses automatiques. Formation conçue avec les concessionnaires automobiles de la région.',
        careers: ['Mécanicien automobile', 'Électricien auto', 'Responsable après-vente', 'Chef d’atelier'],
        pathwayTags: ['R', 'I'],
      },
    ],
  },
  {
    name: 'Université Protestante du Kasaï',
    slug: 'upk-kananga',
    type: 'UNIVERSITY',
    city: 'Kananga',
    province: 'Kasaï-Central',
    logoEmoji: '📚',
    coverColor: '#7c3aed',
    description:
      'Université confessionnelle reconnue, active dans les sciences agronomiques, l’éducation et le développement rural au Kasaï. Ferme pédagogique de 40 hectares.',
    email: 'secretariat@upk-kananga.cd',
    phone: '+243 815 000 105',
    accreditation: 'ESU/MINESU/2008/0102',
    foundedYear: 1998,
    studentsCount: 2400,
    programs: [
      {
        name: 'Licence en Agronomie et développement rural',
        field: 'Agriculture & Agronomie',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 650,
        requirements: 'Diplôme d’État scientifique ou technique agricole.',
        description:
          'Productions végétales et animales, protection des cultures, vulgarisation agricole et gestion des coopératives. Nombreux travaux pratiques à la ferme universitaire.',
        careers: ['Agronome', 'Vulgarisateur agricole', 'Responsable de coopérative', 'Encadreur de projets ruraux'],
        pathwayTags: ['R', 'S'],
      },
      {
        name: 'Licence en Sciences de l’éducation',
        field: 'Sciences de l’éducation',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 590,
        requirements: 'Diplôme d’État — entretien de motivation.',
        description:
          'Pédagogie, psychologie de l’apprentissage, gestion scolaire et encadrement des enseignants. Ouvre la porte à la direction d’établissement.',
        careers: ['Enseignant', 'Directeur d’école', 'Inspecteur pédagogique', 'Conseiller en éducation'],
        pathwayTags: ['S', 'C'],
        isFeatured: true,
      },
      {
        name: 'Certificat en transformation agroalimentaire',
        field: 'Agriculture & Agronomie',
        degree: 'CERTIFICAT',
        durationMonths: 6,
        tuitionUsd: 290,
        requirements: 'Aucun prérequis scolaire — expérience agricole appréciée.',
        description:
          'Transformation du manioc, du maïs et des fruits : farines, chips, jus et conserves. Formation pratique orientée création d’activité génératrice de revenus.',
        careers: ['Transformateur agroalimentaire', 'Gérant d’unité de production', 'Fournisseur de la restauration', 'Entrepreneur rural'],
        pathwayTags: ['R', 'E'],
      },
    ],
  },
  {
    name: 'Institut Supérieur de Commerce de Kinshasa',
    slug: 'isc-kinshasa',
    type: 'INSTITUTE',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '📈',
    coverColor: '#0f766e',
    description:
      'Institut de référence en comptabilité, fiscalité, audit et gestion financière, partenaire de plusieurs cabinets d’audit et banques de la place.',
    email: 'etudes@isc-kin.cd',
    phone: '+243 817 000 106',
    accreditation: 'ESU/MINESU/2012/0154',
    foundedYear: 2007,
    studentsCount: 3100,
    isFeatured: true,
    programs: [
      {
        name: 'Licence en Comptabilité et gestion financière',
        field: 'Comptabilité & Finances',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 760,
        requirements: 'Diplôme d’État section commerciale ou scientifique — test de comptabilité de base.',
        description:
          'SYSCOHADA révisé, fiscalité congolaise, audit, analyse financière. Stages obligatoires en cabinet d’audit et en institution bancaire.',
        careers: ['Comptable d’entreprise', 'Auditeur junior', 'Contrôleur fiscal', 'Assistant financier'],
        pathwayTags: ['C', 'E'],
        isFeatured: true,
      },
      {
        name: 'BTS Fiscalité et douanes',
        field: 'Administration publique',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 700,
        requirements: 'Diplôme d’État — épreuve écrite de culture générale.',
        description:
          'Préparation aux métiers de la DGI et de la DGDA : procédures déclaratives, contrôle fiscal, contentieux et régimes douaniers.',
        careers: ['Agent des impôts', 'Déclarant en douane', 'Assistant fiscal', 'Contrôleur des recettes'],
        pathwayTags: ['C', 'S'],
      },
      {
        name: 'Certificat en gestion de la paie et des ressources humaines',
        field: 'Gestion des entreprises',
        degree: 'CERTIFICAT',
        durationMonths: 4,
        tuitionUsd: 260,
        requirements: 'Niveau de fin d’études secondaires — test de français et calcul.',
        description:
          'Calcul des salaires, cotisations CNSS, obligations déclaratives, contrats de travail et administration du personnel selon le droit du travail congolais.',
        careers: ['Gestionnaire de paie', 'Assistant RH', 'Agent administratif', 'Comptable du personnel'],
        pathwayTags: ['C'],
      },
    ],
  },
  {
    name: 'Centre Technique Agro-Pastoral du Kivu',
    slug: 'ctap-kivu-bukavu',
    type: 'TRAINING_CENTER',
    city: 'Bukavu',
    province: 'Sud-Kivu',
    logoEmoji: '🌱',
    coverColor: '#15803d',
    description:
      'Centre de formation agricole collaborant avec les coopératives du Sud-Kivu et du Nord-Kivu : cultures vivrières, élevage et commercialisation groupée.',
    email: 'formation@ctap-kivu.cd',
    phone: '+243 993 000 107',
    accreditation: 'MFPM/AGR/2018/0645',
    foundedYear: 2010,
    studentsCount: 1450,
    programs: [
      {
        name: 'Certificat en élevage de volailles et porcins',
        field: 'Agriculture & Agronomie',
        degree: 'CERTIFICAT',
        durationMonths: 5,
        tuitionUsd: 240,
        requirements: 'Aucun diplôme exigé — disposer d’un terrain ou d’un projet d’élevage.',
        description:
          'Construction des poulaillers, alimentation, prophylaxie, reproduction et gestion financière d’une petite unité d’élevage rentable.',
        careers: ['Éleveur indépendant', 'Technicien d’élevage', 'Fournisseur de protéines locales', 'Gérant d’une ferme coopérative'],
        pathwayTags: ['R', 'E'],
      },
      {
        name: 'BTS Gestion des coopératives agricoles',
        field: 'Sciences commerciales',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 620,
        requirements: 'Diplôme d’État — entretien et test de calcul.',
        description:
          'Gestion des stocks, comptabilité adaptée aux coopératives, techniques de négociation collective et accès aux marchés formels.',
        careers: ['Gestionnaire de coopérative', 'Agent de développement rural', 'Responsable achat-vente', 'Encadreur de groupements'],
        pathwayTags: ['E', 'C'],
      },
    ],
  },
  {
    name: 'École Supérieure des Sciences de la Santé',
    slug: 'esak-sp-kinshasa',
    type: 'INSTITUTE',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '🩺',
    coverColor: '#be123c',
    description:
      'Institut de formation des professionnels de santé : soins infirmiers, santé publique, techniques de laboratoire et gestion des structures sanitaires.',
    email: 'admission@esak-sp.cd',
    phone: '+243 818 000 108',
    accreditation: 'ESU/MINESU/2015/0209',
    foundedYear: 2005,
    studentsCount: 1900,
    isFeatured: true,
    programs: [
      {
        name: 'Licence en Sciences infirmières',
        field: 'Médecine & Santé',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 880,
        requirements: 'Diplôme d’État en soins infirmiers ou sciences — concours d’entrée.',
        description:
          'Soins infirmiers avancés, santé publique, éthique médicale et encadrement des équipes. Stages hospitaliers tout au long du cursus.',
        careers: ['Infirmier diplômé d’État', 'Infirmier en chef', 'Superviseur de soins', 'Formateur en école de santé'],
        pathwayTags: ['S', 'I'],
        isFeatured: true,
      },
      {
        name: 'BTS Santé communautaire et épidémiologie',
        field: 'Santé communautaire',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 720,
        requirements: 'Diplôme d’État — test de biologie et entretien.',
        description:
          'Surveillance épidémiologique, vaccination, sensibilisation communautaire et réponse aux épidémies (choléra, rougeole, mpox).',
        careers: ['Agent de santé communautaire', 'Épidémiologiste de terrain', 'Superviseur d’ONG', 'Coordinateur de projets santé'],
        pathwayTags: ['S', 'I'],
      },
    ],
  },
  {
    name: 'Institut Supérieur Pédagogique de Bandundu',
    slug: 'isp-bandundu',
    type: 'INSTITUTE',
    city: 'Bandundu',
    province: 'Kwilu',
    logoEmoji: '👩🏾‍🏫',
    coverColor: '#1c60f0',
    description:
      'Institut pédagogique formant les enseignants du primaire et du secondaire du grand Bandundu, avec une école d’application de 600 élèves.',
    email: 'scolarite@isp-bandundu.cd',
    phone: '+243 819 000 109',
    accreditation: 'ESU/MINESU/2010/0121',
    foundedYear: 2000,
    studentsCount: 2700,
    programs: [
      {
        name: 'Licence en Pédagogie appliquée — Mathématiques',
        field: 'Sciences de l’éducation',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 560,
        requirements: 'Diplôme d’État scientifique — test disciplinaire.',
        description:
          'Didactique des mathématiques, évaluation des apprentissages et gestion de classe. Un semestre entier en école d’application.',
        careers: ['Professeur de mathématiques', 'Préfet des études', 'Formateur d’enseignants', 'Inspecteur'],
        pathwayTags: ['S', 'I'],
      },
      {
        name: 'Graduat en Didactique des langues',
        field: 'Langues & Communication',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 520,
        requirements: 'Diplôme d’État — bon niveau de français (test écrit).',
        description:
          'Enseignement du français, du lingala et du swahili, techniques d’animation et alphabétisation des adultes.',
        careers: ['Enseignant de langues', 'Alphabétiseur', 'Formateur en ONG', 'Concepteur de supports pédagogiques'],
        pathwayTags: ['S', 'A'],
      },
    ],
  },
  {
    name: 'Université Catholique du Kongo-Central',
    slug: 'ucc-mbuji-mayi',
    type: 'UNIVERSITY',
    city: 'Matadi',
    province: 'Kongo-Central',
    logoEmoji: '🏛️',
    coverColor: '#0d2a6b',
    description:
      'Université reconnue dans les sciences juridiques, économiques et de gestion, fortement liée au secteur portuaire et logistique du Kongo-Central.',
    email: 'recteur@uckc-matadi.cd',
    phone: '+243 993 000 110',
    accreditation: 'ESU/MINESU/2006/0074',
    foundedYear: 1996,
    studentsCount: 2200,
    programs: [
      {
        name: 'Licence en Droit économique et social',
        field: 'Droit & Justice',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 820,
        requirements: 'Diplôme d’État — concours d’entrée en culture générale et français.',
        description:
          'Droit des affaires OHADA, droit du travail congolais, droit maritime et contentieux. Clinique juridique pour les petites entreprises locales.',
        careers: ['Juriste d’entreprise', 'Avocat stagiaire', 'Agent juridique', 'Conseiller en droit du travail'],
        pathwayTags: ['S', 'C'],
      },
      {
        name: 'Licence en Logistique et transport',
        field: 'Logistique & Transport',
        degree: 'LICENCE',
        durationMonths: 36,
        tuitionUsd: 860,
        requirements: 'Diplôme d’État — test de mathématiques et entretien.',
        description:
          'Gestion des entrepôts, transit, transport multimodal et douane, en partenariat avec les opérateurs du port de Matadi.',
        careers: ['Gestionnaire d’entrepôt', 'Déclarant en douane', 'Transitaire', 'Responsable logistique'],
        pathwayTags: ['C', 'R'],
        isFeatured: true,
      },
    ],
  },
  {
    name: 'Académie des Mines et de Géologie du Haut-Katanga',
    slug: 'amg-haut-katanga',
    type: 'INSTITUTE',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    logoEmoji: '⛏️',
    coverColor: '#7a350d',
    description:
      'Institut spécialisé dans les métiers de la mine : exploitation, géologie, minéralurgie, sécurité et environnement minier. Partenariats avec les opérateurs industriels et artisanaux.',
    email: 'admission@amg-hk.cd',
    phone: '+243 972 000 111',
    accreditation: 'ESU/MINESU/2013/0166',
    foundedYear: 2008,
    studentsCount: 1500,
    isFeatured: true,
    programs: [
      {
        name: 'BTS Exploitation minière et sécurité',
        field: 'Mines & Géologie',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 950,
        requirements: 'Diplôme d’État technique ou scientifique — aptitude physique et médicale.',
        description:
          'Méthodes d’exploitation, ventilation, soutènement, prévention des risques et premiers secours. Contenus alignés sur les standards internationaux du secteur.',
        careers: ['Chef d’équipe mine', 'Agent HSE', 'Technicien d’exploitation', 'Surveillant de chantier minier'],
        pathwayTags: ['R', 'I'],
        isFeatured: true,
      },
      {
        name: 'Certificat Sécurité et santé au travail (HSE)',
        field: 'Mines & Géologie',
        degree: 'CERTIFICAT',
        durationMonths: 4,
        tuitionUsd: 340,
        requirements: 'Travailler ou avoir travaillé sur un site industriel — entretien.',
        description:
          'Analyse de risque, permis de travail, travail en hauteur, espaces confinés, gestion des urgences et animation de la culture sécurité.',
        careers: ['Agent HSE', 'Préventeur des risques', 'Chef de poste sécurité', 'Formateur sécurité'],
        pathwayTags: ['R', 'C'],
      },
      {
        name: 'BTS Géologie appliquée et prospection',
        field: 'Mines & Géologie',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 900,
        requirements: 'Diplôme d’État scientifique — test de sciences.',
        description:
          'Cartographie, échantillonnage, lecture de sondages et logiciels de modélisation géologique. Sorties de terrain dans le Lualaba et le Haut-Katanga.',
        careers: ['Technicien géologue', 'Assistant de prospection', 'Technicien laboratoire minéralurgique', 'Opérateur SIG minier'],
        pathwayTags: ['I', 'R'],
      },
    ],
  },
  {
    name: 'Institut des Arts et Médias de Kinshasa',
    slug: 'iam-kinshasa',
    type: 'INSTITUTE',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '🎨',
    coverColor: '#db2777',
    description:
      'École des métiers créatifs : design graphique, audiovisuel, musique et mode. Studio photo, salle de tournage et atelier de sérigraphie.',
    email: 'contact@iam-kinshasa.cd',
    phone: '+243 815 000 112',
    accreditation: 'ESU/MINESU/2017/0288',
    foundedYear: 2012,
    studentsCount: 1150,
    programs: [
      {
        name: 'BTS Design graphique et communication visuelle',
        field: 'Arts visuels & Design',
        degree: 'BTS',
        durationMonths: 24,
        tuitionUsd: 670,
        requirements: 'Diplôme d’État — portfolio ou test de dessin.',
        description:
          'Identité visuelle, édition, packaging et design numérique. Les étudiants réalisent des commandes réelles pour des PME et des artistes congolais.',
        careers: ['Designer graphique', 'Directeur artistique junior', 'Maquettiste', 'Infographiste'],
        pathwayTags: ['A', 'I'],
        isFeatured: true,
      },
      {
        name: 'Certificat Réalisation audiovisuelle et réseaux sociaux',
        field: 'Communication & Médias',
        degree: 'CERTIFICAT',
        durationMonths: 6,
        tuitionUsd: 310,
        requirements: 'Aucun diplôme exigé — motivation et projet créatif.',
        description:
          'Écriture de scénario, tournage au smartphone, montage, son et diffusion sur les réseaux sociaux. Formation du soir et week-end.',
        careers: ['Vidéaste indépendant', 'Monteur', 'Créateur de contenus', 'Assistant de production'],
        pathwayTags: ['A', 'E'],
      },
    ],
  },
  {
    name: 'Centre de Formation Technique de l’Équateur',
    slug: 'cft-mbandaka',
    type: 'TRAINING_CENTER',
    city: 'Mbandaka',
    province: 'Équateur',
    logoEmoji: '🪚',
    coverColor: '#15803d',
    description:
      'Centre de formation aux métiers du bois, de la construction et de la navigation fluviale, implanté au bord du fleuve Congo à Mbandaka.',
    email: 'formation@cft-mbandaka.cd',
    phone: '+243 994 000 113',
    accreditation: 'MFPM/AGR/2019/0777',
    foundedYear: 2015,
    studentsCount: 780,
    programs: [
      {
        name: 'Certificat Menuiserie et charpente',
        field: 'Métiers techniques',
        degree: 'CERTIFICAT',
        durationMonths: 9,
        tuitionUsd: 350,
        requirements: 'Savoir lire et compter — test d’aptitude manuelle.',
        description:
          'Lecture de plans, travail du bois local, fabrication de meubles et charpentes, finition et gestion d’un petit atelier.',
        careers: ['Menuisier', 'Charpentier', 'Ébéniste', 'Gérant d’atelier de menuiserie'],
        pathwayTags: ['R'],
      },
      {
        name: 'Certificat Navigation fluviale et sécurité',
        field: 'Logistique & Transport',
        degree: 'CERTIFICAT',
        durationMonths: 6,
        tuitionUsd: 300,
        requirements: 'Savoir nager, aptitude médicale, test de lecture.',
        description:
          'Conduite d’embarcations, navigation sur le fleuve, chargement sécurisé, météorologie et sauvetage. Le transport fluvial structure l’économie équatorienne.',
        careers: ['Marin fluvial', 'Capitaine de baleinière', 'Agent de manutention fluviale', 'Contrôleur de cargaison'],
        pathwayTags: ['R', 'S'],
      },
    ],
  },
  {
    name: 'Complexe Scolaire La Grâce',
    slug: 'cs-la-grace-kinshasa',
    type: 'HIGH_SCHOOL',
    city: 'Kinshasa',
    province: 'Kinshasa',
    logoEmoji: '🏫',
    coverColor: '#f7a207',
    description:
      'Établissement secondaire de Kinshasa utilisant SMART-ELIMU School pour la gestion de ses 900 élèves, et SMART-ELIMU Academy pour former ses enseignants.',
    email: 'direction@cs-lagrace.cd',
    phone: '+243 816 000 114',
    accreditation: 'EPST/KIN/2021/1188',
    foundedYear: 2003,
    studentsCount: 900,
    programs: [
      {
        name: 'Baccalauréat congolais — Section scientifique',
        field: 'Sciences fondamentales',
        degree: 'LICENCE',
        durationMonths: 48,
        tuitionUsd: 420,
        requirements: 'Réussite au test d’entrée et bulletin de la classe précédente.',
        description:
          'Cycle secondaire complet en section scientifique, sanctionné par le Diplôme d’État (EXETAT). Établissement équipé d’un laboratoire et d’une salle informatique.',
        careers: ['Poursuite d’études supérieures en sciences', 'Technicien de laboratoire', 'Instructeur informatique'],
        pathwayTags: ['I', 'C'],
      },
    ],
  },
  {
    name: 'Institut Médical Sainte-Croix de Kisangani',
    slug: 'imsc-kisangani',
    type: 'INSTITUTE',
    city: 'Kisangani',
    province: 'Tshopo',
    logoEmoji: '🏥',
    coverColor: '#0891b2',
    description:
      'Institut médical en cours d’agrément, porté par une congrégation hospitalière de la Tshopo. Candidature de partenariat en cours d’examen par l’équipe SMART-ELIMU.',
    email: 'secretariat@imsc-kisangani.cd',
    phone: '+243 995 000 115',
    accreditation: 'Dossier en cours',
    status: 'PENDING',
    foundedYear: 2018,
    studentsCount: 420,
    programs: [],
  },
];

export type SeedScholarship = {
  partnerSlug?: string;
  title: string;
  organization: string;
  level: 'SECONDAIRE' | 'LICENCE' | 'MASTER' | 'FORMATION_PRO';
  amountUsd: number;
  daysFromNow: number;
  description: string;
  eligibility: string;
  url?: string;
};

export const SCHOLARSHIPS: SeedScholarship[] = [
  {
    partnerSlug: 'unv-kinshasa',
    title: 'Bourse d’excellence UNV — 10 places en informatique',
    organization: 'Université Nouvelle Vision',
    level: 'LICENCE',
    amountUsd: 850,
    daysFromNow: 21,
    description:
      'Prise en charge complète des frais académiques de la première année de licence en informatique de gestion, renouvelable chaque année si la moyenne dépasse 70 %.',
    eligibility:
      'Diplôme d’État avec au moins 70 % de moyenne, dossier scolaire, lettre de motivation manuscrite, test d’admission réussi.',
    url: 'https://unv-kinshasa.cd/bourses',
  },
  {
    partnerSlug: 'amg-haut-katanga',
    title: 'Bourse Mines & Communautés — Haut-Katanga',
    organization: 'Académie des Mines et de Géologie',
    level: 'FORMATION_PRO',
    amountUsd: 950,
    daysFromNow: 35,
    description:
      'Bourse couvrant le BTS Exploitation minière et sécurité pour des jeunes issus des communautés riveraines des sites miniers.',
    eligibility:
      'Être originaire d’une commune minière du Haut-Katanga ou du Lualaba, diplôme d’État technique, aptitude médicale.',
  },
  {
    title: 'Fonds national d’appui à la formation professionnelle des jeunes',
    organization: 'Ministère de la Formation professionnelle (guichet partenaires)',
    level: 'FORMATION_PRO',
    amountUsd: 500,
    daysFromNow: 14,
    description:
      'Appui financier pour suivre une formation certifiante courte (menuiserie, froid, couture, agroalimentaire) dans un centre agréé.',
    eligibility: 'Jeunes de 18 à 30 ans, non scolarisés ou en reconversion, résidant en RDC.',
  },
  {
    partnerSlug: 'esak-sp-kinshasa',
    title: 'Bourse Santé pour tous — Sciences infirmières',
    organization: 'École Supérieure des Sciences de la Santé',
    level: 'LICENCE',
    amountUsd: 880,
    daysFromNow: 48,
    description:
      'Huit bourses complètes pour la licence en sciences infirmières, priorité aux candidates femmes issues de zones rurales.',
    eligibility: 'Diplôme d’État en soins infirmiers, concours d’entrée réussi, engagement à exercer deux ans en zone rurale.',
  },
  {
    partnerSlug: 'cfp-umoja-lubumbashi',
    title: 'Bourse Métiers techniques pour jeunes filles',
    organization: 'Centre de Formation Professionnelle Umoja',
    level: 'FORMATION_PRO',
    amountUsd: 420,
    daysFromNow: 27,
    description:
      'Formation gratuite en soudure, électricité ou froid industriel pour encourager la présence des femmes dans les métiers techniques.',
    eligibility: 'Jeunes filles de 17 à 25 ans, savoir lire et écrire, motivation démontrée.',
  },
  {
    title: 'Programme Diaspora — Aide au retour d’études',
    organization: 'Fondation Umoja pour l’éducation',
    level: 'MASTER',
    amountUsd: 2000,
    daysFromNow: 60,
    description:
      'Co-financement d’un master en RDC ou en Afrique de l’Est pour des professionnels souhaitant se spécialiser puis revenir enseigner.',
    eligibility: 'Licence obtenue, deux ans d’expérience professionnelle, projet de transmission de compétences.',
  },
  {
    partnerSlug: 'upk-kananga',
    title: 'Bourse Agronomie — Ferme-école du Kasaï',
    organization: 'Université Protestante du Kasaï',
    level: 'LICENCE',
    amountUsd: 650,
    daysFromNow: 75,
    description:
      'Prise en charge des frais académiques en agronomie, avec hébergement à la ferme-école et encadrement pratique.',
    eligibility: 'Diplôme d’État agricole ou scientifique, être originaire du grand Kasaï, dossier complet.',
  },
  {
    partnerSlug: 'iam-kinshasa',
    title: 'Bourse Création numérique — Arts et médias',
    organization: 'Institut des Arts et Médias de Kinshasa',
    level: 'FORMATION_PRO',
    amountUsd: 310,
    daysFromNow: 10,
    description:
      'Formation gratuite en réalisation audiovisuelle et réseaux sociaux pour dix créateurs de contenus congolais.',
    eligibility: 'Avoir un projet de contenu (chaîne, page, portfolio) et être disponible pour la formation du soir.',
  },
];
