import axiosInstance from "../base-url";


export interface Employee {
  id: number;
  role: string;
  hourly_rate: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export type CreateEmployeePayload = {
  role: string;
  hourly_rate: string;
  user: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export type UpdateEmployeePayload = {
  role?: string;
  hourly_rate?: string;
  user?: {
    username?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
  };
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await axiosInstance.get("/api/employees/");
  return response.data;
};

export const updateEmployee = async (
  id: number,
  payload: UpdateEmployeePayload
): Promise<Employee> => {
  const response = await axiosInstance.put(`/api/employees/${id}/`, payload);
  return response.data;
};

export const createEmployee = async (
  payload: CreateEmployeePayload
): Promise<Employee> => {
  const response = await axiosInstance.post("/api/employees/", payload);
  return response.data;
};

export const deleteEmployee = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/employees/${id}/`);
};

export default axiosInstance;
