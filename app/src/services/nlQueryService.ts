import type { ProviderConfig, ChatMessage } from '../types';
import { MessageSender } from '../types';
import { queryLLM } from './geminiService';
import { searchICD11WithFallback, getAllICD11Codes, getICD11ByCode } from './icd11Service';
import { searchICF, getAllICFCodes, getICFByCode } from './icfService';
import { searchICHI, getAllICHICodes, getICHIByCode } from './ichiService';

export interface NLQueryResult {
  classificationType: 'icd11' | 'icf' | 'ichi';
  codes: string[];
  explanations: string[];
  rawResponse: string;
}

const SYSTEM_PROMPT = `You are a WHO-FIC (WHO Family of International Classifications) expert.
Given a natural language query, identify which classification system(s) the user is asking about
and return ONLY a JSON object in this exact format (no markdown, no other text):

{
  "classificationType": "icd11" | "icf" | "ichi",
  "reasoning": "brief explanation",
  "searchTerms": ["term1", "term2"],
  "possibleCodes": ["code1", "code2"]
}

- ICD-11: Diseases, disorders, injuries, health conditions
- ICF: Functioning, disability, body functions/structures, activities, participation, environmental factors
- ICHI: Health interventions, procedures, surgeries, treatments, therapies

Respond with ONLY the JSON object, nothing else.`;

export async function naturalLanguageQuery(
  query: string,
  config: ProviderConfig,
): Promise<NLQueryResult> {
  const messages: ChatMessage[] = [
    { id: 'nlq-sys', text: SYSTEM_PROMPT, sender: MessageSender.SYSTEM, timestamp: new Date() },
    { id: 'nlq-user', text: query, sender: MessageSender.USER, timestamp: new Date() },
  ];

  try {
    const raw = await queryLLM(messages, config, undefined, SYSTEM_PROMPT);
    const cleaned = raw.replace(/```(?:json)?\s*/gi, '').trim();
    const parsed = JSON.parse(cleaned);

    const codes: string[] = parsed.possibleCodes || [];
    const searchTerms: string[] = parsed.searchTerms || [];
    const explanations: string[] = [];
    const classificationType = parsed.classificationType || 'icd11';

    if (codes.length > 0) {
      for (const code of codes) {
        let entry;
        if (classificationType === 'icf') entry = getICFByCode(code);
        else if (classificationType === 'ichi') entry = getICHIByCode(code);
        else entry = getICD11ByCode(code);
        if (entry) {
          explanations.push(`${entry.code}: ${entry.title} — ${entry.description.slice(0, 120)}`);
        }
      }
    }

    if (explanations.length === 0 && searchTerms.length > 0) {
      for (const term of searchTerms) {
        let results;
        if (classificationType === 'icf') results = searchICF(term);
        else if (classificationType === 'ichi') results = searchICHI(term);
        else results = await searchICD11WithFallback(term);
        if (results && results.length > 0) {
          results.slice(0, 3).forEach((r: any) => {
            explanations.push(`${r.code}: ${r.title} — ${(r.description || '').slice(0, 120)}`);
          });
        }
      }
    }

    if (explanations.length === 0) {
      if (classificationType === 'icf') {
        const all = getAllICFCodes();
        explanations.push(`Found ${all.length} ICF codes. Try a more specific query.`);
      } else if (classificationType === 'ichi') {
        const all = getAllICHICodes();
        explanations.push(`Found ${all.length} ICHI codes. Try a more specific query.`);
      } else {
        const all = getAllICD11Codes();
        explanations.push(`Found ${all.length} ICD-11 codes. Try a more specific query.`);
      }
    }

    return { classificationType, codes, explanations, rawResponse: cleaned };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    const fallbackResults = await searchICD11WithFallback(query);
    return {
      classificationType: 'icd11',
      codes: fallbackResults.slice(0, 5).map((r) => r.code),
      explanations: fallbackResults.slice(0, 5).map((r) => `${r.code}: ${r.title} — ${r.description.slice(0, 120)}`),
      rawResponse: `LLM query failed (${msg}), fell back to local search`,
    };
  }
}
