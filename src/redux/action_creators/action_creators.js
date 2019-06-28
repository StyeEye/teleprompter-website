import types from "../types/types";

export function updateUser(username) {
    //console.log(`Updating user: ${username}`)
    return {
        type: types.changeUser,
        payload: username
    }
}

export function refreshEvents(events) {
    return {
        type: types.refreshEvents,
        payload: events
    }
}

export function addEvent(event) {
    //console.log("test")
    return {
        type: types.addEvent,
        payload: event
    }
}

export function updateEvent(event) {
    return {
        type: types.updateEvent,
        payload: event
    }
}

export function removeEvent(eventId) {
    return {
        type: types.removeEvent,
        payload: eventId
    }
}