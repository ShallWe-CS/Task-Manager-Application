import { API, handleApiError } from "./utils";
import { deleteDataWithAuthentication, postDataToApi, putDataWithAuthentication } from "../../utils/api";
import { fetchAsyncBoards } from "../../redux/boardsSliceNew";
import { useDispatch, useSelector } from "react-redux";

export const getUserBoards = async (limit = 10, skip = 0) => {
    try {
      const { data } = await API.get(`/posts?limit=${limit}&skip=${skip}`);
      return { error: null, data };
    } catch (error) {
      return handleApiError(error);
    }
};

export const addBoard = async(data) => {
  try {
    const result = postDataToApi('/api/boards/add/', data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const editBoard = async(params, data) => {
  try {
    const result = putDataWithAuthentication(`/api/boards/${params}/edit/`, data);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}

export const deleteBoard = async(params) => {
  try {
    const result = deleteDataWithAuthentication(`/api/boards/${params}/delete`);
    return result;
  } catch (error) {
    return handleApiError(error);
  }
}