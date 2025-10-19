import { Modal, Stack, Text, Divider, Badge, Button } from "@mantine/core";
import React from "react";
import type { Application } from "../model/types";

interface Props {
  opened: boolean;
  onClose: () => void;
  application?: Application | null;
}

export const ApplicantDetailsModal: React.FC<Props> = ({ opened, onClose, application }) => {
  if (!application) return null;

  const requirements = application.matching_sections?.requirements ?? [];

  return (
    <Modal opened={opened} onClose={onClose} title={`${application.first_name} ${application.last_name}`} size="lg">
      <Stack gap="sm">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text fw={600}>Email</Text>
          <Text>{application.email}</Text>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Text fw={600}>Applied at</Text>
          <Text>{new Date(application.created_at).toLocaleString()}</Text>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text fw={600}>Matching score</Text>
          <Badge color={application.matching_score && application.matching_score >= 80 ? "green" : "orange"}>
            {application.matching_score ?? "N/A"}
          </Badge>
        </div>

        <Divider />

        <div>
          <Text fw={600} mb="xs">Matching sections</Text>
          {requirements && Array.isArray(requirements) && requirements.length > 0 ? (
            <Stack gap="xs">
              {requirements.map((req: any, i: number) => (
                <div key={i}>
                  <Text fw={500}>{req.get?.name ?? req.name ?? `Requirement ${i + 1}`}</Text>
                  <Text size="sm" color="dimmed">Match percent: {req.match_percent ?? req.matchPercent ?? "N/A"}</Text>
                </div>
              ))}
            </Stack>
          ) : (
            <Text color="dimmed">No detailed matching sections available.</Text>
          )}
        </div>

        <div>
          {/* Prefer backend download endpoint which streams the stored PDF */}
          <Button
            component="a"
            href={`/api/applications/${application.id}/resume`}
            target="_blank"
            rel="noreferrer"
          >
            Download resume
          </Button>
        </div>
      </Stack>
    </Modal>
  );
};
