import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, GitBranch, Package, TestTube, Upload } from "lucide-react";

const stages = [
  {
    icon: GitBranch,
    title: "1. Source",
    desc: "Developer pushes code to the main branch on GitHub.",
    detail: "Trigger: push or PR to main",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: TestTube,
    title: "2. Test",
    desc: "Install Python dependencies and run pytest suite.",
    detail: "pytest tests/ -v",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Package,
    title: "3. Build",
    desc: "Build the Docker image from the Dockerfile.",
    detail: "docker build -t wholesale-erp .",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: Upload,
    title: "4. Deploy",
    desc: "Push image to ECR and update ECS service (future).",
    detail: "Diagram-only for this demo",
    color: "text-emerald-600 bg-emerald-50",
  },
];

const githubActionsYml = `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: pytest tests/ -v

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t wholesale-erp .`;

export default function CICD() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold">CI/CD Pipeline</h1>
        <p className="text-sm text-muted-foreground">{"GitHub Actions — Continuous Integration & Deployment"}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {stages.map((s, i) => (
          <Card key={s.title} className="relative">
            <CardContent className="p-4">
              <div className={`p-2 rounded-lg w-fit ${s.color} mb-3`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-sm">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
              <Badge variant="outline" className="mt-2 text-xs font-mono">{s.detail}</Badge>
            </CardContent>
            {i < stages.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-3 text-muted-foreground">{"→"}</div>
            )}
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          <h3 className="font-heading font-semibold text-sm">GitHub Actions Workflow</h3>
          <p className="text-xs text-muted-foreground">.github/workflows/ci.yml</p>
          <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            <code>{githubActionsYml}</code>
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <h3 className="font-heading font-semibold mb-3">Pipeline Summary</h3>
          <div className="space-y-3">
            {[
              "Code is pushed to GitHub repository",
              "GitHub Actions triggers the workflow automatically",
              "Python dependencies are installed from requirements.txt",
              "Pytest runs all API endpoint tests",
              "If tests pass, Docker image is built",
              "Image can be pushed to AWS ECR for deployment",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}