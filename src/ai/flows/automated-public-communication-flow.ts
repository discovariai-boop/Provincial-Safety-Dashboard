'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating automated public communications.
 *
 * - automatedPublicCommunication - A function that generates public updates, press releases, and social media posts.
 * - AutomatedPublicCommunicationInput - The input type for the automatedPublicCommunication function.
 * - AutomatedPublicCommunicationOutput - The return type for the automatedPublicCommunication function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const AutomatedPublicCommunicationInputSchema = z.object({
  incidentType: z.string().describe('The type of incident (e.g., "crash", "heist", "robbery").'),
  incidentLocation: z.string().describe('The location of the incident (e.g., "N1 KM45", "R81 Polokwane").'),
  incidentOutcome: z.string().describe('The outcome of the incident (e.g., "cleared 20min ahead of schedule", "foiled", "resolved quickly").'),
  guardianInvolvement: z.string().describe('How the Guardian system was involved (e.g., "Guardian success", "Guardian AI predicted & prevented").'),
  keyAchievements: z.array(z.string()).describe('A list of key safety achievements or statistics (e.g., "17 lives saved this week", "accident cost reduction: R23M/year projected").'),
  additionalDetails: z.string().optional().describe('Any additional details to include in the communication.'),
});
export type AutomatedPublicCommunicationInput = z.infer<typeof AutomatedPublicCommunicationInputSchema>;

const AutomatedPublicCommunicationOutputSchema = z.object({
  publicUpdate: z.string().describe('A clear and concise public update for general dissemination.'),
  pressReleaseSummary: z.string().describe('A summary for a press release, suitable for media outlets.'),
  socialMediaPost: z.string().describe('A short and engaging post for social media platforms like X (formerly Twitter).'),
});
export type AutomatedPublicCommunicationOutput = z.infer<typeof AutomatedPublicCommunicationOutputSchema>;

export async function automatedPublicCommunication(input: AutomatedPublicCommunicationInput): Promise<AutomatedPublicCommunicationOutput> {
  return automatedPublicCommunicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePublicCommunicationPrompt',
  input: { schema: AutomatedPublicCommunicationInputSchema },
  output: { schema: AutomatedPublicCommunicationOutputSchema },
  model: googleAI.model('gemini-2.5-flash'),
  prompt: `You are the Premier's communication officer for the Limpopo Provincial Intelligent Safety and Traffic Hub (LPISTH). Your task is to generate clear, concise, and positive public communications based on incident outcomes and key safety achievements.

Generate three distinct outputs: a public update, a press release summary, and a social media post.

## Incident Details:
- Type: {{{incidentType}}}
- Location: {{{incidentLocation}}}
- Outcome: {{{incidentOutcome}}}
- Guardian Involvement: {{{guardianInvolvement}}}
{{#if additionalDetails}}
- Additional Details: {{{additionalDetails}}}
{{/if}}

## Key Achievements:
{{#each keyAchievements}}
- {{{this}}}
{{/each}}

---

### Instructions for Public Update:
- Keep it brief and factual.
- Highlight the positive outcome and Guardian's role.
- Start with an ✅ emoji.

### Instructions for Press Release Summary:
- Provide a slightly more formal and detailed summary.
- Emphasize LPISTH's effectiveness and impact.
- Mention key achievements.

### Instructions for Social Media Post:
- Keep it very short, engaging, and use relevant emojis.
- Include hashtags like #LimpopoSafety #GuardianApp.`,
});

const automatedPublicCommunicationFlow = ai.defineFlow(
  {
    name: 'automatedPublicCommunicationFlow',
    inputSchema: AutomatedPublicCommunicationInputSchema,
    outputSchema: AutomatedPublicCommunicationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
