import { handleApiError } from "./utils";
import { deleteDataWithAuthentication, postDataToApi, putDataWithAuthentication } from "../../utils/api";

export const addTask = async(data) => {
  try {
    const result = postDataToApi('/api/tasks/add/', data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const editTask = async(params, data) => {
  try {
    const result = putDataWithAuthentication(`/api/tasks/${params}/edit/`, data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const deleteTask = async(params) => {
  try {
    const result = deleteDataWithAuthentication(`/api/tasks/${params}/delete`);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}