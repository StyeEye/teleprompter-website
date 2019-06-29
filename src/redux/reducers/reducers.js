import { combineReducers } from 'redux';
import types from "../types/types";

function initialSort(eventList) {
    const newlist = [...eventList];

    const sortedList = newlist.sort((a, b) => {
        if (a.data.hasOwnProperty("index")) {
            if (a.data.hasOwnProperty("index"))
                return a.data.index - b.data.index;
            else
                return -1;
        } else
            return 1;
    })

    let trueIndex = 0;
    return sortedList.map(e => {
        if (e.data.hasOwnProperty("index")) {
            if (e.data.index !== trueIndex)
                e.hasChanged = true;
            e.data.index = trueIndex++;
        }

        return e;
    })
}

function fixIndexes(eventList) {
    return eventList.map((e, i) => {
        if (e.data.index !== i) {
            e.hasChanged = true;
            e.data.index = i;
        }
        return e;
    })
}

function username(state = "", action) {
    switch (action.type) {
        case types.changeUser:
            console.log(action)
            return action.payload;
        default:
            return state;
    }
}

function events(state = [], action) {
    switch (action.type) {
        case types.refreshEvents:
            console.log(action)
            return initialSort(action.payload);

        case types.addEvent:
            //console.log("test")
            return fixIndexes([...state, action.payload]);

        case types.updateEvent:
            const newState = [...state];

            const target = newState.findIndex(e => e.data.id === action.payload.id);

            if (target !== -1) {
                newState[target].data = action.payload;
                newState[target].hasChanged = true;

                const moved = newState.splice(target, 1)[0];

                newState.splice(action.payload.index, 0, moved);

                //debugger;
            }

            return fixIndexes(newState);

        case types.removeEvent:
            const filteredState = state.filter(e => {
                return e.data.id !== action.payload;
            });

            return fixIndexes(filteredState);

        default:
            return state;
    }
}

export default combineReducers({ username, events });