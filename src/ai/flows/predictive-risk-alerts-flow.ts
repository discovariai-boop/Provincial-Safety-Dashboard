'use server';
/**
 * @fileOverview A Genkit flow for predicting high-risk areas and potential incidents, generating actionable alerts for the Premier's Office.
 *
 * - predictiveRiskAlerts - A function that handles the prediction and alert generation process.
 * - PredictiveRiskAlertsInput - The input type for the predictiveRiskAlerts function.
 * - PredictiveRiskAlertsOutput - The return type for the predictiveRiskAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const PredictiveRiskAlertsInputSchema = z.object({
  currentIncidents: z.array(z.object({
    id: z.string().describe('Unique ID of the incident.'),
    type: z.string().describe('Type of incident (e.g., "Crash", "Heist", "Robbery").'),
    location: z.string().describe('Descriptive location of the incident (e.g., "N1 KM45", "R81 Polokwane").'),
    severity: z.string().describe('Severity of the incident (e.g., "Critical", "Medium").'),
    status: z.string().describe('Current status (e.g., "Active", "En Route").'),
    etaPolice: z.string().optional().describe('Estimated Time of Arrival for Police.'),
    etaAmbulance: z.string().optional().describe('Estimated Time of Arrival for Ambulance.'),
  })).describe('List of current active incidents.'),
  historicalDataSummary: z.string().describe('Summary of historical incident patterns and high-risk zones. E.g., "R81 Polokwane frequently experiences cash heists between 18:00-20:00 on weekdays. N1 Rural has drunk driving peaks between 22:00-02:00 on weekends."'),
  externalFeedsSummary: z.string().describe('Summary of relevant external data like traffic and weather conditions. E.g., "Heavy traffic congestion on N1 Northbound. Rainy weather expected in Polokwane area tonight."'),
});
export type PredictiveRiskAlertsInput = z.infer<typeof PredictiveRiskAlertsInputSchema>;

const PredictiveRiskAlertsOutputSchema = z.object({
  alerts: z.array(z.object({
    id: z.string().describe('A unique identifier for the alert.'),
    riskLevel: z.enum(['CRITICAL', 'WARNING', 'INFO']).describe('The severity of the alert.'),
    location: z.string().describe('The location or area affected by the alert.'),
    message: z.string().describe('A concise message describing the predicted risk.'),
    suggestedAction: z.string().describe('An actionable suggestion for preemptive measures.'),
    confidence: z.string().optional().describe('Confidence level of the prediction (e.g., "84%", "High").'),
  })).describe('List of generated predictive alerts.'),
});
export type PredictiveRiskAlertsOutput = z.infer<typeof PredictiveRiskAlertsOutputSchema>;

export async function predictiveRiskAlerts(input: PredictiveRiskAlertsInput): Promise<PredictiveRiskAlertsOutput> {
  return predictiveRiskAlertsFlow(input);
}

const predictiveRiskAlertsPrompt = ai.definePrompt({
  name: 'predictiveRiskAlertsPrompt',
  input: {schema: PredictiveRiskAlertsInputSchema},
  output: {schema: PredictiveRiskAlertsOutputSchema},
  model: 'googleai/gemini-2.5-flash',
  prompt: `You are an advanced AI assistant for the Limpopo Premier's Office, specialized in predictive analytics for safety and traffic management. Your goal is to analyze real-time incident data, historical patterns, and external environmental factors to predict potential high-risk areas or incidents. Based on your analysis, you must generate concise, actionable alerts with suggested preemptive measures to help the Premier deploy resources effectively and prevent crises.

Here is the current operational data:

Current Active Incidents:
{{#if currentIncidents}}
  {{#each currentIncidents}}
    - ID: {{this.id}}, Type: {{this.type}}, Location: {{this.location}}, Severity: {{this.severity}}, Status: {{this.status}}
    {{#if this.etaPolice}} ETA Police: {{this.etaPolice}}{{/if}}
    {{#if this.etaAmbulance}} ETA Ambulance: {{this.etaAmbulance}}{{/if}}
  {{/each}}
{{else}}
  No active incidents reported.
{{/if}}

Historical Data Summary:
{{{historicalDataSummary}}}

External Feeds Summary (Traffic, Weather, etc.):
{{{externalFeedsSummary}}}

Based on this information, identify potential risks, high-risk windows, and hotspots. Then, generate a list of predictive alerts. Each alert must include a 'riskLevel' (CRITICAL, WARNING, INFO), 'location', a 'message' describing the predicted risk, and a 'suggestedAction' for preemptive measures. Include a 'confidence' level if applicable.

Focus on proactive measures and resource deployment.`,
});

const predictiveRiskAlertsFlow = ai.defineFlow(
  {
    name: 'predictiveRiskAlertsFlow',
    inputSchema: PredictiveRiskAlertsInputSchema,
    outputSchema: PredictiveRiskAlertsOutputSchema,
  },
  async input => {
    const {output} = await predictiveRiskAlertsPrompt(input);
    return output!;
  }
);
