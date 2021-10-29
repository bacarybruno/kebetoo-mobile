export const actionTypes = {
  SET_VALUE: 'SET_VALUE',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  START_LOADING: 'START_LOADING',
  END_LOADING: 'END_LOADING',
};

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_VALUE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.field]: action.payload.value,
        },
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.field]: action.payload.value,
        },
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null,
        },
      };
    case actionTypes.START_LOADING:
      return { ...state, isLoading: true };
    case actionTypes.END_LOADING:
      return { ...state, isLoading: false };
    default:
      throw new Error(`Unknown action type ${action.type} send with payload ${action.payload}`);
  }
};

export default reducer;
