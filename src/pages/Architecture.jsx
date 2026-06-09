import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

function ArchDiagram() {
  return (
    <div className="bg-slate-50 rounded-xl p-6 border overflow-x-auto">
      <svg viewBox="0 0 720 480" className="w-full min-w-[560px]" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
          </marker>
        </defs>

        {/* VPC border */}
        <rect x="30" y="50" width="660" height="400" rx="12" stroke="#2563eb" strokeWidth="2" strokeDasharray="8 4" fill="#eff6ff" />
        <text x="50" y="76" fill="#2563eb" fontWeight="600" fontSize="13" fontFamily="Inter, sans-serif">{"AWS VPC  —  10.0.0.0/16"}</text>

        {/* Internet Gateway box at top */}
        <rect x="285" y="10" width="150" height="30" rx="6" fill="#2563eb" />
        <text x="360" y="29" fill="white" fontSize="11" fontFamily="Inter, sans-serif" textAnchor="middle" fontWeight="500">Internet Gateway</text>
        <line x1="360" y1="40" x2="360" y2="90" stroke="#2563eb" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* Public Subnet */}
        <rect x="50" y="95" width="280" height="140" rx="8" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
        <text x="68" y="116" fill="#1e40af" fontWeight="600" fontSize="11" fontFamily="Inter, sans-serif">{"Public Subnet — 10.0.1.0/24"}</text>

        {/* EC2 box */}
        <rect x="80" y="130" width="220" height="80" rx="6" fill="white" stroke="#3b82f6" strokeWidth="1.5" />
        <text x="190" y="156" fill="#1e3a5f" fontSize="12" fontFamily="Inter, sans-serif" textAnchor="middle" fontWeight="600">EC2 Instance</text>
        <text x="190" y="173" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif" textAnchor="middle">FastAPI App (Docker)</text>
        <text x="190" y="188" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">t2.micro  •  Port 8000</text>

        {/* Private Subnet */}
        <rect x="50" y="265" width="280" height="160" rx="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="1.5" />
        <text x="68" y="286" fill="#92400e" fontWeight="600" fontSize="11" fontFamily="Inter, sans-serif">{"Private Subnet — 10.0.2.0/24"}</text>

        {/* RDS box */}
        <rect x="80" y="300" width="220" height="80" rx="6" fill="white" stroke="#f59e0b" strokeWidth="1.5" />
        <text x="190" y="326" fill="#1e3a5f" fontSize="12" fontFamily="Inter, sans-serif" textAnchor="middle" fontWeight="600">RDS PostgreSQL</text>
        <text x="190" y="343" fill="#64748b" fontSize="10" fontFamily="Inter, sans-serif" textAnchor="middle">Private — No Internet Access</text>
        <text x="190" y="358" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="middle">db.t3.micro  •  Port 5432</text>

        {/* Arrow: EC2 → RDS */}
        <line x1="190" y1="210" x2="190" y2="298" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="4 3" />
        <text x="196" y="258" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">DB connection</text>

        {/* Security Groups panel */}
        <rect x="370" y="95" width="290" height="330" rx="8" fill="#f0fdf4" stroke="#86efac" strokeWidth="1.5" />
        <text x="390" y="118" fill="#166534" fontWeight="600" fontSize="12" fontFamily="Inter, sans-serif">Security Groups</text>

        {/* SG Web */}
        <rect x="390" y="130" width="250" height="70" rx="6" fill="white" stroke="#22c55e" strokeWidth="1" />
        <text x="408" y="150" fill="#166534" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">sg-web  (EC2)</text>
        <text x="408" y="167" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Inbound: HTTP :80, SSH :22</text>
        <text x="408" y="181" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Outbound: All traffic allowed</text>

        {/* SG DB */}
        <rect x="390" y="215" width="250" height="70" rx="6" fill="white" stroke="#22c55e" strokeWidth="1" />
        <text x="408" y="235" fill="#166534" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">sg-db  (RDS)</text>
        <text x="408" y="252" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Inbound: PostgreSQL :5432</text>
        <text x="408" y="266" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Source: sg-web only</text>

        {/* Route Tables */}
        <rect x="390" y="300" width="250" height="105" rx="6" fill="white" stroke="#22c55e" strokeWidth="1" />
        <text x="408" y="320" fill="#166534" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Route Tables</text>
        <text x="408" y="338" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500">Public RT:</text>
        <text x="408" y="352" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">{"0.0.0.0/0  →  Internet Gateway"}</text>
        <text x="408" y="370" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="500">Private RT:</text>
        <text x="408" y="384" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Local traffic only (no IGW)</text>
      </svg>
    </div>
  );
}

const services = [
  { name: "VPC (10.0.0.0/16)", desc: "Isolated virtual network. Contains all resources. No traffic in or out unless explicitly allowed." },
  { name: "Public Subnet (10.0.1.0/24)", desc: "Hosts the EC2 app server. Has a route to the Internet Gateway so users can reach the app." },
  { name: "Private Subnet (10.0.2.0/24)", desc: "Hosts RDS PostgreSQL. Has NO route to the internet. Only EC2 (via sg-web) can connect on port 5432." },
  { name: "Internet Gateway", desc: "Attached to the VPC. Allows inbound/outbound internet traffic for the public subnet only." },
  { name: "Security Group: sg-web", desc: "Firewall for EC2. Allows HTTP on port 80 and SSH on port 22 from the internet. All outbound allowed." },
  { name: "Security Group: sg-db", desc: "Firewall for RDS. Allows PostgreSQL (5432) ONLY from sg-web. Completely isolated from the internet." },
  { name: "EC2 (t2.micro)", desc: "Runs the FastAPI application inside a Docker container. Sits in the public subnet and connects to RDS privately." },
  { name: "RDS PostgreSQL (db.t3.micro)", desc: "Managed database in the private subnet. Stores users, customers, products, inventory tables." },
];

export default function Architecture() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-heading font-bold">AWS Architecture</h1>
        <p className="text-sm text-muted-foreground">Simple cloud networking design for the wholesale ERP migration</p>
      </div>

      <Tabs defaultValue="diagram">
        <TabsList>
          <TabsTrigger value="diagram">Network Diagram</TabsTrigger>
          <TabsTrigger value="services">Components Explained</TabsTrigger>
          <TabsTrigger value="migration">On-Prem vs Cloud</TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="mt-4">
          <ArchDiagram />
          <p className="text-xs text-muted-foreground mt-3 text-center">
            The database lives in a private subnet with no internet route. Only the EC2 app server can reach it.
          </p>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <div className="grid md:grid-cols-2 gap-3">
            {services.map((s) => (
              <Card key={s.name}>
                <CardContent className="p-4">
                  <h3 className="font-heading font-semibold text-sm">{s.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="migration" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold">{"On-Premises → AWS Migration"}</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-destructive mb-3">Before (On-Premises)</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>{"• Single physical server in the office"}</li>
                    <li>{"• Local PostgreSQL on the same machine"}</li>
                    <li>{"• No backups — disk failure = data loss"}</li>
                    <li>{"• Manual code deployments"}</li>
                    <li>{"• Accessible only from office network"}</li>
                    <li>{"• Hardware maintenance by staff"}</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-600 mb-3">After (AWS Cloud)</h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>{"• EC2 instance in public subnet"}</li>
                    <li>{"• RDS in private subnet — isolated from internet"}</li>
                    <li>{"• Automated daily backups via RDS"}</li>
                    <li>{"• CI/CD pipeline deploys automatically"}</li>
                    <li>{"• Accessible from anywhere via HTTP"}</li>
                    <li>{"• No physical hardware to maintain"}</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Migration Steps</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "1. Design VPC + Subnets",
                    "2. Provision with Terraform",
                    "3. Containerise App (Docker)",
                    "4. Migrate Database to RDS",
                    "5. Test + Validate",
                    "6. Go Live",
                  ].map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}