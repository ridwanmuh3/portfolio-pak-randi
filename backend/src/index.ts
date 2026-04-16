import type { Core } from '@strapi/strapi';

// ---------------------------------------------------------------------------
// Public-read API content types — intentionally public (read-only).
// Write operations remain admin-only.
// ---------------------------------------------------------------------------
const PUBLIC_CONTENT_TYPES = [
  'api::publication.publication',
  'api::research-project.research-project',
  'api::collaborator.collaborator',
  'api::funding.funding',
  'api::showcase-project.showcase-project',
  'api::experience.experience',
  'api::education.education',
  'api::skill-group.skill-group',
  'api::award.award',
  'api::current-course.current-course',
  'api::past-course.past-course',
  'api::supervision.supervision',
  'api::journal-review.journal-review',
  'api::conference-committee.conference-committee',
  'api::talk.talk',
  'api::membership.membership',
  'api::site-config.site-config',
  'api::home-config.home-config',
] as const;

// ---------------------------------------------------------------------------
// Grant public role find / findOne on every portfolio content type
// ---------------------------------------------------------------------------
async function setupPublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('[bootstrap] Public role not found — skipping permission setup');
    return;
  }

  const actionsToGrant: string[] = [];
  for (const ct of PUBLIC_CONTENT_TYPES) {
    actionsToGrant.push(`${ct}.find`);
    actionsToGrant.push(`${ct}.findOne`);
  }

  for (const action of actionsToGrant) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: { id: publicRole.id } } });

    if (existing) {
      if (!existing.enabled) {
        await strapi.db
          .query('plugin::users-permissions.permission')
          .update({ where: { id: existing.id }, data: { enabled: true } });
      }
    } else {
      await strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id, enabled: true } });
    }
  }

  strapi.log.info('[bootstrap] Public read permissions configured');
}

// ---------------------------------------------------------------------------
// Helpers — typed shorthand for the Document Service
// ---------------------------------------------------------------------------
type UID = (typeof PUBLIC_CONTENT_TYPES)[number];

/** Create a published collection-type entry via the Document Service. */
async function createPublished(strapi: Core.Strapi, uid: UID, data: Record<string, unknown>) {
  await strapi.documents(uid).create({ data, status: 'published' });
}

/** Create a single-type entry via the Document Service (always published when draftAndPublish is off). */
async function createSingle(strapi: Core.Strapi, uid: UID, data: Record<string, unknown>) {
  await strapi.documents(uid).create({ data });
}

// ---------------------------------------------------------------------------
// Seed initial content — runs only once (when no published data exists)
// ---------------------------------------------------------------------------
async function seedDatabase(strapi: Core.Strapi) {
  // Use the Document Service count to check for *properly published* data.
  // Entries created via the old db.query() lack a documentId and are invisible
  // to the REST API, so this check correctly detects an un-seeded or broken DB.
  const pubCount = await strapi.documents('api::publication.publication').count({
    status: 'published',
  });
  if (pubCount > 0) {
    strapi.log.info('[seed] Database already contains published data — skipping seed');
    return;
  }

  strapi.log.info('[seed] Seeding database with initial portfolio data…');

  // ----- Site Config (single type, draftAndPublish: false) ------------------
  const existingSite = await strapi.documents('api::site-config.site-config').findFirst();
  if (!existingSite) {
    await createSingle(strapi, 'api::site-config.site-config', {
      name: 'Dr. John Doe',
      shortName: 'John Doe',
      title: 'Assistant Professor',
      institution: 'Siliwangi University',
      department: 'Department of Informatics',
      location: 'Tasikmalaya, West Java, Indonesia',
      email: 'john.doe@unsil.ac.id',
      phone: '+62 265 330634',
      bio: 'Researcher and educator focused on AI for cybersecurity, machine learning, and digital forensics.',
      linkedinUrl: 'https://www.linkedin.com/',
      scholarUrl: 'https://scholar.google.com/',
      githubUrl: 'https://github.com/',
      orcidUrl: 'https://orcid.org/',
      researchGateUrl: 'https://www.researchgate.net/',
      cvUrl: '#',
    });
  }

  // ----- Home Config (single type, draftAndPublish: false) ------------------
  const existingHome = await strapi.documents('api::home-config.home-config').findFirst();
  if (!existingHome) {
    await createSingle(strapi, 'api::home-config.home-config', {
      welcomeHeading: 'Welcome',
      welcomeParagraphs: [
        'I am an Assistant Professor at the Department of Informatics, Siliwangi University, Tasikmalaya, Indonesia. My research focuses on the intersection of artificial intelligence and cybersecurity, with particular interest in intrusion detection, digital forensics, and the security of machine learning systems.',
        'Before joining Siliwangi University, I completed my doctoral studies in Computer Science, where I worked on hierarchical intrusion detection systems and adversarial robustness of deep learning models. I am passionate about building secure, trustworthy, and efficient intelligent systems that can be deployed in real-world environments.',
      ],
      recruitmentHeading: 'Student Recruitment',
      recruitmentBody:
        'I am actively looking for motivated undergraduate and graduate students to join my research group. If you are interested in AI, cybersecurity, machine learning, or digital forensics and want to pursue a thesis or research project in these areas, feel free to reach out via email with your CV and a brief statement of interest.',
      recruitmentTags: ['AI & Cybersecurity', 'Machine Learning', 'Digital Forensics', 'Network Security'],
      researchInterests: [
        { title: 'AI for Cybersecurity', icon: 'ShieldCheck', description: 'Applying machine learning and deep learning techniques to intrusion detection, malware analysis, and threat intelligence to build adaptive defense systems.' },
        { title: 'Cybersecurity for AI', icon: 'Cpu', description: 'Investigating adversarial attacks, model poisoning, and privacy risks in AI systems, and designing robust defenses for safe deployment.' },
        { title: 'Digital Forensics', icon: 'Fingerprint', description: 'Developing tools and methodologies for evidence acquisition, analysis, and validation across mobile, cloud, and IoT environments.' },
        { title: 'Network Security', icon: 'Network', description: 'Exploring efficient anomaly detection, encrypted traffic analysis, and optimization of secure network protocols for modern infrastructures.' },
      ],
      highlights: [
        { label: 'Publications', value: '24+' },
        { label: 'Citations', value: '380+' },
        { label: 'Projects', value: '12' },
        { label: 'Years Teaching', value: '8' },
      ],
    });
  }

  // ----- Publications -------------------------------------------------------
  const publications = [
    { type: 'Journal', title: 'Hierarchical Deep Learning for Imbalanced Network Intrusion Detection: A Multi-stage Approach', authors: 'J. Doe*, J. Smith, M. Chen', venue: 'IEEE Transactions on Information Forensics and Security', year: 2025, corresponding: true, doi: '10.1109/TIFS.2025.0000001', order: 1 },
    { type: 'Journal', title: 'Certified Robustness of Packet Classifiers via Randomized Smoothing', authors: 'J. Doe, M. Chen*, D. Lee', venue: 'ACM Transactions on Privacy and Security', year: 2025, doi: '10.1145/3000000.0000002', order: 2 },
    { type: 'Journal', title: 'Federated Anomaly Detection for IoT Gateways under Non-IID Traffic', authors: 'J. Doe*, S. Rahmawati', venue: 'Computers & Security', year: 2024, corresponding: true, doi: '10.1016/j.cose.2024.000003', order: 3 },
    { type: 'Journal', title: 'An Explainable Malware Family Classifier Using Graph Neural Networks', authors: 'J. Doe, A. Pratama*, R. Kurniawan', venue: 'Expert Systems with Applications', year: 2024, doi: '10.1016/j.eswa.2024.000004', order: 4 },
    { type: 'Journal', title: 'Lightweight Deep Learning for Encrypted Traffic Classification on Edge Devices', authors: 'J. Doe*, M. Chen', venue: 'Journal of Network and Computer Applications', year: 2023, corresponding: true, order: 5 },
    { type: 'Journal', title: 'Towards Privacy-preserving Smart Campus Analytics: A Federated Learning Perspective', authors: 'S. Rahmawati*, J. Doe', venue: 'IEEE Internet of Things Journal', year: 2023, order: 6 },
    { type: 'Conference', title: 'Multi-stage Contrastive Pre-training for Network Intrusion Detection', authors: 'J. Doe*, J. Smith', venue: 'Proceedings of ACM CCS', year: 2024, corresponding: true, order: 7 },
    { type: 'Conference', title: 'Evasion Attacks on Deep Packet Inspection: A Study of Transferability', authors: 'J. Doe, D. Lee*', venue: 'Proceedings of USENIX Security', year: 2024, order: 8 },
    { type: 'Conference', title: 'ForensicKit: An Open Toolkit for Mobile Evidence Acquisition', authors: 'J. Doe*, A. Pratama', venue: 'Proceedings of IFIP WG 11.9 Digital Forensics', year: 2023, corresponding: true, order: 9 },
    { type: 'Conference', title: 'Graph-based Detection of Obfuscated Android Malware', authors: 'A. Pratama*, J. Doe', venue: 'Proceedings of ACSAC', year: 2022, order: 10 },
    { type: 'Book Chapter', title: 'Securing Industrial Control Systems with Adaptive Machine Learning', authors: 'J. Doe*, R. Kurniawan', venue: 'Handbook of Cyber-Physical Systems Security, Springer', year: 2024, corresponding: true, order: 11 },
    { type: 'Book Chapter', title: 'Digital Forensics in the Cloud Era: Tools and Challenges', authors: 'J. Doe', venue: 'Advances in Digital Forensics, Springer', year: 2022, order: 12 },
  ];
  for (const d of publications) {
    await createPublished(strapi, 'api::publication.publication', d);
  }

  // ----- Research Projects --------------------------------------------------
  const researchProjects = [
    { title: 'A Novel Multi-stage Hierarchical Intrusion Detection System', status: 'Ongoing', period: '2024 – 2026', description: 'Designing a multi-stage pipeline that combines coarse-grained anomaly detection with fine-grained classification to handle highly imbalanced attack categories in modern network traffic.', tags: ['Intrusion Detection', 'Deep Learning', 'Imbalanced Learning'], order: 1 },
    { title: 'Adversarial Robustness of Deep Packet Inspection Models', status: 'Ongoing', period: '2024 – 2025', description: 'Investigating perturbation-based evasion attacks on deep-learning-based packet classifiers and proposing certified defenses using randomized smoothing.', tags: ['Adversarial ML', 'Network Security', 'Robustness'], order: 2 },
    { title: 'Federated Learning for IoT Threat Intelligence', status: 'Completed', period: '2022 – 2023', description: 'Developed a privacy-preserving federated learning framework for collaborative threat intelligence across heterogeneous IoT gateways without sharing raw traffic.', tags: ['Federated Learning', 'IoT', 'Privacy'], order: 3 },
    { title: 'Explainable Malware Family Classification', status: 'Completed', period: '2021 – 2022', description: 'Built an explainable malware classifier using graph neural networks over API-call graphs with attention-based attribution for analyst support.', tags: ['Malware', 'XAI', 'Graph Neural Networks'], order: 4 },
  ];
  for (const d of researchProjects) {
    await createPublished(strapi, 'api::research-project.research-project', d);
  }

  // ----- Collaborators ------------------------------------------------------
  const collaborators = [
    { name: 'Prof. Jane Smith', affiliation: 'Institut Teknologi Bandung', order: 1 },
    { name: 'Dr. Michael Chen', affiliation: 'National Cheng Kung University', order: 2 },
    { name: 'Dr. Siti Rahmawati', affiliation: 'Universitas Gadjah Mada', order: 3 },
    { name: 'Prof. David Lee', affiliation: 'Nanyang Technological University', order: 4 },
  ];
  for (const d of collaborators) {
    await createPublished(strapi, 'api::collaborator.collaborator', d);
  }

  // ----- Fundings -----------------------------------------------------------
  const fundings = [
    { title: 'Adaptive Intrusion Detection for Industrial Control Systems', agency: 'Ministry of Research and Technology (Kemristek)', amount: 'IDR 450,000,000', period: '2025 – 2027', role: 'Principal Investigator', description: 'A multi-year grant to build adaptive intrusion detection models tailored for the operational constraints of Indonesian ICS/SCADA infrastructures.', order: 1 },
    { title: 'Privacy-Preserving Federated Learning for Smart Campus', agency: 'DRTPM – Ministry of Education', amount: 'IDR 200,000,000', period: '2025 – 2026', role: 'Principal Investigator', description: 'Developing a privacy-preserving federated learning platform for smart campus services including attendance, anomaly detection, and energy analytics.', order: 2 },
    { title: 'AI-driven Digital Forensics Toolkit', agency: 'Siliwangi University Internal Grant', amount: 'IDR 75,000,000', period: '2024', role: 'Principal Investigator', description: 'Building an open-source toolkit to assist local law enforcement with mobile evidence acquisition and timeline reconstruction.', order: 3 },
    { title: 'Collaborative Research on IoT Security', agency: 'ASEAN Research Collaboration Grant', amount: 'USD 30,000', period: '2023 – 2024', role: 'Co-Investigator', description: 'Joint project with regional partners investigating lightweight authentication and secure firmware update mechanisms for constrained devices.', order: 4 },
  ];
  for (const d of fundings) {
    await createPublished(strapi, 'api::funding.funding', d);
  }

  // ----- Showcase Projects --------------------------------------------------
  const showcaseProjects = [
    { title: 'ForensicKit', type: 'Open Source', description: 'A modular toolkit for mobile and cloud evidence acquisition, written in Go with a Nuxt-based web dashboard.', tech: ['Go', 'Nuxt', 'SQLite'], link: '#', order: 1 },
    { title: 'SmartIDS', type: 'Research Prototype', description: 'A hierarchical intrusion detection prototype combining flow-level and packet-level features with contrastive pre-training.', tech: ['Python', 'PyTorch', 'Scapy'], link: '#', order: 2 },
    { title: 'SecureQR', type: 'Industry Collaboration', description: 'End-to-end secure QR code system with signing and verification APIs for ticketing and authentication use cases.', tech: ['Go', 'Nuxt', 'Ed25519'], link: '#', order: 3 },
  ];
  for (const d of showcaseProjects) {
    await createPublished(strapi, 'api::showcase-project.showcase-project', d);
  }

  // ----- Experiences --------------------------------------------------------
  const experiences = [
    { role: 'Visiting Researcher', organization: 'Korea Advanced Institute of Science and Technology (KAIST)', location: 'Daejeon, South Korea', period: 'Jan 2026 – Present', description: 'Short-term visiting position collaborating with the Cyber Security Research Center on LLM-assisted vulnerability discovery for embedded firmware images.', order: 1 },
    { role: 'Assistant Professor', organization: 'Siliwangi University', location: 'Tasikmalaya, Indonesia', period: '2024 – Present', description: 'Teaching undergraduate and graduate courses in AI, cybersecurity, and digital forensics. Leading the Secure AI Research Group (SAIRG) and supervising 12 thesis students.', order: 2 },
    { role: 'Postdoctoral Researcher', organization: 'National Cheng Kung University', location: 'Tainan, Taiwan', period: '2023 – 2024', description: 'Worked on adversarial robustness of intrusion detection models and privacy-preserving federated learning for IoT security. Co-authored 4 publications.', order: 3 },
    { role: 'Lecturer', organization: 'Siliwangi University', location: 'Tasikmalaya, Indonesia', period: '2018 – 2019', description: 'Taught courses on computer networks, operating systems, and information security. Coordinated the undergraduate capstone project.', order: 4 },
    { role: 'Security Engineer (Part-time)', organization: 'PT Data Aman Nusantara', location: 'Jakarta, Indonesia', period: '2016 – 2018', description: 'Implemented SIEM rules, performed vulnerability assessments and contributed to incident response playbooks for enterprise clients.', order: 5 },
  ];
  for (const d of experiences) {
    await createPublished(strapi, 'api::experience.experience', d);
  }

  // ----- Education ----------------------------------------------------------
  const education = [
    { degree: 'Ph.D. in Computer Science', institution: 'Institut Teknologi Bandung', location: 'Bandung, Indonesia', period: '2019 – 2023', description: "Dissertation: 'Hierarchical Deep Learning Approaches for Network Intrusion Detection in Imbalanced Environments.' Supervisor: Prof. Jane Smith.", order: 1 },
    { degree: 'M.Sc. in Informatics', institution: 'Universitas Gadjah Mada', location: 'Yogyakarta, Indonesia', period: '2016 – 2018', description: 'Thesis on anomaly detection in SCADA networks using ensemble learning. Graduated Cum Laude.', order: 2 },
    { degree: 'B.Sc. in Computer Science', institution: 'Siliwangi University', location: 'Tasikmalaya, Indonesia', period: '2012 – 2016', description: 'Best graduate, Faculty of Engineering. Member of ACM student chapter.', order: 3 },
  ];
  for (const d of education) {
    await createPublished(strapi, 'api::education.education', d);
  }

  // ----- Skill Groups -------------------------------------------------------
  const skillGroups = [
    { category: 'Research', items: ['Machine Learning', 'Deep Learning', 'Intrusion Detection', 'Adversarial ML', 'Digital Forensics', 'LLM Security'], order: 1 },
    { category: 'Languages', items: ['Python', 'Go', 'TypeScript', 'C/C++', 'Rust', 'SQL'], order: 2 },
    { category: 'Tools', items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'Wireshark', 'Snort', 'Docker', 'Kubernetes'], order: 3 },
    { category: 'Soft Skills', items: ['Technical Writing', 'Public Speaking', 'Student Mentoring', 'Project Management', 'Grant Writing'], order: 4 },
  ];
  for (const d of skillGroups) {
    await createPublished(strapi, 'api::skill-group.skill-group', d);
  }

  // ----- Awards -------------------------------------------------------------
  const awards = [
    { title: 'Best Paper Award', issuer: 'International Conference on Cybersecurity (ICCS)', year: '2024', order: 1 },
    { title: 'Outstanding Young Researcher', issuer: 'Ministry of Education, Republic of Indonesia', year: '2023', order: 2 },
    { title: 'LPDP Doctoral Scholarship', issuer: 'Indonesia Endowment Fund for Education', year: '2019', order: 3 },
  ];
  for (const d of awards) {
    await createPublished(strapi, 'api::award.award', d);
  }

  // ----- Current Courses ----------------------------------------------------
  const currentCourses = [
    { code: 'IF4301', title: 'AI for Cybersecurity', level: 'Undergraduate', semester: 'Odd Semester 2025/2026', description: 'Introduces students to machine learning techniques applied to intrusion detection, malware analysis, phishing detection, and adversarial machine learning.', order: 1 },
    { code: 'IF5102', title: 'Advanced Cybersecurity Tactics', level: 'Graduate', semester: 'Odd Semester 2025/2026', description: 'A seminar-style course covering red/blue team operations, threat hunting, incident response and modern offensive/defensive tooling.', order: 2 },
    { code: 'IF3204', title: 'Digital Forensics & Incident Response', level: 'Undergraduate', semester: 'Odd Semester 2025/2026', description: 'Covers acquisition, examination, and analysis of digital evidence across host, network, and mobile sources, aligned with international best practices.', order: 3 },
  ];
  for (const d of currentCourses) {
    await createPublished(strapi, 'api::current-course.current-course', d);
  }

  // ----- Past Courses -------------------------------------------------------
  const pastCourses = [
    { code: 'IF2101', title: 'Computer Networks', level: 'Undergraduate', years: '2019 – 2023', order: 1 },
    { code: 'IF2203', title: 'Operating Systems', level: 'Undergraduate', years: '2019 – 2022', order: 2 },
    { code: 'IF3301', title: 'Information Security', level: 'Undergraduate', years: '2020 – 2024', order: 3 },
    { code: 'IF5201', title: 'Advanced Machine Learning', level: 'Graduate', years: '2023 – 2024', order: 4 },
  ];
  for (const d of pastCourses) {
    await createPublished(strapi, 'api::past-course.past-course', d);
  }

  // ----- Supervisions -------------------------------------------------------
  const supervisions = [
    { level: 'Ph.D.', ongoing: 1, completed: 0, order: 1 },
    { level: 'Master', ongoing: 3, completed: 2, order: 2 },
    { level: 'Undergraduate', ongoing: 8, completed: 24, order: 3 },
  ];
  for (const d of supervisions) {
    await createPublished(strapi, 'api::supervision.supervision', d);
  }

  // ----- Journal Reviews ----------------------------------------------------
  const journalReviews = [
    'IEEE Transactions on Information Forensics and Security',
    'ACM Transactions on Privacy and Security',
    'Computers & Security (Elsevier)',
    'IEEE Internet of Things Journal',
    'Journal of Network and Computer Applications',
    'Expert Systems with Applications',
  ];
  for (let i = 0; i < journalReviews.length; i++) {
    await createPublished(strapi, 'api::journal-review.journal-review', {
      name: journalReviews[i],
      order: i + 1,
    });
  }

  // ----- Conference Committees ----------------------------------------------
  const conferenceCommittees = [
    { role: 'Program Committee Member', venue: 'ACM ASIACCS', year: '2025', order: 1 },
    { role: 'Program Committee Member', venue: 'IEEE DSN Workshops', year: '2025', order: 2 },
    { role: 'Session Chair', venue: 'International Conference on Cybersecurity', year: '2024', order: 3 },
    { role: 'Technical Program Committee', venue: 'IFIP WG 11.9 Digital Forensics', year: '2024', order: 4 },
  ];
  for (const d of conferenceCommittees) {
    await createPublished(strapi, 'api::conference-committee.conference-committee', d);
  }

  // ----- Talks --------------------------------------------------------------
  const talks = [
    { title: 'AI-driven Cybersecurity: Opportunities and Pitfalls', event: 'National Cybersecurity Forum', location: 'Jakarta, Indonesia', date: 'November 2024', order: 1 },
    { title: 'Hierarchical Intrusion Detection in Practice', event: 'ASEAN Cybersecurity Workshop', location: 'Singapore', date: 'August 2024', order: 2 },
    { title: 'Adversarial Machine Learning for Security Researchers', event: 'Indonesian Security Conference', location: 'Bandung, Indonesia', date: 'March 2024', order: 3 },
  ];
  for (const d of talks) {
    await createPublished(strapi, 'api::talk.talk', d);
  }

  // ----- Memberships --------------------------------------------------------
  const memberships = [
    'IEEE Member',
    'ACM Member',
    'Indonesian Computer Emergency Response Team (ID-CERT) Affiliate',
    'Indonesian Association of Higher Education in Informatics and Computing (APTIKOM)',
  ];
  for (let i = 0; i < memberships.length; i++) {
    await createPublished(strapi, 'api::membership.membership', {
      name: memberships[i],
      order: i + 1,
    });
  }

  strapi.log.info('[seed] Database seeded successfully with all portfolio data');
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await setupPublicPermissions(strapi);
    await seedDatabase(strapi);
  },
};
