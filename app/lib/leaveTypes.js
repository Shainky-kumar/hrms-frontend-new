import { api } from "@/app/lib/api";

const getItems = (response) => {
  const data = response?.data?.data ?? response?.data ?? response ?? [];
  if (Array.isArray(data)) return data;
  return (
    data?.leave_types ??
    data?.items ??
    data?.results ??
    response?.data?.leave_types ??
    []
  );
};

export const getLeaveTypeId = (leaveType) =>
  leaveType?.leave_type_id || leaveType?.id || leaveType?._id;

export const getLeaveTypeName = (leaveType) =>
  leaveType?.leave_type_name || leaveType?.name || leaveType?.type_name || getLeaveTypeId(leaveType);

export async function fetchLeaveTypes() {
  const endpoints = [
    "/api/v1/get/leave/type",
    "/api/v1/get/leave/type/list",
    "/api/v1/leave/types",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint);
      return getItems(response);
    } catch {
      // Ignore errors and try the next route.
    }
  }

  return [];
}
