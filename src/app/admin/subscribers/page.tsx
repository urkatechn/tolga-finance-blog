"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Subscriber {
  id: string;
  email: string;
  is_subscribed: boolean | null;
  subscription_date_time: string | null;
  update_date_time: string | null;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("subscribers")
          .select("id,email,is_subscribed,subscription_date_time,update_date_time")
          .order("subscription_date_time", { ascending: false });
        if (error) throw error;
        setSubscribers(data || []);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : "Failed to load subscribers";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">List of newsletter subscribers</p>
        </div>
        {subscribers?.length ? (
          <Badge variant="secondary">{subscribers.length} total</Badge>
        ) : null}
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Subscribed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  No subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.email}</TableCell>
                  <TableCell>
                    {s.is_subscribed ? (
                      <Badge variant="secondary">Subscribed</Badge>
                    ) : (
                      <Badge variant="outline">Unsubscribed</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {s.subscription_date_time
                      ? new Date(s.subscription_date_time).toLocaleString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
