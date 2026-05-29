import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the Security Agent — a senior penetration tester and security engineer.
You think like an attacker. You find vulnerabilities before they are exploited.
You reference OWASP Top 10, CWE, CVE databases, and NIST standards.
You always provide a remediation with code, not just a finding.`;

export class SecurityAgent extends BaseAgent {
  constructor() {
    super("security", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "owasp_audit",
      description: "Full OWASP Top 10 security audit of code or architecture.",
      prompt: (task) => `Perform OWASP Top 10 audit on:\n${task}\n\nCheck each:\n1. Broken Access Control\n2. Cryptographic Failures\n3. Injection (SQL, NoSQL, Command, LDAP)\n4. Insecure Design\n5. Security Misconfiguration\n6. Vulnerable Components\n7. Authentication Failures\n8. Data Integrity Failures\n9. Logging Failures\n10. SSRF\n\nFor each finding: Severity | CWE | Location | PoC | Fix with code.`,
    });

    this.registerSkill({
      name: "threat_model",
      description: "STRIDE threat modeling for a system or feature.",
      prompt: (task) => `Threat model using STRIDE for:\n${task}\n\nFor each threat category:\n- Spoofing: who could impersonate what\n- Tampering: what data could be modified\n- Repudiation: what actions can't be attributed\n- Information Disclosure: what data could leak\n- Denial of Service: what can be overwhelmed\n- Elevation of Privilege: how can access be escalated\n\nOutput risk matrix: Threat | Likelihood | Impact | Mitigation`,
    });

    this.registerSkill({
      name: "pentest_api",
      description: "Penetration test an API for common vulnerabilities.",
      prompt: (task) => `Pentest this API:\n${task}\n\nTest for:\n- BOLA/IDOR (access other users' resources)\n- Broken function-level auth (access admin endpoints)\n- Mass assignment (extra fields in body)\n- Rate limiting bypass\n- JWT attacks (none algorithm, weak secret)\n- GraphQL introspection + batching attacks\n- HTTP verb tampering\n- Response data leakage\n\nProvide: curl PoC for each finding.`,
    });

    this.registerSkill({
      name: "injection_audit",
      description: "Audit for all injection vulnerabilities (SQL, NoSQL, command, XSS, template).",
      prompt: (task) => `Injection audit:\n${task}\n\nTest:\n- SQL injection (UNION, blind, time-based)\n- NoSQL injection (MongoDB operator injection)\n- Command injection\n- LDAP injection\n- XSS (reflected, stored, DOM)\n- Server-Side Template Injection\n- XXE (XML External Entity)\n- SSTI\n\nFor each: payload example + secure fix with code.`,
    });

    this.registerSkill({
      name: "secrets_audit",
      description: "Scan for hardcoded secrets, keys, and sensitive data in code.",
      prompt: (task) => `Secrets audit:\n${task}\n\nScan for:\n- API keys (AWS, Stripe, Google, etc.)\n- Passwords and passphrases\n- Private keys and certificates\n- Database connection strings\n- JWT secrets\n- OAuth tokens\n- .env values committed to code\n- Base64-encoded credentials\n\nFor each: location, severity, rotation steps.`,
    });

    this.registerSkill({
      name: "auth_audit",
      description: "Audit authentication and authorization implementation.",
      prompt: (task) => `Auth audit:\n${task}\n\nCheck:\n- Password hashing algorithm and cost factor\n- Session management (fixation, hijacking)\n- JWT implementation (algorithm, expiry, rotation)\n- OAuth 2.0 flow security\n- MFA implementation\n- Brute force protection\n- Account enumeration via timing/responses\n- Password reset flow security\n- Remember-me functionality\n\nRate each: SECURE | WEAK | BROKEN.`,
    });

    this.registerSkill({
      name: "dependency_cve_scan",
      description: "Check dependencies for known CVEs and security advisories.",
      prompt: (task) => `CVE scan for dependencies:\n${task}\n\nFor each dependency:\n- Known CVEs (CVSS score, description)\n- Fixed version\n- Exploitability in this context\n- Priority: PATCH_NOW | PATCH_SOON | MONITOR\n\nAlso flag: transitive dependency risks.`,
    });

    this.registerSkill({
      name: "cors_csp_audit",
      description: "Audit CORS policy and Content Security Policy headers.",
      prompt: (task) => `CORS and CSP audit:\n${task}\n\nCORS check:\n- Is Access-Control-Allow-Origin: * used unsafely\n- Are credentials allowed with wildcard origin\n- Pre-flight handling correct\n\nCSP check:\n- Is CSP header present\n- unsafe-inline or unsafe-eval present\n- Does it block XSS effectively\n- Recommend strict CSP policy\n\nProvide hardened header examples.`,
    });

    this.registerSkill({
      name: "encryption_audit",
      description: "Audit encryption at rest and in transit.",
      prompt: (task) => `Encryption audit:\n${task}\n\nCheck:\n- TLS version (must be 1.2+, prefer 1.3)\n- Cipher suite strength\n- Certificate validity\n- HSTS header\n- Data at rest encryption\n- Key management and rotation\n- Sensitive fields encrypted in DB\n- PII handling compliance\n\nProvide recommendations with code examples.`,
    });
  }
}
