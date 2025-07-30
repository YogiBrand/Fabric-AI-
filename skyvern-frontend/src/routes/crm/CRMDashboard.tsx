import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Target, Activity } from "lucide-react";
import { useCRMStats, useActivities } from "@/hooks/useCRM";
import { Skeleton } from "@/components/ui/skeleton";

export function CRMDashboard() {
  const { data: stats, isLoading: statsLoading } = useCRMStats();
  const { data: activities, isLoading: activitiesLoading } = useActivities({ limit: 3 });

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-4 w-[120px] mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_contacts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12 from automation this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_companies || 0}</div>
            <p className="text-xs text-muted-foreground">
              +5 new companies identified
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_opportunities || 0}</div>
            <p className="text-xs text-muted-foreground">
              ${((stats?.opportunities_value || 0) / 1000).toFixed(0)}k total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              +23 automation runs today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats?.contacts_by_status || {}).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      status === "customer"
                        ? "default"
                        : status === "lost"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Badge>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Opportunities by Stage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats?.opportunities_by_stage || {}).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      stage === "closed_won"
                        ? "default"
                        : stage === "closed_lost"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {stage.split("_").map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(" ")}
                  </Badge>
                </div>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Automation Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activitiesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                  <Skeleton className="w-2 h-2 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-[200px] mb-2" />
                    <Skeleton className="h-3 w-[300px]" />
                  </div>
                  <Skeleton className="h-3 w-[60px]" />
                </div>
              ))}
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity: any) => {
                const getActivityColor = () => {
                  switch (activity.type) {
                    case "automation": return "bg-green-500";
                    case "email": return "bg-blue-500";
                    case "note": return "bg-purple-500";
                    default: return "bg-gray-500";
                  }
                };
                
                const formatTime = (createdAt: string) => {
                  const date = new Date(createdAt);
                  const now = new Date();
                  const diff = now.getTime() - date.getTime();
                  const minutes = Math.floor(diff / (1000 * 60));
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  
                  if (minutes < 60) return `${minutes} min ago`;
                  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
                  return date.toLocaleDateString();
                };
                
                return (
                  <div key={activity.activity_id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className={`w-2 h-2 ${getActivityColor()} rounded-full`}></div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.subject || "Activity recorded"}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description || "No description available"}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">{formatTime(activity.created_at)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No recent activities</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}