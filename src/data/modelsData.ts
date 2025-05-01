// src/data/modelsData.ts

export interface Model {
  title: string;
  description: string;
  tags: string[];
  citations: number;
  likes: string;
  publicationDate: string;
  thumbnailUrl: string;
}

export const models: Model[] = [
  {
    title: "Boltz-1 (AlphaFold3)",
    description: "Open-source model achieving AlphaFold3-level accuracy in predicting 3D structures of biomolecular complexes.",
    tags: ["Protein Folding", "Molecular Docking"],
    citations: 150,
    likes: "5.2k",
    publicationDate: "2024-11-19",
    thumbnailUrl: "https://picsum.photos/800/600?random=1",
  },  
  {
    title: "RoseTTAFold2",
    description: "Fast and accurate protein structure prediction using a three-track neural network architecture.",
    tags: ["Protein Folding", "Molecular Docking"],
    citations: 500,
    likes: "4.5k",
    publicationDate: "2024-09-25",
    thumbnailUrl: "https://picsum.photos/800/600?random=2",
  },
  {
    title: "ESMFold",
    description: "Predicts protein structures at the atomic level using single-sequence inputs without MSAs.",
    tags: ["Protein Folding", "Molecular Docking"],
    citations: 600,
    likes: "4.0k",
    publicationDate: "2022-11-09",
    thumbnailUrl: "https://picsum.photos/800/600?random=3",
  },
  {
    title: "GNINA",
    description: "Enhanced molecular docking with deep learning, supporting covalent docking and CNN scoring.",
    tags: ["Molecular Docking", "Drug Design"],
    citations: 300,
    likes: "3.8k",
    publicationDate: "2025-03-02",
    thumbnailUrl: "https://picsum.photos/800/600?random=4",
  },
  {
    title: "DiffDock",
    description: "A diffusion-based model for accurate protein-ligand docking using generative modeling.",
    tags: ["Molecular Docking", "Drug Design"],
    citations: 200,
    likes: "3.6k",
    publicationDate: "2023-01-01",
    thumbnailUrl: "https://picsum.photos/800/600?random=5",
  },
  {
    title: "RFdiffusion",
    description: "Generative model for de novo protein design using denoising diffusion probabilistic models.",
    tags: ["Protein Design"],
    citations: 150,
    likes: "3.2k",
    publicationDate: "2023-07-11",
    thumbnailUrl: "https://picsum.photos/800/600?random=6",
  },
  {
    title: "ProteinMPNN",
    description: "Efficiently predicts protein sequences for a given backbone structure using message passing neural networks.",
    tags: ["Inverse Folding", "Protein Design"],
    citations: 400,
    likes: "3.0k",
    publicationDate: "2022-09-15",
    thumbnailUrl: "https://picsum.photos/800/600?random=7",
  },
  {
    title: "Umol",
    description: "Predicts fully flexible all-atom structures of protein-ligand complexes directly from sequence information.",
    tags: ["Molecular Docking", "Drug Design"],
    citations: 100,
    likes: "2.9k",
    publicationDate: "2023-06-20",
    thumbnailUrl: "https://picsum.photos/800/600?random=8",
  },
  {
    title: "OmegaFold",
    description: "Accurate de novo protein structure prediction without reliance on multiple sequence alignments.",
    tags: ["Protein Folding", "Protein Design"],
    citations: 250,
    likes: "2.7k",
    publicationDate: "2022-12-09",
    thumbnailUrl: "https://picsum.photos/800/600?random=9",
  },
  {
    title: "ColabDock",
    description: "Integrates AlphaFold and experimental restraints for accurate protein-protein docking.",
    tags: ["Molecular Docking", "Drug Design"],
    citations: 120,
    likes: "2.5k",
    publicationDate: "2023-07-04",
    thumbnailUrl: "https://picsum.photos/800/600?random=10",
  },
  {
    title: "RoseTTAFold All-Atom",
    description: "Protein folding model supporting proteins, nucleotides, ligands, metal ions, and other small molecules.",
    tags: ["Protein Folding"],
    citations: 180,
    likes: "2.4k",
    publicationDate: "2024-04-17",
    thumbnailUrl: "https://picsum.photos/800/600?random=11",
  },
  {
    title: "AFcluster",
    description: "Predicts conformational substates using AlphaFold2 on multiple sequence alignments.",
    tags: ["Protein Folding", "Protein Clustering", "Protein Conformations"],
    citations: 90,
    likes: "2.2k",
    publicationDate: "2022-11-15",
    thumbnailUrl: "https://picsum.photos/800/600?random=12",
  },
  {
    title: "ScanNet",
    description: "Geometric deep learning model for predicting binding site probability from protein structures.",
    tags: ["Drug Design", "Protein Annotation", "Antibodies"],
    citations: 80,
    likes: "2.1k",
    publicationDate: "2022-10-10",
    thumbnailUrl: "https://picsum.photos/800/600?random=13",
  },
  {
    title: "DiffAb",
    description: "Designs antibodies for target antigens using probabilistic diffusion models.",
    tags: ["Antibodies", "Protein Design"],
    citations: 70,
    likes: "2.0k",
    publicationDate: "2022-12-01",
    thumbnailUrl: "https://picsum.photos/800/600?random=14",
  },
  {
    title: "NetSolP-1.0",
    description: "Accurately predicts protein solubility and expression usability from amino acid sequences.",
    tags: ["Protein Solubility", "Protein Expression"],
    citations: 60,
    likes: "1.9k",
    publicationDate: "2022-01-27",
    thumbnailUrl: "https://picsum.photos/800/600?random=15",
  },
];
