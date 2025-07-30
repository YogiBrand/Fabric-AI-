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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Target, ExternalLink, DollarSign } from "lucide-react";

interface Opportunity {
  id: string;
  name: string;
  contactName?: string;
  companyName?: string;
  stage: "prospecting" | "qualification" | "needs_analysis" | "value_proposition" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
  value?: number;
  probability: number;
  expectedCloseDate?: string;
  createdAt: string;
}

export function OpportunitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Mock data - in real implementation, this would come from API
  const opportunities: Opportunity[] = [
    {
      id: "opp_1",
      name: "Enterprise Software License",
      contactName: "John Doe",
      companyName: "Acme Corp",
      stage: "proposal",
      value: 50000,
      probability: 75,
      expectedCloseDate: "2025-02-15",
      createdAt: "2025-01-15",
    },
    {
      id: "opp_2",
      name: "Consulting Services",
      contactName: "Sarah Wilson",
      companyName: "Tech Startup Inc",
      stage: "qualification",
      value: 25000,
      probability: 40,
      expectedCloseDate: "2025-03-01",
      createdAt: "2025-01-14",
    },
    {
      id: "opp_3",
      name: "Training Program",
      contactName: "Mike Johnson",
      companyName: "Consulting Solutions",
      stage: "negotiation",
      value: 15000,
      probability: 90,
      expectedCloseDate: "2025-01-30",
      createdAt: "2025-01-13",
    },
  ];

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const matchesSearch = 
      opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opportunity.contactName && opportunity.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (opportunity.companyName && opportunity.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStage = stageFilter === "all" || opportunity.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "prospecting": return "bg-blue-100 text-blue-800";
      case "qualification": return "bg-cyan-100 text-cyan-800";
      case "needs_analysis": return "bg-yellow-100 text-yellow-800";
      case "value_proposition": return "bg-orange-100 text-orange-800";
      case "proposal": return "bg-purple-100 text-purple-800";
      case "negotiation": return "bg-pink-100 text-pink-800";
      case "closed_won": return "bg-green-100 text-green-800";
      case "closed_lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return "text-green-600 font-semibold";
    if (probability >= 50) return "text-yellow-600 font-medium";
    if (probability >= 25) return "text-orange-600";
    return "text-red-600";
  };

  const formatStageLabel = (stage: string) => {
    return stage.split("_").map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(" ");
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const avgProbability = opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length;

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">Opportunities</h2>
          <p className="text-muted-foreground">
            Track and manage your sales opportunities
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Opportunities</p>
                <p className="text-2xl font-bold">{opportunities.length}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Probability</p>
                <p className="text-2xl font-bold">{Math.round(avgProbability)}%</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities, contacts, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="prospecting">Prospecting</SelectItem>
                <SelectItem value="qualification">Qualification</SelectItem>
                <SelectItem value="needs_analysis">Needs Analysis</SelectItem>
                <SelectItem value="value_proposition">Value Proposition</SelectItem>
                <SelectItem value="proposal">Proposal</SelectItem>
                <SelectItem value="negotiation">Negotiation</SelectItem>
                <SelectItem value="closed_won">Closed Won</SelectItem>
                <SelectItem value="closed_lost">Closed Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opportunity</TableHead>
                <TableHead>Contact & Company</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Probability</TableHead>
                <TableHead>Expected Close</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpportunities.map((opportunity) => (
                <TableRow key={opportunity.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">{opportunity.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {opportunity.contactName && (
                        <div className="font-medium">{opportunity.contactName}</div>
                      )}
                      {opportunity.companyName && (
                        <div className="text-sm text-muted-foreground">
                          {opportunity.companyName}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStageColor(opportunity.stage)}>
                      {formatStageLabel(opportunity.stage)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {formatCurrency(opportunity.value)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={getProbabilityColor(opportunity.probability)}>
                      {opportunity.probability}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {opportunity.expectedCloseDate
                      ? new Date(opportunity.expectedCloseDate).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(opportunity.createdAt).toLocaleDateString()}
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
      {filteredOpportunities.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No opportunities found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || stageFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Start by creating opportunities from your qualified contacts"}
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Opportunity
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}