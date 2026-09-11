import { PlatformType } from '@/types';

export type PlatformId = 'sap-pipo' | 'mulesoft' | 'sap-neo' | 'boomi';

export interface PlatformOption {
  id: PlatformId;
  name: PlatformType;
  cardTitle: string;
  description: string;
  logo: string;
  cloudLogo: string;
  currentTco: number;
  targetTco: number;
  annualSavingsPct: number;
  annualSavingsUsd: number;
  paybackMonths: string;
  paybackExact: string;
  fiveYearRoi: string;
  fiveYearNetBenefit: string;
}

export const SUPPORTED_PLATFORMS: PlatformOption[] = [
  {
    id: 'sap-pipo',
    name: 'SAP PI/PO',
    cardTitle: 'SAP PI/PO → SAP BTP',
    description: 'Discover the business value of migrating and modernizing your SAP PI/PO landscape.',
    logo: '/images/logos/logo_sap_pipo.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    currentTco: 730000,
    targetTco: 313084,
    annualSavingsPct: 57.11,
    annualSavingsUsd: 416916,
    paybackMonths: '< 9 Months',
    paybackExact: '8.6 Months',
    fiveYearRoi: '594.86%',
    fiveYearNetBenefit: '$1,784,580',
  },
  {
    id: 'mulesoft',
    name: 'MuleSoft',
    cardTitle: 'MuleSoft → SAP BTP',
    description: 'Discover the business value of migrating your MuleSoft integrations to SAP BTP Integration Suite.',
    logo: '/images/logos/logo_mulesoft.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    currentTco: 850000,
    targetTco: 335000,
    annualSavingsPct: 60.59,
    annualSavingsUsd: 515000,
    paybackMonths: '< 8 Months',
    paybackExact: '7.8 Months',
    fiveYearRoi: '620.40%',
    fiveYearNetBenefit: '$2,225,000',
  },
  {
    id: 'sap-neo',
    name: 'SAP CPI (Neo)',
    cardTitle: 'SAP CPI (Neo) → SAP BTP',
    description: 'Discover the business value of migrating and modernizing your SAP CPI (Neo) integrations.',
    logo: '/images/logos/diagram_sap_neo.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    currentTco: 420000,
    targetTco: 215000,
    annualSavingsPct: 48.81,
    annualSavingsUsd: 205000,
    paybackMonths: '< 6 Months',
    paybackExact: '5.8 Months',
    fiveYearRoi: '482.50%',
    fiveYearNetBenefit: '$900,000',
  },
  {
    id: 'boomi',
    name: 'Boomi',
    cardTitle: 'Boomi → SAP BTP',
    description: 'Discover the business value of migrating your Boomi integrations to SAP BTP Integration Suite.',
    logo: '/images/logos/diagram_boomi.png',
    cloudLogo: '/images/logos/logo_btp_cloud.png',
    currentTco: 680000,
    targetTco: 295000,
    annualSavingsPct: 56.62,
    annualSavingsUsd: 385000,
    paybackMonths: '< 9 Months',
    paybackExact: '8.4 Months',
    fiveYearRoi: '543.20%',
    fiveYearNetBenefit: '$1,605,000',
  },
];

export interface IncturePackageTier {
  id: string;
  name: string;
  price: number;
  durationWeeks: number;
  scopeSummary: string;
  recommendedFor: string;
  interfaceLimit: string;
  applicationLimit: string;
}

export interface IntSwitchOpportunityInfo {
  title: string;
  subtitle: string;
  scopeDescription: string;
  automationScope: string;
  capabilities: string[];
}

export interface PlatformConfig {
  id: PlatformId;
  name: PlatformType;
  step2Title: string;
  step2Description: string;
  step5Title: string;
  step5Description: string;
  defaultTco: number;
  defaultCostBreakdown: {
    licensing: number;
    infrastructure: number;
    support: number;
    operations: number;
    development: number;
    other: number;
  };
  packages: IncturePackageTier[];
  intSwitch: IntSwitchOpportunityInfo;
}

export const PLATFORM_CONFIGS: Record<PlatformId, PlatformConfig> = {
  'sap-pipo': {
    id: 'sap-pipo',
    name: 'SAP PI/PO',
    step2Title: 'Assess your current SAP PI/PO environment',
    step2Description: 'Help us understand your PI/PO landscape, integration footprint, and complexity.',
    step5Title: 'Enter your current annual SAP PI/PO costs',
    step5Description: 'Provide the estimated annual costs for your SAP PI/PO landscape across licensing, infrastructure, support, and operations.',
    defaultTco: 730000,
    defaultCostBreakdown: {
      licensing: 250000,
      infrastructure: 160000,
      support: 160000,
      operations: 160000,
      development: 0,
      other: 0,
    },
    packages: [
      {
        id: 'starter',
        name: 'Starter Package',
        price: 19000,
        durationWeeks: 6,
        scopeSummary: 'Up to 10 Golden Interfaces with mixed complexity',
        recommendedFor: 'Initial pilot migration, POC validation, and low-footprint single-stack environments.',
        interfaceLimit: 'Up to 10 Interfaces',
        applicationLimit: 'Up to 2 Applications',
      },
      {
        id: 'silver',
        name: 'SILVER (Small Scope)',
        price: 65000,
        durationWeeks: 12,
        scopeSummary: '50 Interfaces with mixed complexity',
        recommendedFor: 'Targeted business unit migrations, standard A2A interfaces, and early wave delivery.',
        interfaceLimit: 'Up to 50 Interfaces',
        applicationLimit: 'Up to 5 Applications',
      },
      {
        id: 'gold',
        name: 'GOLD (Medium Scope)',
        price: 110000,
        durationWeeks: 18,
        scopeSummary: '100 Interfaces with mixed complexity & B2B/EDI',
        recommendedFor: 'Comprehensive enterprise landscape modernization with multi-system integrations.',
        interfaceLimit: 'Up to 100 Interfaces',
        applicationLimit: 'Up to 10 Applications',
      },
      {
        id: 'platinum',
        name: 'PLATINUM (Large Scope)',
        price: 145000,
        durationWeeks: 24,
        scopeSummary: '150 Interfaces with complex mappings & high volume',
        recommendedFor: 'Large-scale core modernization, complex dual-stack ccBPM migration, and multi-ERP environments.',
        interfaceLimit: 'Up to 150 Interfaces',
        applicationLimit: 'Up to 15 Applications',
      },
    ],
    intSwitch: {
      title: 'IntSwitch™ Migration & Validation Opportunity',
      subtitle: 'Identify opportunities for migration automation and validation',
      scopeDescription: 'Accelerate applicable migration, testing, and quality-monitoring activities.',
      automationScope: 'Applicable PO golden template conversion, test automation, and runtime quality monitoring.',
      capabilities: [
        'Accelerate applicable migration, testing, and quality-monitoring activities.',
        'Automated PO golden template conversion for Dual-Stack & Single-Stack landscapes.',
        'Automated regression testing against historical PI/PO message payloads.',
        'Runtime interface validation & quality monitoring post-cutover.',
      ],
    },
  },
  'mulesoft': {
    id: 'mulesoft',
    name: 'MuleSoft',
    step2Title: 'Assess your current MuleSoft environment',
    step2Description: 'Help us understand your MuleSoft API footprint, application network, and integration architecture.',
    step5Title: 'Enter your current annual MuleSoft costs',
    step5Description: 'Provide the estimated annual costs for your MuleSoft landscape across licensing/subscriptions, infrastructure, support, and operations.',
    defaultTco: 850000,
    defaultCostBreakdown: {
      licensing: 380000,
      infrastructure: 180000,
      support: 140000,
      operations: 150000,
      development: 0,
      other: 0,
    },
    packages: [
      {
        id: 'starter',
        name: 'Starter Package',
        price: 29000,
        durationWeeks: 8,
        scopeSummary: 'Up to 10 APIs / Mule flows (System/Process/Experience)',
        recommendedFor: 'Pilot API migration and validating BTP API Management & Cloud Integration.',
        interfaceLimit: 'Up to 10 APIs',
        applicationLimit: 'Up to 2 Applications',
      },
      {
        id: 'silver',
        name: 'SILVER (Small Scope)',
        price: 68500,
        durationWeeks: 14,
        scopeSummary: '40 APIs / Mule flows with mapping conversion',
        recommendedFor: 'Standard application network modernization and API gateway consolidation.',
        interfaceLimit: 'Up to 40 APIs',
        applicationLimit: 'Up to 5 Applications',
      },
      {
        id: 'gold',
        name: 'GOLD (Medium Scope)',
        price: 135000,
        durationWeeks: 20,
        scopeSummary: '80 APIs / Mule flows with B2B/EDI & custom connectors',
        recommendedFor: 'Enterprise MuleSoft decommissioning with multi-tier API-led architectures.',
        interfaceLimit: 'Up to 80 APIs',
        applicationLimit: 'Up to 10 Applications',
      },
      {
        id: 'platinum',
        name: 'PLATINUM (Large Scope)',
        price: 185000,
        durationWeeks: 26,
        scopeSummary: '120 APIs with complex DataWeave, RTF & high volume',
        recommendedFor: 'Full-scale enterprise migration from CloudHub/RTF to SAP BTP Integration Suite.',
        interfaceLimit: 'Up to 120 APIs',
        applicationLimit: 'Up to 15 Applications',
      },
    ],
    intSwitch: {
      title: 'IntSwitch™ Assessment & Migration Opportunity',
      subtitle: 'Identify opportunities for migration automation and validation',
      scopeDescription: 'Assessment & migration support, including applicable mapping conversion and testing.',
      automationScope: 'Applicable RAML/OAS API conversion, DataWeave mapping migration, and API regression testing.',
      capabilities: [
        'Assessment & migration support, including applicable mapping conversion and testing.',
        'Automated RAML & OpenAPI spec conversion to SAP BTP API definitions.',
        'Assisted DataWeave transformation logic migration to Groovy / Message Mapping.',
        'Automated API contract validation and regression testing across endpoints.',
      ],
    },
  },
  'sap-neo': {
    id: 'sap-neo',
    name: 'SAP CPI (Neo)',
    step2Title: 'Assess your current SAP CPI (Neo) environment',
    step2Description: 'Help us understand your SAP CPI (Neo) tenant footprint, custom iFlows, and artifact inventory.',
    step5Title: 'Enter your current annual SAP CPI (Neo) costs',
    step5Description: 'Provide the estimated annual costs for your SAP CPI (Neo) landscape across tenant subscriptions, infrastructure, support, and operations.',
    defaultTco: 420000,
    defaultCostBreakdown: {
      licensing: 180000,
      infrastructure: 80000,
      support: 80000,
      operations: 80000,
      development: 0,
      other: 0,
    },
    packages: [
      {
        id: 'silver',
        name: 'SILVER (Small Scope)',
        price: 25000,
        durationWeeks: 8,
        scopeSummary: 'Up to 30 iFlows across standard Neo subaccounts',
        recommendedFor: 'Initial wave migration from Neo to Multi-Cloud Cloud Foundry/Kyma.',
        interfaceLimit: 'Up to 30 iFlows',
        applicationLimit: 'Up to 3 Subaccounts',
      },
      {
        id: 'gold',
        name: 'GOLD (Medium Scope)',
        price: 55000,
        durationWeeks: 14,
        scopeSummary: 'Up to 75 iFlows with custom Groovy scripts & value mappings',
        recommendedFor: 'Medium-scale Neo landscape migration with automated secret and adapter re-binding.',
        interfaceLimit: 'Up to 75 iFlows',
        applicationLimit: 'Up to 6 Subaccounts',
      },
      {
        id: 'platinum',
        name: 'PLATINUM (Large Scope)',
        price: 70000,
        durationWeeks: 18,
        scopeSummary: 'Up to 120 iFlows with complex security artifacts & partner adapters',
        recommendedFor: 'Complete enterprise Neo tenant decommissioning and multi-cloud cutover.',
        interfaceLimit: 'Up to 120 iFlows',
        applicationLimit: 'Up to 10 Subaccounts',
      },
    ],
    intSwitch: {
      title: 'IntSwitch™ Neo-to-Multi-Cloud Opportunity',
      subtitle: 'Identify opportunities for migration automation and validation',
      scopeDescription: 'Automated artifact extraction, script conversion, and regression testing.',
      automationScope: 'Automated 1-click artifact extraction from Neo, credential re-binding, and script compatibility verification.',
      capabilities: [
        'Automated artifact extraction, script conversion, and regression testing.',
        '1-click extraction of integration packages, custom iFlows, and value mappings from Neo.',
        'Automated Keystore, credential, and adapter re-binding for Multi-Cloud BTP.',
        'Groovy script compatibility verification and regression test automation.',
      ],
    },
  },
  'boomi': {
    id: 'boomi',
    name: 'Boomi',
    step2Title: 'Assess your current Boomi environment',
    step2Description: 'Help us understand your Boomi AtomSphere environment, processes, connectors, and runtime landscape.',
    step5Title: 'Enter your current annual Boomi costs',
    step5Description: 'Provide the estimated annual costs for your Boomi landscape across licensing/subscriptions, infrastructure, support, and operations.',
    defaultTco: 680000,
    defaultCostBreakdown: {
      licensing: 300000,
      infrastructure: 140000,
      support: 110000,
      operations: 130000,
      development: 0,
      other: 0,
    },
    packages: [
      {
        id: 'starter',
        name: 'Starter Package',
        price: 28000,
        durationWeeks: 8,
        scopeSummary: 'Up to 15 Boomi Processes & 3 standard connectors',
        recommendedFor: 'Pilot conversion of Boomi Atom processes to SAP Integration Suite iFlows.',
        interfaceLimit: 'Up to 15 Processes',
        applicationLimit: 'Up to 3 Connectors',
      },
      {
        id: 'silver',
        name: 'SILVER (Small Scope)',
        price: 61000,
        durationWeeks: 14,
        scopeSummary: 'Up to 45 Processes & 6 connectors with custom map shapes',
        recommendedFor: 'Targeted integration domain migration with automated shape conversion.',
        interfaceLimit: 'Up to 45 Processes',
        applicationLimit: 'Up to 6 Connectors',
      },
      {
        id: 'gold',
        name: 'GOLD (Medium Scope)',
        price: 127000,
        durationWeeks: 20,
        scopeSummary: 'Up to 90 Processes with B2B/EDI & Molecule runtime migration',
        recommendedFor: 'Core enterprise Boomi replacement with hybrid atom & private cloud runtimes.',
        interfaceLimit: 'Up to 90 Processes',
        applicationLimit: 'Up to 12 Connectors',
      },
      {
        id: 'platinum',
        name: 'PLATINUM (Large Scope)',
        price: 180000,
        durationWeeks: 26,
        scopeSummary: 'Up to 140 Processes with complex scripting & multi-environment cutover',
        recommendedFor: 'Enterprise-wide Boomi migration, custom SDK connector migration, and high-volume messaging.',
        interfaceLimit: 'Up to 140 Processes',
        applicationLimit: 'Up to 20 Connectors',
      },
    ],
    intSwitch: {
      title: 'IntSwitch™ Process Modernization Opportunity',
      subtitle: 'Identify opportunities for migration automation and validation',
      scopeDescription: 'Assessment & migration support, including connector mapping conversion and automated flow validation.',
      automationScope: 'Applicable Boomi process shape mapping, connector translation, and automated payload validation.',
      capabilities: [
        'Assessment & migration support, including connector mapping conversion and automated flow validation.',
        'Automated conversion of Boomi process shapes & map shapes into SAP Integration Suite iFlows.',
        'Boomi connector mapping to SAP Integration Suite Open Connectors & adapters.',
        'Automated payload regression testing across target BTP integration endpoints.',
      ],
    },
  },
};

export const COMMON_BTP_PRICING = {
  currency: 'USD',
  pricingVersion: '2026.1-Official',
  effectiveDate: 'September 2026',
  editions: [
    {
      id: 'starter',
      name: 'Starter Edition',
      monthlyPrice: 1728,
      annualizedPrice: 20736,
      threeYearPrice: 62208,
      fiveYearPrice: 103680,
      includedMessagesPerMonth: 50000,
      description: 'Ideal for organizations requiring core Cloud Integration and prebuilt content with a 10 custom iFlow entitlement.',
      keyCapabilities: [
        'Cloud Integration (up to 10 custom iFlows)',
        '3,400+ Prebuilt Integrations on SAP Business Accelerator Hub',
        'Unlimited SAP-to-SAP free message volume with prebuilt content',
        'Standard adapters: HTTP, HTTPS, SOAP, OData, SFTP, ProcessDirect, Mail, XI, IDoc, RFC',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Edition',
      monthlyPrice: 5339,
      annualizedPrice: 64068,
      threeYearPrice: 192204,
      fiveYearPrice: 320340,
      includedMessagesPerMonth: 10000,
      description: 'The enterprise integration baseline supporting full API Lifecycle Management, B2B/EDI, and hybrid Edge Integration Cell runtimes.',
      keyCapabilities: [
        'Everything in Starter Edition with unlimited custom integration flows',
        'End-to-end API Lifecycle Management & Developer Portal',
        'B2B/EDI libraries, trading partner management, and Integration Advisor',
        'Edge Integration Cell runtime for private/on-premise execution',
        'Open Connectors with 160+ third-party SaaS applications',
        'Async message queues & business event connectivity',
      ],
    },
    {
      id: 'enhanced',
      name: 'Enhanced Edition',
      monthlyPrice: 7688,
      annualizedPrice: 92256,
      threeYearPrice: 276768,
      fiveYearPrice: 461280,
      includedMessagesPerMonth: 500000,
      description: 'Comprehensive high-scale tier including Advanced Event Mesh, AI-powered integration generation, ANS, and automated transport management.',
      keyCapabilities: [
        'Everything in Standard Edition + 500,000 included messages/month',
        '1 × Advanced Event Mesh (AEM 100) tenant included',
        'Integration Suite AI: natural-language iFlow generation & script optimization',
        'SAP Alert Notification Service (ANS) with 100K API calls/month',
        'SAP Cloud Transport Management (TMS) with 25 GB/month',
        'SAP Document AI (100 documents/month)',
        'API anomaly detection & traffic prediction governance',
      ],
    },
  ],
  addons: {
    additionalMessagesPer10kBlockMonthly: 7,
    additionalMessagesPer10kBlockAnnualized: 84,
    additionalEdgeIntegrationCellMonthly: 3455,
    additionalEdgeIntegrationCellAnnualized: 41460,
    dataSpaceIntegrationMonthly: 75,
    dataSpaceIntegrationAnnualized: 900,
    advancedEventMeshTiers: [
      { id: 'aem-100', name: 'AEM 100', connections: 100, spoolGb: 10, monthlyPrice: 2440, annualizedPrice: 29280 },
      { id: 'aem-250', name: 'AEM 250', connections: 250, spoolGb: 25, monthlyPrice: 4914, annualizedPrice: 58968 },
      { id: 'aem-1k', name: 'AEM 1K', connections: 1000, spoolGb: 50, monthlyPrice: 9510, annualizedPrice: 114120 },
      { id: 'aem-5k', name: 'AEM 5K', connections: 5000, spoolGb: 200, monthlyPrice: 13184, annualizedPrice: 158208 },
      { id: 'aem-10k', name: 'AEM 10K', connections: 10000, spoolGb: 300, monthlyPrice: 15889, annualizedPrice: 190668 },
      { id: 'aem-50k', name: 'AEM 50K', connections: 50000, spoolGb: 500, monthlyPrice: 23670, annualizedPrice: 284040 },
      { id: 'aem-100k', name: 'AEM 100K', connections: 100000, spoolGb: 500, monthlyPrice: 28865, annualizedPrice: 346380 },
    ],
  },
};

export const COMMON_REQUIREMENTS_QUESTIONS = [
  {
    id: 'b2bEdi',
    question: '1. Do you require B2B / EDI electronic interchange & trading partner management?',
    category: 'B2B/EDI',
    mapsToEdition: 'Standard',
    tooltip: 'Standard and Enhanced include B2B electronic interchange libraries, acknowledgment framework, and Integration Advisor.',
  },
  {
    id: 'apiManagement',
    question: '2. Do you require full-lifecycle API Management and Developer Portals?',
    category: 'API Management',
    mapsToEdition: 'Standard',
    tooltip: 'API lifecycle governance, security policies, and API portals are included in Standard and Enhanced.',
  },
  {
    id: 'thirdPartySaas',
    question: '3. Do you require prebuilt connectivity to third-party SaaS applications (160+ apps)?',
    category: 'Open Connectors',
    mapsToEdition: 'Standard',
    tooltip: 'Open Connectors provides prebuilt connectors to Salesforce, ServiceNow, Workday, and 160+ apps.',
  },
  {
    id: 'privateRuntime',
    question: '4. Do you require a private on-premises or private cloud integration runtime (Edge Integration Cell)?',
    category: 'Hybrid Runtime',
    mapsToEdition: 'Standard',
    tooltip: 'Edge Integration Cell allows executing integration content locally in your own Kubernetes environment.',
  },
  {
    id: 'asyncMessaging',
    question: '5. Do you require asynchronous reliable messaging queues?',
    category: 'Reliable Messaging',
    mapsToEdition: 'Standard',
    tooltip: 'Enables durable queuing and asynchronous decoupling between applications.',
  },
  {
    id: 'eventDriven',
    question: '6. Do you require event-driven architecture with business event publishing & consumption?',
    category: 'Event-Driven',
    mapsToEdition: 'Standard',
    tooltip: 'Publish and consume business events to connect systems in near real-time.',
  },
  {
    id: 'integrationAdvisor',
    question: '7. Do you require AI-assisted integration mapping (Integration Advisor)?',
    category: 'Advisor',
    mapsToEdition: 'Standard',
    tooltip: 'AI-assisted mapping knowledge base accelerating B2B/EDI interfaces.',
  },
  {
    id: 'integrationAssessment',
    question: '8. Do you require systematic enterprise integration governance (Integration Assessment tool)?',
    category: 'Governance',
    mapsToEdition: 'Standard',
    tooltip: 'Guided design and execution of enterprise integration strategy.',
  },
  {
    id: 'advancedEventMesh',
    question: '9. Do you require high-throughput Advanced Event Mesh (AEM 100 tenant)?',
    category: 'Event Mesh',
    mapsToEdition: 'Enhanced',
    tooltip: 'One AEM 100 tenant is included directly in the Enhanced Edition.',
  },
  {
    id: 'documentProcessing',
    question: '10. Do you require automated document extraction using SAP Document AI?',
    category: 'Document AI',
    mapsToEdition: 'Enhanced',
    tooltip: '100 documents per month included in Enhanced Edition.',
  },
  {
    id: 'cloudTransport',
    question: '11. Do you require centralized dev/test to production transport management (SAP Cloud TMS)?',
    category: 'Transport Management',
    mapsToEdition: 'Enhanced',
    tooltip: '25 GB per month included in Enhanced Edition.',
  },
  {
    id: 'alertNotification',
    question: '12. Do you require proactive operational event alerts (SAP Alert Notification Service)?',
    category: 'Operational Alerts',
    mapsToEdition: 'Enhanced',
    tooltip: '100K API calls per month included in Enhanced Edition.',
  },
  {
    id: 'aiCapabilities',
    question: '13. Do you require Integration Suite AI features (natural-language iFlow generation & script optimization)?',
    category: 'Generative AI',
    mapsToEdition: 'Enhanced',
    tooltip: 'Generative AI capabilities for iFlow generation and script refactoring in Enhanced Edition.',
  },
];
