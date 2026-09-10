export interface OfferingCardBullet {
  text: string;
  iconType: 'chart' | 'document' | 'wrench' | 'nodes' | 'gear' | 'database' | 'link';
}

export interface ComparisonRow {
  feature: string;
  starter?: string;
  silver: string;
  gold: string;
  platinum: string;
  highlight?: boolean;
}

export interface PlatformOffering {
  id: string;
  slug: string;
  name: string;
  shortTitle: string;
  fullName: string;
  heroTitle: string;
  heroSubtitle: string;
  logo: string;
  cloudLogo: string;
  cardBullets: OfferingCardBullet[];
  packages: {
    hasStarter: boolean;
    packageNames: {
      starter?: string;
      silver: string;
      gold: string;
      platinum: string;
    };
    rows: ComparisonRow[];
  };
  pleaseNotes: string[];
  whatsIncluded: {
    title: string;
    description: string;
    items: {
      category: string;
      details: string[];
    }[];
  };
  migrationApproach: {
    stepNumber: number;
    title: string;
    duration: string;
    description: string;
    deliverables: string[];
  }[];
  enablementAndSupport: {
    category: string;
    summary: string;
    highlights: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const OFFERINGS_DATA: Record<string, PlatformOffering> = {
  'sap-pipo': {
    id: 'sap-pipo',
    slug: 'sap-pipo',
    name: 'SAP PI/PO',
    shortTitle: 'SAP PI/PO',
    fullName: 'SAP PI/PO Migration Packages',
    heroTitle: 'SAP PI/PO Migration Packages',
    heroSubtitle:
      'Migrate from SAP PI/PO to SAP BTP Integration Suite with proven methodology, accelerators and expert support.',
    logo: '/images/logos/logo_sap_pipo.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    cardBullets: [
      { text: 'Support for complex landscapes', iconType: 'chart' },
      { text: 'B2B/Trading partner migration', iconType: 'document' },
      { text: 'Modernization with proven methodology', iconType: 'wrench' },
    ],
    packages: {
      hasStarter: true,
      packageNames: {
        starter: 'Starter Package',
        silver: 'SILVER (Small Scope)',
        gold: 'GOLD (Medium Scope)',
        platinum: 'PLATINUM (Large Scope)',
      },
      rows: [
        {
          feature: 'Number of Interfaces',
          starter: 'Up to 10 Golden Interfaces (Mixed complexity)',
          silver: '50 (Mixed complexity)',
          gold: '100 (Mixed complexity)',
          platinum: '150 (Mixed complexity)',
          highlight: true,
        },
        {
          feature: 'Number of Applications',
          starter: 'Up to 2',
          silver: 'Up to 5',
          gold: 'Up to 10',
          platinum: 'Up to 20',
        },
        {
          feature: 'Platform Setup',
          starter: 'Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'For B2B migration – Trading Partner / Transaction support',
          starter: '1 Trading partner / 1 unique Transaction',
          silver: '10 Trading partner / up to 4 unique Transactions',
          gold: '10 Trading partner / up to 8 unique Transactions',
          platinum: '10+ Trading partner / up to 12 unique Transactions',
        },
        {
          feature: 'Modernization',
          starter:
            'Integration Design & Mapping Modernization, Adapter & connectivity strategy, Version control for i-Flows, Reusable artifacts (Common iflow for IDocs, Error handling & alerts, Enhanced retry)',
          silver:
            'Starter Scope + Error handling & alerts (standard), JMS queue retry mechanism, API-M lead approach (Reusable integrations as managed APIs, Standard Policies)',
          gold:
            'Silver Scope + Standard & customizable alerts, B2B/EDI Modernization (If Applicable), Custom Policy support, Event Driven Architecture (Event Mesh)',
          platinum:
            'Gold Scope + Advanced Event Mesh (EDA), Advanced custom policies, Comprehensive B2B/EDI Modernization',
        },
        {
          feature: 'Transport Management (CTMS)',
          starter: 'Not Supported',
          silver: 'Supported (BTP destination setup, TMS role setup, Configure & setup CTMS Nodes & routes, Support TR request)',
          gold: 'Supported (Standard & custom TMS roles, CTMS Nodes/routes, TR request, Cross Actions for TPM for B2B)',
          platinum: 'Supported (Standard & custom TMS roles, CTMS Nodes/routes, TR request, Cross Actions for TPM for B2B)',
        },
        {
          feature: 'Custom Archiving Support',
          starter: 'NA',
          silver: 'Supported with SFTP',
          gold: 'Supported with SFTP, DMS etc.',
          platinum: 'Supported with SFTP, DMS etc.',
        },
        {
          feature: 'Adapters Included',
          starter: 'Standard',
          silver: 'Standard + Application adapters',
          gold: 'Standard + Application adapters',
          platinum: 'Standard + Application adapters',
        },
        {
          feature: 'IntSwitch : PO Test Automation tool',
          starter: 'Partial Support (Internal Tool) - Accelerator for migration, testing and quality monitoring',
          silver: 'Supported (Internal Tool) - Accelerator for migration, testing and quality monitoring',
          gold: 'Supported (Internal Tool) - Accelerator for migration, testing and quality monitoring',
          platinum: 'Supported (Internal Tool) - Accelerator for migration, testing and quality monitoring',
        },
        {
          feature: 'Enhancements / New requirements',
          starter: 'NA',
          silver: 'NA',
          gold: 'Support for new developments equivalent to 3 PD efforts + 2 Change requests',
          platinum: 'Support for new developments equivalent to 5 PD efforts + 3 Change requests',
        },
        {
          feature: 'Enablement Sessions',
          starter: 'Integration Suite Overview & KT Sessions',
          silver: 'Overview, KT, Naming conventions for A2A, Standard TSD documents',
          gold: 'Overview, KT, Architecture design docs, B2B/TPM/API-M, Reuse strategy, Extended 1 wk hypercare',
          platinum: 'Overview, KT, Architecture docs, B2B/TPM/API-M, Reuse strategy, Custom TSD, Mapping docs, Daily reports, Extended 1 wk hypercare',
        },
        {
          feature: 'Monitoring & Logging',
          starter: 'Supported',
          silver: 'Supported (API-M Monitoring - standard)',
          gold: 'Supported (Customer alerts, API-M Monitoring - customized)',
          platinum: 'Supported (Customer alerts, Customized API-M Logging, IntSwitch Quality & Governance dashboards)',
        },
        {
          feature: 'Hypercare Support',
          starter: '2 weeks',
          silver: '2 weeks',
          gold: '3 weeks',
          platinum: '3 weeks',
        },
        {
          feature: 'Estimated Timeline',
          starter: '2 months',
          silver: '4 months',
          gold: '7 months',
          platinum: '9 months',
          highlight: true,
        },
        {
          feature: 'Team Composition',
          starter: 'PM + Integration Developer + BASIS',
          silver: 'PM + 2 Integration Developers + BASIS',
          gold: 'PM + Lead + 2 Integration Developers + Architect + BASIS',
          platinum: 'PM + Architect + Lead + 3 Integration Developers + BASIS & Security',
        },
        {
          feature: 'Indicative Pricing (USD)',
          starter: '19K',
          silver: '65K',
          gold: '110K',
          platinum: '145K',
          highlight: true,
        },
      ],
    },
    pleaseNotes: [
      'The migration to SAP Integration Suite packages are indicative; timeline, cost and plans may vary based on the actual requirement, interface complexity breakup and availability of resources during the time of migration.',
      'Complexity Break up is assumed to be S : M : L/XL :: 60% : 30% : 10%.',
      'Any Enhancements apart or Development work apart from SAP IS, is not in-Scope.',
      'Applicable for PO 7.5 single stack. Dual stack scenarios will have 15% price increase.',
    ],
    whatsIncluded: {
      title: "What's Included in SAP PI/PO Migration",
      description: 'Comprehensive technical deliverables, accelerators, and governance models.',
      items: [
        {
          category: 'Core Deliverables',
          details: [
            'Automated extraction of PI/PO configuration, ESR objects, Directory artifacts and mappings',
            'Conversion of Graphical and XSLT mappings into Cloud Integration Groovy scripts & message mappings',
            'Tenant provisioning, Cloud Integration runtime setup, and CTMS pipeline configuration',
            'Full regression testing payload comparison between PI/PO and SAP Integration Suite',
          ],
        },
        {
          category: 'IntSwitch Tooling & Accelerators',
          details: [
            'IntSwitch automated migration engine for iFlow generation and adapter transformation',
            'Automated test suite comparing legacy payload XML/JSON with target SAP IS response',
            'Audit and compliance verification reports generated for cutover approval',
          ],
        },
      ],
    },
    migrationApproach: [
      {
        stepNumber: 1,
        title: 'Discover & Inventory',
        duration: 'Weeks 1-2',
        description: 'Catalog all PI/PO interfaces, communication channels, UDFs, and message frequencies.',
        deliverables: ['Landscape Discovery Matrix', 'Complexity Breakdown Report'],
      },
      {
        stepNumber: 2,
        title: 'Architecture & Foundation',
        duration: 'Weeks 3-4',
        description: 'Setup BTP tenant, Cloud Connector, CTMS transport pipelines, and security keys.',
        deliverables: ['Tenant Architecture Document', 'CTMS Transport Routes Configured'],
      },
      {
        stepNumber: 3,
        title: 'Iterative Migration (Wave-based)',
        duration: 'Months 2-6',
        description: 'Migrate interfaces in prioritized sprints leveraging IntSwitch automated code generation.',
        deliverables: ['Deployed iFlows in Dev/QA', 'Mapping Documentation'],
      },
      {
        stepNumber: 4,
        title: 'Validation & Regression',
        duration: 'Months 6-8',
        description: 'Execute end-to-end parallel payload testing and performance benchmarking.',
        deliverables: ['Automated Test Run Summaries', 'Functional Equivalence Sign-off'],
      },
      {
        stepNumber: 5,
        title: 'Cutover & Hypercare',
        duration: 'Month 9+',
        description: 'Production cutover window, DNS/endpoint switch, and dedicated 3-week hypercare support.',
        deliverables: ['Production Go-Live Protocol', 'Operational Handover & KT'],
      },
    ],
    enablementAndSupport: [
      {
        category: 'Team Enablement & Knowledge Transfer',
        summary: 'Hands-on architectural workshops and documentation to empower your in-house team.',
        highlights: [
          'Integration Suite overview and deep-dive technical KT sessions',
          'Standard and customized Technical Specification Documents (TSD)',
          'API Management & Reuse Strategy walkthroughs for future expansions',
        ],
      },
      {
        category: 'Dedicated Hypercare Support',
        summary: 'Active post-cutover operational monitoring with fast escalation channels.',
        highlights: [
          '2 to 3 weeks of intensive post-go-live hypercare support',
          'Daily hypercare health check status reports and error log tracking',
          'On-demand issue remediation and integration performance tuning',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the assumed complexity breakup for interface scoping?',
        answer:
          'Our fixed packages assume a standard distribution of Simple (60%), Medium (30%), and Large/Extra-Large (10%) interface complexity.',
      },
      {
        question: 'How are dual-stack SAP PI/PO systems handled?',
        answer:
          'The listed packages are calibrated for PO 7.5 single stack (Java only). Dual-stack systems (ABAP + Java) involve additional ccBPM conversion and have a 15% price adjustment.',
      },
      {
        question: 'Does this pricing include SAP Integration Suite software licensing?',
        answer:
          'No. These packages cover Incture’s end-to-end migration consulting, IntSwitch tooling, and delivery services. SAP BTP licensing is procured directly from SAP according to your subscription tier (Starter, Standard, or Enhanced).',
      },
    ],
  },

  mulesoft: {
    id: 'mulesoft',
    slug: 'mulesoft',
    name: 'MuleSoft',
    shortTitle: 'MuleSoft',
    fullName: 'MuleSoft Migration Packages',
    heroTitle: 'MuleSoft Migration Packages',
    heroSubtitle:
      'Migrate from MuleSoft to SAP BTP Integration Suite with proven methodology, accelerators and expert support.',
    logo: '/images/logos/logo_mulesoft.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    cardBullets: [
      { text: 'API-led migration approach', iconType: 'nodes' },
      { text: 'Accelerators and reusable assets', iconType: 'gear' },
      { text: 'Faster time to value', iconType: 'chart' },
    ],
    packages: {
      hasStarter: true,
      packageNames: {
        starter: 'Starter Package',
        silver: 'SILVER (Small Scope)',
        gold: 'GOLD (Medium Scope)',
        platinum: 'PLATINUM (Large Scope)',
      },
      rows: [
        {
          feature: 'Number of Interfaces',
          starter: '10 Golden Interfaces',
          silver: '40',
          gold: '80',
          platinum: '110',
          highlight: true,
        },
        {
          feature: 'Number of Applications',
          starter: 'Up to 2',
          silver: 'Up to 5',
          gold: 'Up to 12',
          platinum: 'Up to 25',
        },
        {
          feature: 'Platform Setup',
          starter: 'Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Trading Partner / Transaction Onboarding support',
          starter: '1 TP / 1 unique Transaction',
          silver: '10 TP / up to 4 unique Transactions',
          gold: '10 TP / up to 8 unique Transactions',
          platinum: '10+ TP / up to 12 unique Transactions',
        },
        {
          feature: 'Modernization',
          starter:
            'Integration Design & Mapping Modernization, Adapter strategy, Version control for i-Flows, Reusable artifacts (Common iflow for IDocs, Error handling & alerts, Enhanced retry)',
          silver:
            'Starter Scope + Error handling & alerts (standard), JMS queue retry mechanism, API-M lead approach (Reusable integrations as managed APIs, Standard Policies)',
          gold:
            'Silver Scope + Standard & customizable alerts, B2B/EDI Modernization (If Applicable), Custom Policy support, Event Driven Architecture (Event Mesh)',
          platinum:
            'Gold Scope + Advanced Event Mesh (EDA), Advanced custom policies, Comprehensive B2B/EDI Modernization',
        },
        {
          feature: 'Transport Management (CTMS)',
          starter: 'Not Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Complexity Support',
          starter: 'Simple',
          silver: 'Simple + Medium',
          gold: 'Simple + Medium + Complex',
          platinum: 'Simple + Medium + Complex',
        },
        {
          feature: 'Adapters Included',
          starter: 'Standard adapters (HTTP, SOAP, REST, SFTP, IDoc)',
          silver: 'Standard adapters (HTTP, SOAP, REST, SFTP, IDoc)',
          gold: 'Standard + Application adapters (Ariba, SF, OData, S/4) + AS2',
          platinum: 'All standard + application adapters + AS2',
        },
        {
          feature: 'API Policy Supported',
          starter: 'Standard',
          silver: 'Standard',
          gold: 'Standard + Custom + API-M policy bot Co-Pilot',
          platinum: 'Standard + Custom + API-M policy bot Co-Pilot',
        },
        {
          feature: 'IntSwitch : Assessment & Migration tool (Internal)',
          starter: 'Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Mapping Conversion',
          starter: 'Graphical Mapping',
          silver: 'Graphical & XSLT, UDF supported',
          gold: 'Graphical, XSLT + Js & Groovy conversion + UDF supported',
          platinum: 'All: Graphical, XSLT, Java mapping conversion to Groovy + UDF supported',
        },
        {
          feature: 'Enhancements / New requirements',
          starter: 'NA',
          silver: 'NA',
          gold: 'Support for new developments equivalent to 3 PD efforts + 2 Change requests',
          platinum: 'Support for new developments equivalent to 5 PD efforts + 3 Change requests',
        },
        {
          feature: 'Monitoring & Logging',
          starter: 'Supported',
          silver: 'Supported (API-M Monitoring - standard)',
          gold: 'Supported (Customer alerts, API-M Monitoring - customized)',
          platinum: 'Supported (Customer alerts, Customized API-M Logging, IntSwitch Quality & Governance dashboards)',
        },
        {
          feature: 'Hypercare Support',
          starter: '2 weeks',
          silver: '2 weeks',
          gold: '3 weeks',
          platinum: '3 weeks',
        },
        {
          feature: 'Estimated Timeline',
          starter: '2 months',
          silver: '4 months',
          gold: '6–8 months',
          platinum: '9–12 months',
          highlight: true,
        },
        {
          feature: 'Team Composition',
          starter: 'PM + Integration Developer + BASIS',
          silver: 'PM + 2 Integration Developers + BASIS',
          gold: 'PM + Lead + 2 Integration Developers + Architect + BASIS',
          platinum: 'PM + Architect + Lead + 3 Integration Developers + BASIS & Security',
        },
        {
          feature: 'Indicative Pricing (USD)',
          starter: '29K',
          silver: '68.5K',
          gold: '135K',
          platinum: '185K',
          highlight: true,
        },
      ],
    },
    pleaseNotes: [
      'The migration to SAP Integration Suite packages are indicative, timeline, cost and plans may vary based on the actual requirement, interface complexity breakup and availability of resources during the time of migration.',
      'Complexity Break up is assumed to be S : M : L/XL :: 60% : 30% : 10%.',
      'Any Enhancements apart or Development work apart from SAP IS, is not in-Scope.',
      '1 API is assumed to have 1 resource which is equivalent to 1 integration interface.',
      'In 3 tier architecture, 1 Sys + 1 Exp + 1 Process API = 1 Integration interfaces, assuming only process APIs have transformations and orchestrations.',
    ],
    whatsIncluded: {
      title: "What's Included in MuleSoft Migration",
      description: 'Decoupling MuleSoft APIs, DataWeave transformations, and Anypoint governance to SAP IS.',
      items: [
        {
          category: 'API & DataWeave Modernization',
          details: [
            'Conversion of RAML/OAS API definitions to SAP API Management specs',
            'Transformation of DataWeave logic into Groovy/JavaScript scripts and message mappings',
            'Migration of Mule flows (System, Process, Experience tiers) to optimized SAP Cloud Integration iFlows',
          ],
        },
        {
          category: 'Tooling & Governance',
          details: [
            'IntSwitch accelerated dependency extraction from Anypoint Studio projects',
            'Automated endpoint & payload verification between MuleSoft and SAP Integration Suite',
            'CTMS transport setup and SAP Cloud Connector integration',
          ],
        },
      ],
    },
    migrationApproach: [
      {
        stepNumber: 1,
        title: 'Landscape Assessment & API Mapping',
        duration: 'Month 1',
        description: 'Map 3-tier MuleSoft APIs (System, Process, Experience) to SAP Integration Suite components.',
        deliverables: ['API Taxonomy Matrix', 'DataWeave Complexity Assessment'],
      },
      {
        stepNumber: 2,
        title: 'Core Tenant & Framework Setup',
        duration: 'Month 2',
        description: 'Deploy common logging, error handling, security policies, and CTMS pipelines.',
        deliverables: ['Global Framework iFlows', 'SAP API-M Developer Portal Setup'],
      },
      {
        stepNumber: 3,
        title: 'Sprint Migration & DataWeave Conversion',
        duration: 'Months 3-8',
        description: 'Transform connectors, DataWeave scripts, and business logic into iFlows.',
        deliverables: ['Migrated Integration Packages', 'Automated Test Validation Runs'],
      },
      {
        stepNumber: 4,
        title: 'System Integration Testing (SIT) & Cutover',
        duration: 'Months 9-11',
        description: 'Dual-run validation and consumer application routing switchover.',
        deliverables: ['Consumer Cutover Sign-off', 'Production Go-Live Protocol'],
      },
    ],
    enablementAndSupport: [
      {
        category: 'MuleSoft to SAP Skill Transition',
        summary: 'Upskilling your existing MuleSoft development teams for SAP Integration Suite.',
        highlights: [
          'Groovy scripting workshops for developers transitioning from DataWeave 2.0',
          'SAP API Management policy bot Co-Pilot walkthrough and operational training',
          'Architecture best practices for Event Mesh vs Anypoint MQ',
        ],
      },
      {
        category: 'Hypercare & Quality Governance',
        summary: '2 to 3 weeks of round-the-clock support to guarantee SLA continuity.',
        highlights: [
          'Live monitoring of API-M latency, throughput, and error rates',
          'Fast-track bug fix cycles during the initial 3-week cutover window',
        ],
      },
    ],
    faqs: [
      {
        question: 'How is a MuleSoft 3-tier architecture counted in interface sizing?',
        answer:
          'In a standard MuleSoft 3-tier architecture, 1 System API + 1 Experience API + 1 Process API is treated as 1 composite integration interface, assuming business transformations occur in the process layer.',
      },
      {
        question: 'Can DataWeave scripts be directly converted?',
        answer:
          'Yes, our IntSwitch conversion engine translates DataWeave mapping logic into equivalent Groovy/JavaScript expressions and SAP IS Message Mappings with automated validation.',
      },
    ],
  },

  'sap-neo-cpi': {
    id: 'sap-neo-cpi',
    slug: 'sap-neo-cpi',
    name: 'SAP CPI (Neo)',
    shortTitle: 'SAP CPI (Neo)',
    fullName: 'Neo to SAP Integration Suite Starter Migration Packages',
    heroTitle: 'SAP CPI (Neo) Migration Packages',
    heroSubtitle:
      'Migrate from SAP Neo CPI to SAP BTP Integration Suite (Multi-Cloud / Cloud Foundry) with proven methodology, accelerators and expert support.',
    logo: '/images/logos/logo_neo_cpi.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    cardBullets: [
      { text: 'Predefined migration packages', iconType: 'chart' },
      { text: 'Proven accelerators and best practices', iconType: 'gear' },
      { text: 'Reduced effort and faster migration', iconType: 'database' },
    ],
    packages: {
      hasStarter: false,
      packageNames: {
        silver: 'Package 1 – SILVER (Technical Migration)',
        gold: 'Package 2 – GOLD (Technical Migration)',
        platinum: 'Package 3 – PLATINUM (Technical Migration + Capped Enhancement)',
      },
      rows: [
        {
          feature: 'Number of interfaces to be migrated',
          silver: '25',
          gold: '60',
          platinum: '100',
          highlight: true,
        },
        {
          feature: 'Number of Applications to be supported',
          silver: 'Up to 5',
          gold: 'Up to 10',
          platinum: 'Up to 20',
        },
        {
          feature: 'Enhancement',
          silver: '-',
          gold: '-',
          platinum: '20 hours (simple enhancement)',
        },
        {
          feature: 'Adapters',
          silver: 'Standard Adapters',
          gold: 'Standard adapters + Application adapters support',
          platinum: 'Standard adapters + Application adapters support',
        },
        {
          feature: 'Transport Management (CTMS)',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'BASIS Effort (Setup, CTMS, CC, Documentation)',
          silver:
            'Config & Setup of SAP Integration Suite tenant, CTMS Setup for CF, CC configuration support, Best migration approach, plan & documentation',
          gold:
            'Config & Setup of SAP Integration Suite tenant, CTMS Setup for CF, CC configuration support, Best migration approach, plan & documentation',
          platinum:
            'Config & Setup of SAP Integration Suite tenant, CTMS Setup for CF, CC configuration support, Best migration approach, plan & documentation',
        },
        {
          feature: 'Enablement Sessions',
          silver:
            'Integration Suite Overview Sessions, KT Session on interfaces developed, Support with Naming conventions for A2A, Standard TSD documents',
          gold:
            'Overview sessions, KT on developed interfaces, Naming conventions for B2B/TPM/A2A/API-M, Standard TSD, API-M & Reuse Strategy, Mapping docs, Extended 1 wk hypercare',
          platinum:
            'Overview sessions, KT on developed interfaces, Naming conventions for B2B/TPM/A2A/API-M, API-M & Reuse Strategy, Standard & custom TSD, Mapping docs, Extended 1 wk hypercare, Daily reports',
        },
        {
          feature: 'Alerting',
          silver: 'Error alerting by Mail',
          gold: 'Error alerting by Mail',
          platinum: 'Error alerting by Mail',
        },
        {
          feature: 'Hypercare Support',
          silver: '2 weeks',
          gold: '3 weeks',
          platinum: '3 weeks',
        },
        {
          feature: 'Estimated Timelines',
          silver: '3 months',
          gold: '4.5 months',
          platinum: '6 months',
          highlight: true,
        },
        {
          feature: 'Team Composition',
          silver: 'Project Manager, Integration Consultants, BASIS',
          gold: 'Project Manager, Integration Consultants, BASIS',
          platinum: 'Project Manager, Integration Consultants, BASIS',
        },
        {
          feature: 'Costing (Indicative) (in USD)',
          silver: '25K',
          gold: '55K',
          platinum: '70K',
          highlight: true,
        },
      ],
    },
    pleaseNotes: [
      'The migration to SAP Integration Suite packages are indicative, timeline, cost and plans may vary based on the actual requirement, interface complexity breakup and availability of resources during the time of migration.',
      'Complexity Break up is assumed to be S : M : L/XL :: 60% : 30% : 10%.',
      'Any Enhancements apart or Development work apart from SAP IS, is not in-Scope.',
    ],
    whatsIncluded: {
      title: "What's Included in Neo to Multi-Cloud Migration",
      description: 'Rapid technical migration from Neo CPI to Cloud Foundry with zero interface disruption.',
      items: [
        {
          category: 'Tenant Modernization & Infrastructure',
          details: [
            'Provisioning and hardening of SAP BTP Cloud Foundry tenant',
            'Migration of security artifacts (keystores, credentials, PGP keys)',
            'Cloud Connector subaccount reconfiguration and route mapping',
          ],
        },
        {
          category: 'Package & Content Migration',
          details: [
            'Bulk export of integration packages from Neo and re-import to CF',
            'Adapter upgrade to latest multi-cloud compliant specifications',
            'Verification of Groovy script dependencies and runtime compatibility',
          ],
        },
      ],
    },
    migrationApproach: [
      {
        stepNumber: 1,
        title: 'Tenant Provisioning & Cloud Connector',
        duration: 'Month 1',
        description: 'Configure destination CF tenant, Cloud Connector, and security material.',
        deliverables: ['CF Foundation Readiness', 'Security Keystore Transfer'],
      },
      {
        stepNumber: 2,
        title: 'iFlow Migration & Adapter Modernization',
        duration: 'Months 2-3',
        description: 'Deploy integration packages, rebind JMS queues, and inspect custom scripts.',
        deliverables: ['Deployed Multi-cloud Packages', 'CTMS Transport Pipeline'],
      },
      {
        stepNumber: 3,
        title: 'Validation, Cutover & Hypercare',
        duration: 'Months 3-4.5',
        description: 'Validate message routing, perform DNS/endpoint repointing, and initiate hypercare.',
        deliverables: ['Cutover Runbook', 'Post-go-live Hypercare Report'],
      },
    ],
    enablementAndSupport: [
      {
        category: 'Neo vs Multi-Cloud Operational Guidance',
        summary: 'Understand the architectural enhancements of the modern Cloud Foundry environment.',
        highlights: [
          'Detailed overview of Cloud Foundry subaccounts, spaces, and role collections',
          'KT on Cloud Transport Management Service (CTMS) replacing legacy file exports',
          'Standardized technical architecture documentation',
        ],
      },
      {
        category: 'Post-Migration Support',
        summary: '2 to 3 weeks of active stabilization support.',
        highlights: ['Mail alerting verification', 'Daily monitoring and operational check-ins'],
      },
    ],
    faqs: [
      {
        question: 'Why is migrating off SAP Neo CPI urgent?',
        answer:
          'SAP Neo environment has reached its retirement phase. Organizations must migrate to SAP BTP Cloud Foundry/Multi-Cloud to preserve support, access Edge Integration Cell, and use AI features.',
      },
      {
        question: 'Does Neo migration require rebuilding iFlows from scratch?',
        answer:
          'No. Most Neo iFlows can be migrated using automated export/import scripts with adjustments to security credentials, adapters, and Cloud Connector routes.',
      },
    ],
  },

  boomi: {
    id: 'boomi',
    slug: 'boomi',
    name: 'Boomi',
    shortTitle: 'Dell Boomi',
    fullName: 'Boomi Migration Packages',
    heroTitle: 'Boomi Migration Packages',
    heroSubtitle:
      'Migrate from Dell Boomi to SAP BTP Integration Suite with proven methodology, accelerators and expert support.',
    logo: '/images/logos/logo_boomi.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    cardBullets: [
      { text: 'Simplify and modernize integrations', iconType: 'link' },
      { text: 'Industry best practices', iconType: 'gear' },
      { text: 'Optimized cost and effort', iconType: 'chart' },
    ],
    packages: {
      hasStarter: true,
      packageNames: {
        starter: 'Starter Package',
        silver: 'SILVER (Small Scope)',
        gold: 'GOLD (Medium Scope)',
        platinum: 'PLATINUM (Large Scope)',
      },
      rows: [
        {
          feature: 'Number of Interfaces',
          starter: '10 Golden Interfaces',
          silver: '40',
          gold: '80',
          platinum: '110',
          highlight: true,
        },
        {
          feature: 'Number of Applications',
          starter: 'Up to 2',
          silver: 'Up to 5',
          gold: 'Up to 12',
          platinum: 'Up to 25',
        },
        {
          feature: 'Platform Setup',
          starter: 'Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Trading Partner / Transaction Onboarding support',
          starter: '1 TP / 1 unique Transaction',
          silver: '10 TP / up to 4 unique Transactions',
          gold: '10 TP / up to 8 unique Transactions',
          platinum: '10+ TP / up to 12 unique Transactions',
        },
        {
          feature: 'Modernization',
          starter:
            'Integration Design & Mapping Modernization, Adapter strategy, Version control for i-Flows, Reusable artifacts (Common iflow for IDocs, Error handling & alerts, Enhanced retry)',
          silver:
            'Starter Scope + Error handling & alerts (standard), JMS retry queue, API-M lead approach (Reusable integrations as managed APIs, Standard Policies)',
          gold:
            'Silver Scope + Standard & customizable alerts, B2B/EDI Modernization (If Applicable), Custom Policy support, Event Driven Architecture (Event Mesh)',
          platinum:
            'Gold Scope + Advanced Event Mesh (EDA), Advanced custom policies, Comprehensive B2B/EDI Modernization',
        },
        {
          feature: 'Transport Management (CTMS)',
          starter: 'Not Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Complexity Support',
          starter: 'Simple',
          silver: 'Simple + Medium',
          gold: 'Simple + Medium + Complex',
          platinum: 'Simple + Medium + Complex',
        },
        {
          feature: 'Adapters Included',
          starter: 'Standard adapters (HTTP, SOAP, REST, SFTP, IDoc)',
          silver: 'Standard adapters (HTTP, SOAP, REST, SFTP, IDoc)',
          gold: 'Standard + Application adapters (Ariba, SF, OData, S/4) + AS2',
          platinum: 'All standard + application adapters + AS2',
        },
        {
          feature: 'IntSwitch : Assessment & Migration tool (Internal)',
          starter: 'Supported',
          silver: 'Supported',
          gold: 'Supported',
          platinum: 'Supported',
        },
        {
          feature: 'Mapping Conversion',
          starter: 'Graphical Mapping',
          silver: 'Graphical & XSLT, UDF supported',
          gold: 'Graphical, XSLT + Js & Groovy conversion + UDF supported',
          platinum: 'All: Graphical, XSLT, Java mapping conversion to Groovy + UDF supported',
        },
        {
          feature: 'Enhancements / New requirements',
          starter: 'NA',
          silver: 'NA',
          gold: 'Support for new developments equivalent to 3 PD efforts + 2 Change requests',
          platinum: 'Support for new developments equivalent to 5 PD efforts + 3 Change requests',
        },
        {
          feature: 'Monitoring & Logging',
          starter: 'Supported',
          silver: 'Supported (API-M Monitoring - standard)',
          gold: 'Supported (Customer alerts, API-M Monitoring - customized)',
          platinum: 'Supported (Customer alerts, Customized API-M Logging, IntSwitch Quality & Governance dashboards)',
        },
        {
          feature: 'Hypercare Support',
          starter: '2 weeks',
          silver: '2 weeks',
          gold: '3 weeks',
          platinum: '3 weeks',
        },
        {
          feature: 'Estimated Timeline',
          starter: '2 months',
          silver: '4 months',
          gold: '6–8 months',
          platinum: '9–12 months',
          highlight: true,
        },
        {
          feature: 'Team Composition',
          starter: 'PM + Integration Developer + BASIS',
          silver: 'PM + 2 Integration Developers + BASIS',
          gold: 'PM + Lead + 2 Integration Developers + Architect + BASIS',
          platinum: 'PM + Architect + Lead + 3 Integration Developers + BASIS & Security',
        },
        {
          feature: 'Indicative Pricing (USD)',
          starter: '28K',
          silver: '61K',
          gold: '127K',
          platinum: '180K',
          highlight: true,
        },
      ],
    },
    pleaseNotes: [
      'The migration to SAP Integration Suite packages are indicative, timeline, cost and plans may vary based on the actual requirement, interface complexity breakup and availability of resources during the time of migration.',
      'Complexity Break up is assumed to be S : M : L/XL :: 60% : 30% : 10%.',
      'Any Enhancements apart or Development work apart from SAP IS, is not in-Scope.',
    ],
    whatsIncluded: {
      title: "What's Included in Boomi Migration",
      description: 'End-to-end migration of Boomi Atoms, processes, profiles, and trading partner setups.',
      items: [
        {
          category: 'Atom & Component Modernization',
          details: [
            'Conversion of Boomi XML/JSON profiles into SAP Integration Suite message structures',
            'Replacement of Boomi Atom runtimes with Cloud Integration and Edge Integration Cells',
            'Re-implementation of Boomi Process logic using modular, standardized iFlows',
          ],
        },
        {
          category: 'Trading Partner & Security',
          details: [
            'Migration of Boomi Trading Partner profiles into SAP Trading Partner Management (TPM)',
            'Certificate and credential migration to BTP security material',
          ],
        },
      ],
    },
    migrationApproach: [
      {
        stepNumber: 1,
        title: 'Process Discovery & Mapping',
        duration: 'Month 1',
        description: 'Catalog all Boomi Atoms, deployed processes, connectors, and scheduled jobs.',
        deliverables: ['Boomi Component Inventory', 'Target iFlow Blueprint'],
      },
      {
        stepNumber: 2,
        title: 'Tenant & Security Setup',
        duration: 'Month 2',
        description: 'Configure Cloud Connector, security credentials, and CTMS transport routes.',
        deliverables: ['Foundation Tenant Configuration', 'Security Setup Sign-off'],
      },
      {
        stepNumber: 3,
        title: 'Sprint-based Migration',
        duration: 'Months 3-8',
        description: 'Migrate processes, transform mappings, and configure alerts in iterative waves.',
        deliverables: ['Tested iFlow Packages', 'Regression Test Reports'],
      },
      {
        stepNumber: 4,
        title: 'Cutover & Hypercare',
        duration: 'Months 9-11',
        description: 'Production cutover window, partner testing, and 3-week hypercare support.',
        deliverables: ['Cutover Protocol', 'Operational Handover'],
      },
    ],
    enablementAndSupport: [
      {
        category: 'Boomi to SAP Integration Suite Enablement',
        summary: 'Comprehensive knowledge transfer to operate and monitor SAP IS.',
        highlights: [
          'Detailed training on Cloud Integration monitoring replacing Boomi Process Reporting',
          'KT sessions on BTP Trading Partner Management (TPM) and API Management',
          'Architecture and technical documentation handoff',
        ],
      },
      {
        category: 'Post-Migration Hypercare',
        summary: 'Dedicated 2 to 3 weeks of live monitoring support.',
        highlights: [
          'Error alert management and message failure root-cause analysis',
          'Daily hypercare progress reports',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can on-premise Boomi Atoms be replaced with SAP solutions?',
        answer:
          'Yes. On-premises Boomi Atoms can be smoothly transitioned to SAP Edge Integration Cell or Cloud Connector to maintain secure, high-performance private network access.',
      },
      {
        question: 'How are Boomi Trading Partner networks migrated?',
        answer:
          'Boomi Trading Partner components are migrated to SAP BTP Integration Advisor and Trading Partner Management (TPM), leveraging AI to map EDI agreements.',
      },
    ],
  },
};
