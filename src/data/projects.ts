export type ProjectStatus = 'Documenté' | 'Synthèse' | 'En rédaction';

export interface ProjectSection {
  title: string;
  body: string[];
  code?: string;
  points?: string[];
}

export interface Project {
  slug: string;
  title: string;
  shortTitle: string;
  date: string;
  category: 'Cybersécurité' | 'Systèmes' | 'Réseaux' | 'Sauvegarde' | 'ITSM';
  status: ProjectStatus;
  intro: string;
  summary: string;
  stack: string[];
  diagram: { nodes: string[]; links: [number, number][] };
  sections: ProjectSection[];
}

export const projects: Project[] = [
  {
    slug: 'wazuh',
    title: 'SIEM Wazuh : détection cross-platform et brute-force SSH',
    shortTitle: 'Wazuh SIEM',
    date: '2026-09-06',
    category: 'Cybersécurité',
    status: 'Documenté',
    intro: 'Déployer un SIEM all-in-one dans un lab, centraliser les événements Windows et Linux, puis valider la chaîne de détection avec une simulation contrôlée.',
    summary: 'Un manager Wazuh centralise les journaux d’un contrôleur de domaine Windows et d’une VM Linux. Une série d’échecs SSH volontaires sert à vérifier la remontée d’alerte de bout en bout.',
    stack: ['Wazuh 4.14', 'Ubuntu Server 24.04', 'Windows Server', 'OpenSearch', 'Proxmox'],
    diagram: { nodes: ['Windows AD', 'Agent Wazuh', 'Manager + Indexer', 'Dashboard', 'Linux / SSH'], links: [[0,1],[1,2],[4,2],[2,3]] },
    sections: [
      { title: 'Contexte et choix d’architecture', body: ['Le lab repose sur une installation Wazuh all-in-one : manager, indexer OpenSearch et dashboard sur une même VM. Ce format est adapté à l’expérimentation, pas présenté comme une architecture de production.', 'La VM SER25-WAZUH utilise Ubuntu Server 24.04 LTS. Deux sources sont intégrées : le contrôleur de domaine SER25-ADDS-GPO et une VM Linux LAB-LINUX01.'] },
      { title: 'Déploiement du manager', body: ['L’assistant officiel déploie les trois composants, génère les certificats et fournit les identifiants initiaux. La mémoire de la VM doit être dimensionnée pour l’indexer.'], code: 'curl -sO https://packages.wazuh.com/4.14/wazuh-install.sh\nsudo bash ./wazuh-install.sh -a' },
      { title: 'Collecte Windows et Linux', body: ['L’agent Windows remonte les événements du contrôleur de domaine. Sur Linux, le dépôt Wazuh est ajouté puis l’agent est rattaché au manager. Les services et journaux locaux confirment la connexion avant toute simulation.'], points: ['Vérifier les flux TCP 1514 et 1515', 'Contrôler le statut du service sur chaque hôte', 'Synchroniser les horloges pour éviter les décalages d’indexation'] },
      { title: 'Validation contrôlée', body: ['Plusieurs connexions SSH échouées sont générées volontairement vers LAB-LINUX01. Les événements apparaissent d’abord dans auth.log, puis dans Security events sur le dashboard.', 'La validation porte sur la présence des deux agents, la remontée des événements Windows et l’alerte SSH observable. Elle ne constitue pas un test de performance ni une validation de production.'] }
    ]
  },
  {
    slug: 'active-directory-gpo',
    title: 'Active Directory et GPO sur Windows Server 2025',
    shortTitle: 'Active Directory & GPO',
    date: '2025-07-31',
    category: 'Systèmes',
    status: 'Documenté',
    intro: 'Construire un domaine de lab administrable : adressage, AD DS, DNS, unités d’organisation, postes joints au domaine et premières politiques de groupe.',
    summary: 'Déploiement d’un contrôleur de domaine Windows Server 2025, structuration des OU, création d’utilisateurs, intégration d’un poste client et application de GPO.',
    stack: ['Windows Server 2025', 'AD DS', 'DNS', 'GPO', 'PowerShell'],
    diagram: { nodes: ['DNS / AD DS', 'komjordan.local', 'OU Paris', 'OU IT', 'OU RH', 'Poste client'], links: [[0,1],[1,2],[2,3],[2,4],[1,5]] },
    sections: [
      { title: 'Préparer le socle', body: ['Le serveur reçoit un nom explicite et une adresse IPv4 fixe avant la promotion. Le DNS principal pointe vers le contrôleur lui-même afin d’assurer la résolution du domaine interne.'] },
      { title: 'Promouvoir le contrôleur', body: ['Le rôle AD DS est installé avec DNS, puis une nouvelle forêt komjordan.local est créée. Le lab est ensuite structuré en unités d’organisation Paris, IT et RH.'], points: ['Créer les OU avant les objets pour garder une délégation lisible', 'Protéger les OU contre la suppression accidentelle', 'Prévoir un mot de passe DSRM distinct et robuste'] },
      { title: 'Joindre et gouverner', body: ['Un poste Windows rejoint le domaine et utilise les comptes centralisés. Des GPO testent l’application d’un fond d’écran réseau et la restriction de l’invite de commande pour un périmètre ciblé.', 'Le travail inclut l’observation de l’ordre des liens GPO, leur portée et leur application aux utilisateurs ou ordinateurs.'] },
      { title: 'Maintenir', body: ['La santé du domaine est contrôlée avec dcdiag, les journaux AD et DNS sont consultés dans l’Observateur d’événements, et Windows Server Backup est configuré pour inclure l’état du système.'], code: 'dcdiag /v > diagnostic.txt' }
    ]
  },
  {
    slug: 'splunk',
    title: 'Splunk : collecte de logs, recherches et tableau de bord',
    shortTitle: 'SIEM Splunk',
    date: '2025-04-25',
    category: 'Cybersécurité',
    status: 'Documenté',
    intro: 'Centraliser des événements Windows et Linux, interroger les données en SPL et transformer les signaux utiles en rapports et visualisations.',
    summary: 'Installation de Splunk sur Debian, raccordement de Universal Forwarders Windows et Linux, recherche d’événements de sécurité et création de rapports.',
    stack: ['Splunk Enterprise', 'Universal Forwarder', 'Debian', 'Windows', 'SPL'],
    diagram: { nodes: ['Windows', 'Forwarder', 'Splunk :9997', 'Recherche SPL', 'Linux'], links: [[0,1],[1,2],[4,2],[2,3]] },
    sections: [
      { title: 'Ingestion', body: ['Splunk Enterprise est installé sur Debian et écoute les forwarders sur le port 9997. Un Universal Forwarder Windows et un agent Linux envoient les journaux sélectionnés vers l’indexeur.'] },
      { title: 'Contrôles de collecte', body: ['La commande de statut du forwarder confirme le serveur de destination. Une recherche globale permet de vérifier la présence des deux machines avant de travailler sur des événements ciblés.'], code: 'index=*\nindex=* EventCode=4625' },
      { title: 'Scénarios observés', body: ['Une tentative SMB avec des identifiants invalides génère un événement Windows 4625. Un second exercice porte sur l’observation d’un événement après désactivation contrôlée de l’antivirus dans le lab.', 'Ces scénarios servent à relier une action connue, sa trace système et sa restitution dans Splunk.'] },
      { title: 'Restitution', body: ['Les recherches sont enregistrées sous forme de rapports planifiés et de panneaux de tableau de bord. Une vue rapproche connexions réussies et échouées sans prétendre à une couverture SOC complète.'], code: 'index=wineventlog sourcetype=WinEventLog:Security (EventCode=4624 OR EventCode=4625)\n| eval TypeConnexion=if(EventCode==4624, "Connexion réussie", "Connexion échouée")' }
    ]
  },
  {
    slug: 'audit-securite',
    title: 'Audit de sécurité CEH — étude de cas pédagogique',
    shortTitle: 'Audit de sécurité',
    date: '2025-01-17',
    category: 'Cybersécurité',
    status: 'Synthèse',
    intro: 'Appliquer une démarche de reconnaissance, cartographie, énumération et analyse de vulnérabilités dans un cadre pédagogique contrôlé et autorisé.',
    summary: 'Étude menée dans le cadre de l’Institut F2I : reconnaissance, scans réseau, analyse de services et recommandations de durcissement.',
    stack: ['Nmap', 'Nikto', 'OpenVAS', 'Enum4linux', 'WHOIS'],
    diagram: { nodes: ['Périmètre autorisé', 'Reconnaissance', 'Cartographie', 'Analyse', 'Recommandations'], links: [[0,1],[1,2],[2,3],[3,4]] },
    sections: [
      { title: 'Cadre éthique', body: ['Le travail a été réalisé dans un exercice encadré, avec autorisation explicite. Les étapes sont présentées pour expliquer la méthode et la remédiation, non pour guider une action non autorisée.'] },
      { title: 'Reconnaissance et cartographie', body: ['La phase passive combine recherches publiques, DNS et WHOIS. La phase active utilise Nmap pour identifier les hôtes, ports et services du réseau de test.'], code: 'nmap -sV -O 192.168.10.0/24\nnmap -sC -sV -p- 192.168.10.150' },
      { title: 'Analyse', body: ['Nmap NSE, Nikto, Enum4linux et OpenVAS complètent l’inventaire. L’étude relève notamment l’absence de certains en-têtes HTTP de sécurité et des services dont l’exposition doit être revue.'] },
      { title: 'Recommandations', body: ['La restitution propose d’ajouter les en-têtes HTTP adaptés, de formaliser les mises à jour, de restreindre les services inutiles et de mettre en place une supervision continue.'], points: ['Réduire la surface exposée', 'Durcir les configurations web', 'Superviser les événements', 'Répéter les contrôles dans le temps'] }
    ]
  },
  {
    slug: 'veeam',
    title: 'Veeam Backup & Replication : sauvegarde et restauration',
    shortTitle: 'Veeam Backup',
    date: '2024-03-13',
    category: 'Sauvegarde',
    status: 'Documenté',
    intro: 'Construire un lab de sauvegarde qui couvre référentiels, jobs, restauration granulaire et bibliothèque de bandes virtuelle.',
    summary: 'Configuration de dépôts DAS et NAS, jobs de machines physiques et virtuelles, scénarios de restauration et VTL Quadstor sous Rocky Linux.',
    stack: ['Veeam Backup & Replication', 'Hyper-V', 'Rocky Linux', 'Quadstor VTL', 'SMB'],
    diagram: { nodes: ['Hôtes / VM', 'Veeam', 'DAS', 'NAS / SMB', 'Quadstor VTL'], links: [[0,1],[1,2],[1,3],[1,4]] },
    sections: [
      { title: 'Périmètre du lab', body: ['Veeam orchestre des sauvegardes de machines physiques et virtuelles. Des référentiels directs et réseau permettent d’observer les différences de configuration et de gestion.'] },
      { title: 'Jobs et planification', body: ['Un job de machine virtuelle est planifié et exécuté dans le lab. Le travail distingue sauvegarde complète, incrémentale et synthétique complète, puis relie ces choix au plan de reprise.'] },
      { title: 'Restauration', body: ['Plusieurs parcours sont exercés depuis la console : comparaison et restauration d’objets Active Directory, récupération d’un fichier invité et Instant Recovery d’une VM.'], points: ['Choisir un point de restauration', 'Contrôler la cible avant l’opération', 'Documenter le parcours de retour en service'] },
      { title: 'VTL Quadstor', body: ['Une VM Rocky Linux héberge Quadstor afin d’émuler une bibliothèque de bandes. Le stockage physique, les définitions de périphériques et les cartouches virtuelles sont configurés avant l’ajout dans Veeam.', 'Cette réalisation est un laboratoire d’apprentissage ; elle ne revendique ni test de charge ni validation de conservation réglementaire.'] }
    ]
  },
  {
    slug: 'vsphere',
    title: 'VMware vSphere : optimisation et mise à l’échelle',
    shortTitle: 'VMware vSphere',
    date: '2024-02-10',
    category: 'Systèmes',
    status: 'En rédaction',
    intro: 'Projet réalisé autour de l’optimisation des ressources et de la mise à l’échelle d’une infrastructure vSphere ; documentation détaillée en cours.',
    summary: 'Étude de l’administration d’une infrastructure VMware vSphere et de ses mécanismes de disponibilité. La source publique ne contient pas encore le déroulé technique complet.',
    stack: ['VMware vSphere', 'Virtualisation', 'HA', 'DRS'],
    diagram: { nodes: ['vCenter', 'Cluster', 'Hôte ESXi A', 'Hôte ESXi B', 'Machines virtuelles'], links: [[0,1],[1,2],[1,3],[2,4],[3,4]] },
    sections: [
      { title: 'Scope disponible', body: ['Le projet est indiqué comme réalisé dans le portfolio d’origine, avec pour thème l’optimisation et la mise à l’échelle d’une infrastructure VMware vSphere.', 'La documentation source restant en rédaction, cette page se limite volontairement au périmètre annoncé.'] },
      { title: 'Axes de travail', body: ['Le parcours technique mentionne vSphere, la haute disponibilité, DRS et Fault Tolerance parmi les compétences de virtualisation. Ils structurent la lecture du projet sans constituer ici un compte rendu de résultats.'], points: ['Administration centralisée', 'Répartition des ressources', 'Disponibilité des charges', 'Évolution de la capacité'] },
      { title: 'À documenter', body: ['La prochaine version devra préciser l’architecture du lab, les choix de configuration, les procédures de validation et les limites observées. Aucun résultat chiffré ni capture n’est inventé dans l’intervalle.'] }
    ]
  },
  {
    slug: 'glpi',
    title: 'GLPI : installation et gestion du parc informatique',
    shortTitle: 'GLPI / ITSM',
    date: '2024-01-03',
    category: 'ITSM',
    status: 'En rédaction',
    intro: 'Projet réalisé autour de la gestion des équipements, utilisateurs et tickets dans GLPI ; documentation détaillée en cours.',
    summary: 'Déploiement d’un outil de gestion de parc et de suivi des demandes. La source publique annonce le projet sans fournir encore son déroulé complet.',
    stack: ['GLPI', 'Inventaire', 'Tickets', 'Gestion de parc'],
    diagram: { nodes: ['Utilisateurs', 'Portail GLPI', 'Tickets', 'Inventaire', 'Technicien'], links: [[0,1],[1,2],[1,3],[2,4],[3,4]] },
    sections: [
      { title: 'Scope disponible', body: ['Le portfolio d’origine présente un projet GLPI consacré à l’installation et à la gestion du parc informatique, couvrant équipements, tickets et utilisateurs.', 'Le parcours professionnel source mentionne également l’utilisation de GLPI pour le suivi des tickets, des interventions et du matériel.'] },
      { title: 'Flux fonctionnel', body: ['Le schéma illustre la relation attendue entre utilisateurs, portail, demandes, inventaire et traitement par un technicien. Il s’agit d’une synthèse fonctionnelle, pas d’une capture d’un déploiement réel.'] },
      { title: 'À documenter', body: ['La documentation complète devra expliciter l’environnement d’installation, le modèle de rôles, le cycle de ticket et la méthode d’inventaire. Aucun volume de parc, délai de traitement ou gain opérationnel n’est avancé sans source.'] }
    ]
  }
];

export const categories = ['Tous', ...new Set(projects.map((project) => project.category))] as const;

export const findProject = (slug: string) => projects.find((project) => project.slug === slug);
