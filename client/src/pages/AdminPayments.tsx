import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface EnrichedPayment {
  id: string;
  userId: string;
  templateId: string;
  userEmail: string;
  templateTitle: string;
  stripePaymentIntentId: string;
  amount: number;
  status: string;
  createdAt: string;
}

export default function AdminPayments() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const { data: payments = [], isLoading } = useQuery<EnrichedPayment[]>({
    queryKey: ["/api/admin/payments"],
    enabled: !!user?.isAdmin,
  });

  const filteredPayments = useMemo(() => {
    if (statusFilter === "all") {
      return payments;
    }
    return payments.filter((payment) => payment.status === statusFilter);
  }, [payments, statusFilter]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Denied</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">You need administrator privileges to access this page.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-8" data-testid="text-page-title">Payment Transactions</h1>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>All Payments</CardTitle>
                  <CardDescription>View and filter payment transactions</CardDescription>
                </div>
                <div className="w-48">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger data-testid="select-status-filter">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" data-testid="filter-all">All</SelectItem>
                      <SelectItem value="succeeded" data-testid="filter-succeeded">Succeeded</SelectItem>
                      <SelectItem value="pending" data-testid="filter-pending">Pending</SelectItem>
                      <SelectItem value="failed" data-testid="filter-failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredPayments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  {statusFilter === "all" ? "No payments yet" : `No ${statusFilter} payments`}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Template Title</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id} data-testid={`payment-row-${payment.id}`}>
                        <TableCell className="font-mono text-xs" data-testid={`payment-id-${payment.id}`}>
                          {payment.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell data-testid={`payment-email-${payment.id}`}>
                          {payment.userEmail}
                        </TableCell>
                        <TableCell data-testid={`payment-template-${payment.id}`}>
                          {payment.templateTitle}
                        </TableCell>
                        <TableCell data-testid={`payment-amount-${payment.id}`}>
                          ${(payment.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell data-testid={`payment-status-${payment.id}`}>
                          <Badge
                            variant={
                              payment.status === "succeeded"
                                ? "default"
                                : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-testid={`payment-date-${payment.id}`}>
                          {format(new Date(payment.createdAt), "MMM d, yyyy HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
