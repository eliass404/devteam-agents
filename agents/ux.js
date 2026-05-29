import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the UX Agent — a user experience specialist focused on flows, accessibility, and usability.
You champion the user. You remove friction, improve clarity, and ensure no user is left behind.
You reference WCAG 2.1 AA, Nielsen's heuristics, and cognitive load theory in your work.`;

export class UxAgent extends BaseAgent {
  constructor() {
    super("ux_agent", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "user_flow",
      description: "Map complete user flows including edge cases and error states.",
      prompt: (task) => `Map user flow for:\n${task}\n\nInclude:\n- Entry points (how user arrives)\n- Decision nodes\n- Happy path\n- Error paths (validation, network, auth)\n- Empty states\n- Success states\n- Exit points\n\nFormat as text-based flow diagram. Note friction points.`,
    });

    this.registerSkill({
      name: "accessibility_audit",
      description: "WCAG 2.1 AA accessibility audit with fixes.",
      prompt: (task) => `Accessibility audit for:\n${task}\n\nCheck WCAG 2.1 AA:\n- 1.1.1 Non-text content (alt text)\n- 1.3.1 Info & relationships (semantic HTML)\n- 1.4.3 Contrast ratio (4.5:1 text, 3:1 UI)\n- 2.1.1 Keyboard accessible\n- 2.4.4 Link purpose\n- 3.3.1 Error identification\n- 4.1.2 Name, role, value (ARIA)\n\nFor each failure: element + WCAG criterion + fix with code.`,
    });

    this.registerSkill({
      name: "ux_heuristic_review",
      description: "Review UI against Nielsen's 10 usability heuristics.",
      prompt: (task) => `Heuristic review of:\n${task}\n\nEvaluate each heuristic:\n1. Visibility of system status\n2. Match between system and real world\n3. User control and freedom\n4. Consistency and standards\n5. Error prevention\n6. Recognition over recall\n7. Flexibility and efficiency\n8. Aesthetic and minimal design\n9. Error recovery\n10. Help and documentation\n\nRate: PASS | PARTIAL | FAIL. Provide fix for each failure.`,
    });

    this.registerSkill({
      name: "onboarding_design",
      description: "Design a user onboarding flow for a new product or feature.",
      prompt: (task) => `Design onboarding for:\n${task}\n\nCreate:\n- Welcome screen (value proposition)\n- Progressive disclosure of features\n- First action prompt (quick win)\n- Tooltips and contextual hints\n- Empty state design (what to show before user has data)\n- Progress indicator\n- Skip option\n- Success moment\n\nProvide: screen-by-screen copy + interaction description.`,
    });

    this.registerSkill({
      name: "error_ux",
      description: "Design comprehensive error states and recovery flows.",
      prompt: (task) => `Design error UX for:\n${task}\n\nFor each error type:\n- 400 Validation: inline, specific, correctable\n- 401 Auth: redirect to login, preserve intent\n- 403 Permission: explain why, offer path forward\n- 404 Not found: helpful suggestion, don't dead-end\n- 500 Server: apologize, retry option, status page link\n- Network offline: detect, show offline UI, queue actions\n- Timeout: retry with progress\n\nWrite the actual copy + interaction pattern.`,
    });

    this.registerSkill({
      name: "copy_writing",
      description: "Write UX microcopy: labels, CTAs, error messages, empty states.",
      prompt: (task) => `Write UX microcopy for:\n${task}\n\nProvide copy for:\n- Button labels (action-oriented, specific)\n- Form field labels and placeholders\n- Helper text\n- Error messages (human, specific, actionable)\n- Empty states (explain why empty + action)\n- Success messages\n- Confirmation dialogs\n- Tooltips\n\nTone: friendly, clear, minimal. No jargon.`,
    });

    this.registerSkill({
      name: "mobile_ux",
      description: "Review and improve mobile user experience.",
      prompt: (task) => `Mobile UX review for:\n${task}\n\nCheck:\n- Touch target sizes (min 44x44px)\n- Thumb zone reachability\n- Scroll behavior\n- Input behavior on mobile (keyboard type, autocomplete)\n- Gestures (swipe, pinch)\n- Offline handling\n- Performance on 3G\n- One-handed usability\n\nProvide: issues + specific fixes.`,
    });
  }
}
