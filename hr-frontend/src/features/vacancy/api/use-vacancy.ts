import { useQuery } from "@tanstack/react-query";
import { getVacancyById } from "./vacancies-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteVacancy } from "./vacancies-api";

export const useVacancy = (id: string) => {
  return useQuery({
    queryKey: ["vacancy", id],
    queryFn: () => getVacancyById(id),
    enabled: !!id,
  });
};

export const useDeleteVacancy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteVacancy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["vacancies"] });
      qc.invalidateQueries({ queryKey: ["vacancy"] });
    },
  });
};
