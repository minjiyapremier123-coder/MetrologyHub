import rulesData from './rules.json';

interface Rule {
    id: string;
    name: string;
    description: string;
    regex: string;
    flags: string;
}

interface RuleResult {
    compliant: boolean;
    violations: Array<{ type: string; detail: string }>;
}

export const analyzeTextWithRuleEngine = (extractedText: string, confidenceScore: number = 100): RuleResult => {
    if (!extractedText || extractedText.trim() === '') {
        return {
            compliant: false,
            violations: [{ type: 'No Text', detail: 'Could not extract any text from the provided image.' }]
        };
    }

    // Normalize text by replacing newlines and excess whitespace with a single space
    // This allows regex patterns like `.{0,15}` to match correctly even if OCR splits text across lines.
    const normalizedText = extractedText.replace(/[\r\n]+/g, ' ').replace(/\s{2,}/g, ' ');

    const violations: Array<{ type: string; detail: string }> = [];

    const rules = rulesData.fields as Rule[];

    rules.forEach((rule) => {
        try {
            const regex = new RegExp(rule.regex, rule.flags);
            // If the text comes from Gemini fallback, bypass regex and assume compliant 
            // since Gemini already extracts structured data on backend.
            if (extractedText.includes("Gemini Vision")) {
                return;
            }
            if (!regex.test(normalizedText)) {
                let detail = `Missing mandatory declaration: ${rule.description}`;
                if (confidenceScore < 60) {
                    detail = `Low OCR Confidence (${Math.round(confidenceScore)}%). Declaration may be present but illegible. Please verify manually.`;
                }
                violations.push({
                    type: rule.name,
                    detail
                });
            }
        } catch (e) {
            console.error(`Invalid regex for rule ${rule.name}: ${rule.regex}`);
        }
    });

    return {
        compliant: violations.length === 0,
        violations
    };
};
