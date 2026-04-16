export const researchProjects = [
  {
    title: "A Novel Multi-stage Hierarchical Intrusion Detection System",
    status: "Ongoing" as const,
    period: "2024 – 2026",
    description:
      "Designing a multi-stage pipeline that combines coarse-grained anomaly detection with fine-grained classification to handle highly imbalanced attack categories in modern network traffic.",
    tags: ["Intrusion Detection", "Deep Learning", "Imbalanced Learning"],
  },
  {
    title: "Adversarial Robustness of Deep Packet Inspection Models",
    status: "Ongoing" as const,
    period: "2024 – 2025",
    description:
      "Investigating perturbation-based evasion attacks on deep-learning-based packet classifiers and proposing certified defenses using randomized smoothing.",
    tags: ["Adversarial ML", "Network Security", "Robustness"],
  },
  {
    title: "Federated Learning for IoT Threat Intelligence",
    status: "Completed" as const,
    period: "2022 – 2023",
    description:
      "Developed a privacy-preserving federated learning framework for collaborative threat intelligence across heterogeneous IoT gateways without sharing raw traffic.",
    tags: ["Federated Learning", "IoT", "Privacy"],
  },
  {
    title: "Explainable Malware Family Classification",
    status: "Completed" as const,
    period: "2021 – 2022",
    description:
      "Built an explainable malware classifier using graph neural networks over API-call graphs with attention-based attribution for analyst support.",
    tags: ["Malware", "XAI", "Graph Neural Networks"],
  },
];

export const collaborators = [
  { name: "Prof. Jane Smith", affiliation: "Institut Teknologi Bandung" },
  { name: "Dr. Michael Chen", affiliation: "National Cheng Kung University" },
  { name: "Dr. Siti Rahmawati", affiliation: "Universitas Gadjah Mada" },
  { name: "Prof. David Lee", affiliation: "Nanyang Technological University" },
];
