import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Building2, ExternalLink, Globe } from "lucide-react";

interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: "startup" | "small" | "medium" | "large" | "enterprise";
  website?: string;
  contactCount: number;
  opportunityCount: number;
  createdAt: string;
}

export function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real implementation, this would come from API
  const companies: Company[] = [
    {
      id: "cmp_1",
      name: "Acme Corp",
      domain: "acme.com",
      industry: "Technology",
      size: "large",
      website: "https://acme.com",
      contactCount: 12,
      opportunityCount: 3,
      createdAt: "2025-01-15",
    },
    {
      id: "cmp_2",
      name: "Tech Startup Inc",
      domain: "techstartup.com",
      industry: "Software",
      size: "startup",
      website: "https://techstartup.com",
      contactCount: 5,
      opportunityCount: 2,
      createdAt: "2025-01-14",
    },
    {
      id: "cmp_3",
      name: "Consulting Solutions",
      domain: "consulting.com",
      industry: "Consulting",
      size: "medium",
      website: "https://consulting.com",
      contactCount: 8,
      opportunityCount: 1,
      createdAt: "2025-01-13",
    },
  ];

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.domain && company.domain.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getSizeColor = (size?: string) => {
    switch (size) {
      case "startup": return "bg-blue-100 text-blue-800";
      case "small": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "large": return "bg-orange-100 text-orange-800";
      case "enterprise": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSizeLabel = (size?: string) => {
    switch (size) {
      case "startup": return "Startup (1-10)";
      case "small": return "Small (11-50)";
      case "medium": return "Medium (51-200)";
      case "large": return "Large (201-1000)";
      case "enterprise": return "Enterprise (1000+)";
      default: return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Companies</h2>
          <p className="text-muted-foreground">
            Manage company information discovered through automation
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies, domains, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Contacts</TableHead>
                <TableHead>Opportunities</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.map((company) => (
                <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {company.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {company.domain && (
                          <span className="text-sm text-muted-foreground">
                            {company.domain}
                          </span>
                        )}
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="h-3 w-3" />
                            Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.industry && (
                      <Badge variant="outline">
                        {company.industry}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {company.size && (
                      <Badge className={getSizeColor(company.size)}>
                        {getSizeLabel(company.size)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{company.contactCount}</span>
                      <span className="text-sm text-muted-foreground">contacts</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{company.opportunityCount}</span>
                      <span className="text-sm text-muted-foreground">opportunities</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredCompanies.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Companies will be automatically discovered through automation tasks"}
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Company
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}