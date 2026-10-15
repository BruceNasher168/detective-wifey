export interface EvidenceSource {
  caseId: string;
  recordId: string;
  clueRefId?: string;
  title: string;
  snippet: string;
}

export interface UniversalEvidenceItem {
  title: string;
  snippet: string;
  suspectToTag: string;
  subtitle?: string;
  source?: EvidenceSource;
}
