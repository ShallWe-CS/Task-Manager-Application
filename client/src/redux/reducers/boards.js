import * as types from "../constants/boardConstants";

const initialState = {
  board: null,
  boards: [],
  boardError: null,
};

const boardReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.GET_BOARDS_SUCCESS:

    case types.GET_BOARDS_FAIL:
      return {
        ...state,
        boardError: payload,
      };
  }
};
