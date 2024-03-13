import * as api from "../api/boardAPI";
import * as types from "../constants/boardConstants";

export const getUserBoardsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getUserBoards();

    if (error) {
      throw new Error(error);
    }

    dispatch({
      type: types.GET_BOARDS_SUCCESS,
      payload: {
        page: skip / limit + 1,
        posts: data.formattedPosts,
        totalPosts: data.totalPosts,
      },
      meta: {
        requiresAuth: true,
      },
    });
  } catch (error) {
    dispatch({
      type: types.GET_BOARDS_FAIL,
      payload: error,
      meta: {
        requiresAuth: true,
      },
    });
  }
};