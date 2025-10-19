import { useQuery } from "@tanstack/react-query";
import { getApplicationsByVacancy } from "./vacancies-api";

export const useApplications = (vacancyId?: string) => {
  return useQuery({
    queryKey: ["applications", vacancyId],
    queryFn: () => getApplicationsByVacancy(vacancyId!),
    enabled: !!vacancyId,
  });
};
