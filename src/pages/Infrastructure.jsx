import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

function CodeBlock({ code, filename }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1">
      {filename && <p className="text-xs text-muted-foreground font-mono">{filename}</p>}
      <div className="relative group">
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 bg-slate-800 hover:bg-slate-700"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3 text-slate-400" />}
        </Button>
      </div>
    </div>
  );
}

// ── Terraform ──────────────────────────────────────────────────────────────

const tfVariables = `# variables.tf
variable "db_password" {
  type      = string
  sensitive = true
}

variable "my_ip" {
  type    = string
  default = "0.0.0.0/0"   # restrict to YOUR_IP/32 in production
}`;

const tfVpc = `# vpc.tf
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = { Name = "wholesale-vpc" }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "wholesale-igw" }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true
  tags = { Name = "public-subnet" }
}

# Private Subnet
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1a"
  tags = { Name = "private-subnet" }
}

# Public Route Table -> Internet Gateway
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = { Name = "public-rt" }
}

resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Private Route Table (local traffic only, no IGW)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id
  tags   = { Name = "private-rt" }
}

resource "aws_route_table_association" "private" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private.id
}`;

const tfSg = `# security_groups.tf

# EC2 Security Group
resource "aws_security_group" "web" {
  name   = "sg-web"
  vpc_id = aws_vpc.main.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "sg-web" }
}

# RDS Security Group — only allows EC2 to connect
resource "aws_security_group" "db" {
  name   = "sg-db"
  vpc_id = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.web.id]
  }

  tags = { Name = "sg-db" }
}`;

const tfEc2 = `# ec2.tf
resource "aws_instance" "app" {
  ami                         = "ami-0c02fb55956c7d316"  # Amazon Linux 2 (us-east-1)
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public.id
  vpc_security_group_ids      = [aws_security_group.web.id]
  associate_public_ip_address = true

  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y docker
    service docker start
    usermod -a -G docker ec2-user
  EOF

  tags = { Name = "wholesale-app-server" }
}

output "app_public_ip" {
  value = aws_instance.app.public_ip
}`;

const tfRds = `# rds.tf
resource "aws_db_subnet_group" "main" {
  name       = "wholesale-db-subnet-group"
  subnet_ids = [aws_subnet.private.id]
}

resource "aws_db_instance" "postgres" {
  identifier           = "wholesale-db"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  allocated_storage    = 20
  db_name              = "wholesale"
  username             = "admin"
  password             = var.db_password
  skip_final_snapshot  = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  tags = { Name = "wholesale-rds" }
}`;

// ── Docker ──────────────────────────────────────────────────────────────────

const dockerfile = `FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`;

const dockerCompose = `version: "3.8"

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://admin:password@db:5432/wholesale
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: wholesale
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`;

// ── Tests ────────────────────────────────────────────────────────────────────

const pytestCode = `# tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_customers():
    response = client.get("/customers")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_customer():
    payload = {"name": "Test Corp", "contact": "Jane", "email": "jane@test.com"}
    response = client.post("/customers", json=payload)
    assert response.status_code == 201

def test_get_products():
    response = client.get("/products")
    assert response.status_code == 200

def test_get_inventory():
    response = client.get("/inventory")
    assert response.status_code == 200`;

// ── FastAPI ──────────────────────────────────────────────────────────────────

const fastapiCode = `# main.py  (simplified)
from fastapi import FastAPI
from database import get_db
from routers import customers, products, inventory, auth

app = FastAPI(title="Wholesale ERP API")

app.include_router(auth.router)
app.include_router(customers.router, prefix="/customers")
app.include_router(products.router,  prefix="/products")
app.include_router(inventory.router, prefix="/inventory")`;

export default function Infrastructure() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold">Infrastructure as Code</h1>
        <p className="text-sm text-muted-foreground">Terraform, Docker, FastAPI, and pytest — minimal and assignment-focused</p>
      </div>

      <Tabs defaultValue="terraform">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="terraform">Terraform</TabsTrigger>
          <TabsTrigger value="docker">Docker</TabsTrigger>
          <TabsTrigger value="app">FastAPI</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
        </TabsList>

        {/* ── TERRAFORM ── */}
        <TabsContent value="terraform" className="mt-4 space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
            Five files cover everything: variables → VPC/subnets/routes → security groups → EC2 → RDS. No extras.
          </div>
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">variables.tf</h3>
            <CodeBlock code={tfVariables} filename="variables.tf" />
          </CardContent></Card>

          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">VPC, Subnets, Route Tables</h3>
            <p className="text-xs text-muted-foreground">Public subnet routes to IGW. Private subnet has local-only routing — database is unreachable from the internet.</p>
            <CodeBlock code={tfVpc} filename="vpc.tf" />
          </CardContent></Card>

          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Security Groups</h3>
            <p className="text-xs text-muted-foreground">sg-web allows HTTP and SSH. sg-db allows Postgres only from sg-web — not from the internet.</p>
            <CodeBlock code={tfSg} filename="security_groups.tf" />
          </CardContent></Card>

          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">EC2 Instance</h3>
            <p className="text-xs text-muted-foreground">t2.micro in the public subnet. User data installs Docker on first boot.</p>
            <CodeBlock code={tfEc2} filename="ec2.tf" />
          </CardContent></Card>

          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">RDS PostgreSQL</h3>
            <p className="text-xs text-muted-foreground">db.t3.micro in the private subnet group. Password comes from variables.tf.</p>
            <CodeBlock code={tfRds} filename="rds.tf" />
          </CardContent></Card>
        </TabsContent>

        {/* ── DOCKER ── */}
        <TabsContent value="docker" className="mt-4 space-y-4">
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Dockerfile</h3>
            <p className="text-xs text-muted-foreground">Simple Python image — install deps, copy code, start uvicorn.</p>
            <CodeBlock code={dockerfile} filename="Dockerfile" />
          </CardContent></Card>
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">docker-compose.yml</h3>
            <p className="text-xs text-muted-foreground">Simulates EC2 (app) + RDS (db) locally for development and testing.</p>
            <CodeBlock code={dockerCompose} filename="docker-compose.yml" />
          </CardContent></Card>
        </TabsContent>

        {/* ── FASTAPI ── */}
        <TabsContent value="app" className="mt-4 space-y-4">
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">FastAPI Entry Point</h3>
            <p className="text-xs text-muted-foreground">Four routers only: auth, customers, products, inventory. Nothing else.</p>
            <CodeBlock code={fastapiCode} filename="main.py" />
          </CardContent></Card>
        </TabsContent>

        {/* ── TESTS ── */}
        <TabsContent value="tests" className="mt-4 space-y-4">
          <Card><CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">pytest — Basic API Tests</h3>
            <p className="text-xs text-muted-foreground">Four simple tests — one per module. Enough to validate CI/CD passes before a Docker build.</p>
            <CodeBlock code={pytestCode} filename="tests/test_api.py" />
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}