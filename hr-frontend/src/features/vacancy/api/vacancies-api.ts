import axios, { isAxiosError } from "axios";
import type { Job } from "../model/types";
import type { Application } from "../model/types";
const apiAddress = import.meta.env.VITE_API_URL;
console.log(apiAddress); // "https://mybackend.onrender.com"

const axiosClient = axios.create({
  baseURL: apiAddress + "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getVacancies = async (): Promise<Job[]> => {
  try {
    const response = await axiosClient.get("/vacancies");

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error fetching vacancies:",
        error.response?.data || error.message
      );
    } else console.error("Error fetching vacancies:", error);
    throw error;
  }
};

export const getVacancyById = async (id: string): Promise<Job | null> => {
  try {
    const response = await axiosClient.get(`/vacancies/${id}`);

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error fetching vacancy:",
        error.response?.data || error.message
      );
    } else console.error("Error fetching vacancy:", error);
    throw error;
  }
};

export const getApplicationsByVacancy = async (
  vacancy_id: string
): Promise<Application[]> => {
  try {
    const response = await axiosClient.get(`/applications`, {
      params: { vacancy_id },
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error fetching applications:",
        error.response?.data || error.message
      );
    } else console.error("Error fetching applications:", error);
    throw error;
  }
};

export const createVacancy = async (
  vacancyData: Omit<Job, "id" | "created_at" | "updated_at">
): Promise<Job> => {
  try {
    const response = await axiosClient.post("/vacancies", vacancyData);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Axios error creating vacancy:",
        error.response?.data || error.message
      );
    } else console.error("Error creating vacancy:", error);
    throw error;
  }
};
