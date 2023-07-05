import {ITEMS,SET_ITEM,ADD_ITEM,DELETE_ITEM,DETAIL_ITEM,UPDATE_ITEM} from "./constants"
export const initState = {
    item: "",
    items: [],
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case ITEMS:
        return {
         items: action.payload
        };
      case SET_ITEM:
        return {
          ...state,
          item: action.payload,
        };
      case DETAIL_ITEM:
        return {
          ...state,
          item: action.payload,
        };
      case ADD_ITEM:
        return {
          ...state,
          data: [...state.items, action.payload],
        };
      case UPDATE_ITEM:
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? action.payload : item
          ),
        };
      case DELETE_ITEM:
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload),
        };
      default:
        throw new Error("Invalid action");
    }
  };
  export default reducer
