import { API, handleApiError } from "./utils";

export const getUserBoards = async (limit = 10, skip = 0) => {
    try {
      const { data } = await API.get(`/posts?limit=${limit}&skip=${skip}`);
      return { error: null, data };
    } catch (error) {
      return handleApiError(error);
    }
};