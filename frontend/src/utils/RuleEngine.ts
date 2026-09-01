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

export const analyzeTextWithRuleEngine = (extractedText: string): RuleResult => {
    if (!extractedText || extractedText.trim() === '') {
        return {
            compliant: false,
            violations: [{ type: 'No Text', detail: 'Could not extract any text from the provided image.' }]
        };
    }

    const violations: Array<{ type: string; detail: string }> = [];

    const rules = rulesData.fields as Rule[];

    rules.forEach((rule) => {
        try {
            const regex = new RegExp(rule.regex, rule.flags);
            if (!regex.test(extractedText)) {
                violations.push({
                    type: rule.name,
                    detail: `Missing mandatory declaration: ${rule.description}`
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
