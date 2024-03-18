import { handleApiError } from "./utils";
import { deleteDataWithAuthentication, postDataToApi, putDataWithAuthentication } from "../../utils/api";

export const addSubtask = async(data) => {
  try {
    const result = postDataToApi('/api/subtasks/add/', data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const editSubtask = async(data) => {
  try {
    const result = putDataWithAuthentication(`/api/subtasks/edit/`, data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const deleteSubtask = async(params) => {
  try {
    const result = deleteDataWithAuthentication(`/api/subtasks/${params}/delete`);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}