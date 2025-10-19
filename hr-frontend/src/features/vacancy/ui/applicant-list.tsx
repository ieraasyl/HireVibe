import React from "react";
import { Card, Text, Stack, Button, Badge } from "@mantine/core";
import type { Application } from "../model/types";

interface Props {
  applications: Application[];
  onSeeDetails: (app: Application) => void;
}

export const ApplicantList: React.FC<Props> = ({ applications, onSeeDetails }) => {
  if (!applications || applications.length === 0) {
    return <Text color="dimmed">No applicants yet.</Text>;
  }

  // Sort by matching_score desc (nulls to the end)
  const sorted = [...applications].sort((a, b) => {
    const av = a.matching_score ?? -1;
    const bv = b.matching_score ?? -1;
    return bv - av;
  });

  return (
    <Stack gap="sm">
      {sorted.map((app) => (
        <Card key={app.id} shadow="xs" radius="md" withBorder>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <Text fw={600}>{app.first_name} {app.last_name}</Text>
              <Text size="sm" color="dimmed">{app.email}</Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Badge color={app.matching_score && app.matching_score >= 80 ? "green" : "orange"}>
                {app.matching_score ?? "N/A"}
              </Badge>
              <Button size="xs" onClick={() => onSeeDetails(app)}>See details</Button>
            </div>
          </div>
        </Card>
      ))}
    </Stack>
  );
};
