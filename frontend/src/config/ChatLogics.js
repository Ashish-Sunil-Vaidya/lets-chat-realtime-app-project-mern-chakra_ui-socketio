
export const getSender = (loggedUser,users) => {
    // console.log('=== loggedUser,users ChatLogics.js [10] ===', loggedUser,users);
    return users[0]?._id === loggedUser?.id ? users[1]?.username : users[0]?.username;
}

export const getSenderFull = (loggedUser,users) => {
    // console.log('=== loggedUser,users ChatLogics.js [10] ===', loggedUser,users);
    return users[0]?._id === loggedUser?.id ? users[1] : users[0];
}