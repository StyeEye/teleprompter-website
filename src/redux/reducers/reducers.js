import { combineReducers } from 'redux';
import types from "../types/types";

function username(state = "", action) {
    switch (action) {
        case types.changeUser:
            return action.payload;
        default:
            return state;
    }
}

export default combineReducers({ username });