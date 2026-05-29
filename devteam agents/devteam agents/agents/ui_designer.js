import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the UI Designer — a product designer who creates beautiful, accessible, and functional interfaces.
You write production-ready React components with proper styling. You follow design systems and modern patterns.
You make decisions based on visual hierarchy, affordance, and usability — not aesthetics alone.`;

export class UiDesignerAgent extends BaseAgent {
  constructor() {
    super("ui_designer", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "design_component",
      description: "Design and implement a React UI component.",
      prompt: (task) => `Design and implement this component:\n${task}\n\nProvide:\n- React component (TypeScript)\n- Props interface\n- All visual states (default, hover, focus, disabled, loading, error)\n- CSS (Tailwind or CSS Modules)\n- Accessibility: aria attributes, keyboard nav\n- Usage examples\n- Storybook story`,
    });

    this.registerSkill({
      name: "design_system",
      description: "Create a design system with tokens, components, and guidelines.",
      prompt: (task) => `Create design system for:\n${task}\n\nDefine:\n- Color tokens (primary, secondary, semantic: error/warning/success)\n- Typography scale\n- Spacing scale\n- Border radius and shadow tokens\n- Component variants (size, color, shape)\n- Dark mode variables\n- CSS custom properties (--var)\n- Usage guidelines\n\nProvide: theme file + example components.`,
    });

    this.registerSkill({
      name: "design_dashboard",
      description: "Design a data dashboard layout with charts and metrics.",
      prompt: (task) => `Design dashboard for:\n${task}\n\nInclude:\n- Layout grid (sidebar + main + header)\n- Metric cards (KPI display)\n- Chart components (line, bar, pie — specify data shape)\n- Table with sorting and pagination\n- Filter panel\n- Responsive breakpoints\n- Loading skeleton states\n\nProvide: complete React implementation.`,
    });

    this.registerSkill({
      name: "design_form",
      description: "Design a multi-step form with validation and UX best practices.",
      prompt: (task) => `Design form for:\n${task}\n\nInclude:\n- Field layout with proper labels\n- Inline validation messages\n- Character counters where relevant\n- Multi-step progress indicator\n- Error summary at top\n- Submit state (loading, success, error)\n- Auto-focus management\n- Form library integration (react-hook-form)\n\nProvide: complete implementation.`,
    });

    this.registerSkill({
      name: "design_landing_page",
      description: "Design a landing page with hero, features, and CTA sections.",
      prompt: (task) => `Design landing page for:\n${task}\n\nSections:\n- Hero (headline, subtext, CTA, visual)\n- Social proof (logos or testimonials)\n- Feature highlights (3-4 key features)\n- How it works (steps)\n- Pricing or CTA section\n- Footer\n\nStyle: modern, clean, conversion-focused.\nProvide: complete HTML+CSS or React implementation.`,
    });

    this.registerSkill({
      name: "responsive_layout",
      description: "Implement responsive layouts with mobile-first approach.",
      prompt: (task) => `Implement responsive layout for:\n${task}\n\nBreakpoints:\n- Mobile: 320px+\n- Tablet: 768px+\n- Desktop: 1024px+\n- Wide: 1440px+\n\nHandle:\n- Navigation collapse (hamburger)\n- Grid reflow\n- Typography scaling\n- Image sizing\n- Touch targets (min 44px)\n\nProvide: CSS Grid + Flexbox implementation.`,
    });

    this.registerSkill({
      name: "animation_design",
      description: "Add meaningful motion and micro-interactions.",
      prompt: (task) => `Design animations for:\n${task}\n\nAdd:\n- Page/route transitions\n- Component mount/unmount animations\n- Hover micro-interactions\n- Loading states (skeleton, spinner, progress)\n- Success/error feedback animations\n- Scroll-triggered animations\n\nUse: CSS transitions, Framer Motion, or React Spring.\nFollow: prefers-reduced-motion media query.`,
    });
  }
}
