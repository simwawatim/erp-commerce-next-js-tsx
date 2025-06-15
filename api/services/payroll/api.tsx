import axiosInstance from "../base-url";

export interface EmployeePayrollResponse {
    id: number;
    hours_worked: number;
    total_paid: number;
    pay_date: number;
    employee: number

}

export const getAllEmployeesOnPayRoll = async (): Promise<EmployeePayrollResponse[]> => {
    const response = await axiosInstance.get("/api/payrolls/");
    return response.data
}