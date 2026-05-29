import { BaseAgent } from "../core/base_agent.js";

const SYSTEM = `You are the DevOps Agent — an infrastructure and platform engineer expert in CI/CD, containers, and cloud.
You automate everything. You build reliable, reproducible pipelines and infrastructure.
You are fluent in Docker, GitHub Actions, Terraform, AWS/GCP/Azure, and Kubernetes.`;

export class DevOpsAgent extends BaseAgent {
  constructor() {
    super("devops", SYSTEM);
    this._registerSkills();
  }

  _registerSkills() {
    this.registerSkill({
      name: "write_dockerfile",
      description: "Write an optimized multi-stage Dockerfile.",
      prompt: (task) => `Write Dockerfile for:\n${task}\n\nRequirements:\n- Multi-stage build (build vs runtime image)\n- Minimal final image (alpine/distroless)\n- Layer caching optimization\n- Non-root user\n- HEALTHCHECK\n- .dockerignore file\n- Security: no secrets in layers\n- Label with version/commit info\n\nAlso provide: docker-compose.yml for local dev.`,
    });

    this.registerSkill({
      name: "ci_cd_pipeline",
      description: "Create a complete CI/CD pipeline with GitHub Actions.",
      prompt: (task) => `Create CI/CD pipeline for:\n${task}\n\nGitHub Actions workflow:\n- Trigger: push to main, PRs\n- Lint + type check\n- Unit + integration tests\n- Security scan (trivy, snyk)\n- Build Docker image\n- Push to registry\n- Deploy to staging\n- Run smoke tests\n- Deploy to production (with manual approval)\n- Rollback on failure\n\nProvide: complete .github/workflows/deploy.yml`,
    });

    this.registerSkill({
      name: "kubernetes_manifests",
      description: "Write Kubernetes deployment manifests.",
      prompt: (task) => `Write K8s manifests for:\n${task}\n\nInclude:\n- Deployment (replicas, resource limits, health checks)\n- Service (ClusterIP or LoadBalancer)\n- Ingress with TLS\n- HorizontalPodAutoscaler\n- ConfigMap for env vars\n- Secret for credentials\n- PersistentVolumeClaim if needed\n- NetworkPolicy`,
    });

    this.registerSkill({
      name: "terraform_infra",
      description: "Write Terraform infrastructure as code.",
      prompt: (task) => `Write Terraform for:\n${task}\n\nProvide:\n- Provider configuration\n- VPC and networking\n- Compute resources\n- Database (RDS or managed)\n- Load balancer\n- IAM roles and policies\n- S3 buckets with lifecycle policies\n- CloudWatch alarms\n- Output values\n- Variables file with descriptions`,
    });

    this.registerSkill({
      name: "monitoring_setup",
      description: "Set up monitoring, alerting, and observability.",
      prompt: (task) => `Set up monitoring for:\n${task}\n\nConfigure:\n- Metrics (Prometheus + Grafana or Datadog)\n- Key dashboards (HTTP rate, latency, errors, CPU/RAM)\n- Log aggregation (ELK or Loki)\n- Distributed tracing (Jaeger or OTEL)\n- Alerts with thresholds and PagerDuty integration\n- SLO definitions (99.9% uptime = 43 min/month downtime)\n- Runbooks for each alert`,
    });

    this.registerSkill({
      name: "secrets_management",
      description: "Implement secrets management and rotation.",
      prompt: (task) => `Implement secrets management for:\n${task}\n\nUsing: HashiCorp Vault or AWS Secrets Manager\n\nCover:\n- Secret storage and encryption\n- Access policy (least privilege)\n- Secret rotation schedule\n- Application integration (env injection)\n- Audit logging\n- Emergency access procedure\n- Secret scanning in git (pre-commit hooks)\n\nProvide: configuration + application code.`,
    });

    this.registerSkill({
      name: "zero_downtime_deploy",
      description: "Design zero-downtime deployment strategy.",
      prompt: (task) => `Design zero-downtime deployment for:\n${task}\n\nStrategy:\n- Blue/green or canary deployment\n- Database migration compatibility check\n- Feature flag integration\n- Health check configuration\n- Traffic shifting plan\n- Rollback procedure (< 5 min)\n- Session handling during deploy\n- Queue draining\n\nProvide: deployment scripts + runbook.`,
    });

    this.registerSkill({
      name: "log_management",
      description: "Set up structured logging and log analysis.",
      prompt: (task) => `Set up logging for:\n${task}\n\nImplement:\n- Structured JSON logging (winston or pino)\n- Log levels per environment\n- Request ID correlation across services\n- Sensitive data redaction (PII, tokens)\n- Log shipping (Fluentd or Logstash)\n- Retention policy\n- Query examples in Kibana/CloudWatch\n\nProvide: logger setup code + deployment config.`,
    });
  }
}
