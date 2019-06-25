import types from "../types/types";

export function updateUser(username) {
    //console.log(`Updating user: ${username}`)
    return {
        type: types.changeUser,
        payload: username
    }
}