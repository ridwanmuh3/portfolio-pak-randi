export type Publication = {
  type: "Journal" | "Conference" | "Book Chapter";
  title: string;
  authors: string;
  venue: string;
  year: number;
  doi?: string;
  corresponding?: boolean;
};

export const publications: Publication[] = [
  {
    type: "Journal",
    title: "Hierarchical Deep Learning for Imbalanced Network Intrusion Detection: A Multi-stage Approach",
    authors: "J. Doe*, J. Smith, M. Chen",
    venue: "IEEE Transactions on Information Forensics and Security",
    year: 2025,
    corresponding: true,
    doi: "10.1109/TIFS.2025.0000001",
  },
  {
    type: "Journal",
    title: "Certified Robustness of Packet Classifiers via Randomized Smoothing",
    authors: "J. Doe, M. Chen*, D. Lee",
    venue: "ACM Transactions on Privacy and Security",
    year: 2025,
    doi: "10.1145/3000000.0000002",
  },
  {
    type: "Journal",
    title: "Federated Anomaly Detection for IoT Gateways under Non-IID Traffic",
    authors: "J. Doe*, S. Rahmawati",
    venue: "Computers & Security",
    year: 2024,
    corresponding: true,
    doi: "10.1016/j.cose.2024.000003",
  },
  {
    type: "Journal",
    title: "An Explainable Malware Family Classifier Using Graph Neural Networks",
    authors: "J. Doe, A. Pratama*, R. Kurniawan",
    venue: "Expert Systems with Applications",
    year: 2024,
    doi: "10.1016/j.eswa.2024.000004",
  },
  {
    type: "Journal",
    title: "Lightweight Deep Learning for Encrypted Traffic Classification on Edge Devices",
    authors: "J. Doe*, M. Chen",
    venue: "Journal of Network and Computer Applications",
    year: 2023,
    corresponding: true,
  },
  {
    type: "Journal",
    title: "Towards Privacy-preserving Smart Campus Analytics: A Federated Learning Perspective",
    authors: "S. Rahmawati*, J. Doe",
    venue: "IEEE Internet of Things Journal",
    year: 2023,
  },
  {
    type: "Conference",
    title: "Multi-stage Contrastive Pre-training for Network Intrusion Detection",
    authors: "J. Doe*, J. Smith",
    venue: "Proceedings of ACM CCS",
    year: 2024,
    corresponding: true,
  },
  {
    type: "Conference",
    title: "Evasion Attacks on Deep Packet Inspection: A Study of Transferability",
    authors: "J. Doe, D. Lee*",
    venue: "Proceedings of USENIX Security",
    year: 2024,
  },
  {
    type: "Conference",
    title: "ForensicKit: An Open Toolkit for Mobile Evidence Acquisition",
    authors: "J. Doe*, A. Pratama",
    venue: "Proceedings of IFIP WG 11.9 Digital Forensics",
    year: 2023,
    corresponding: true,
  },
  {
    type: "Conference",
    title: "Graph-based Detection of Obfuscated Android Malware",
    authors: "A. Pratama*, J. Doe",
    venue: "Proceedings of ACSAC",
    year: 2022,
  },
  {
    type: "Book Chapter",
    title: "Securing Industrial Control Systems with Adaptive Machine Learning",
    authors: "J. Doe*, R. Kurniawan",
    venue: "Handbook of Cyber-Physical Systems Security, Springer",
    year: 2024,
    corresponding: true,
  },
  {
    type: "Book Chapter",
    title: "Digital Forensics in the Cloud Era: Tools and Challenges",
    authors: "J. Doe",
    venue: "Advances in Digital Forensics, Springer",
    year: 2022,
  },
];
