import { handleApiError } from "./utils";
import { deleteDataWithAuthentication, postDataToApi } from "../../utils/api";

export const addColumn = async(data) => {
  try {
    const result = postDataToApi('/api/columns/add/', data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const deleteColumn = async(params) => {
  try {
    const result = deleteDataWithAuthentication(`/api/columns/${params}/delete`);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}