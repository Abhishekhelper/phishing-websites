export enum ClassificationResult {
  PHISHING = 'PHISHING',
  LEGITIMATE = 'LEGITIMATE',
  SUSPICIOUS = 'SUSPICIOUS',
}

export interface AnalysisFeature {
  name: string;
  value: string | number | boolean;
  isRisk: boolean;
  description: string;
}

export interface ClassificationReport {
  url: string;
  result: ClassificationResult;
  confidence: number; // 0 to 100
  riskScore: number; // 0 to 100
  features: AnalysisFeature[];
  reasoning: string;
  timestamp: string;
}

export interface AssociationRule {
  antecedents: string[];
  consequent: ClassificationResult;
  support: number;
  confidence: number;
}
