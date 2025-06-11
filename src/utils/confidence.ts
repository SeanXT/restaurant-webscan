export function calculateOverallConfidence(confidenceScores: Record<string, number>): number {
  const values = Object.values(confidenceScores);
  return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
}

export function getConfidenceLabel(score: number): string {
  if (score >= 90) return 'Very High';
  if (score >= 75) return 'High';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'Low';
  return 'Very Low';
}