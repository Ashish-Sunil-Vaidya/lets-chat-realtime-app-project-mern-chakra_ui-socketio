
export const getSender = (loggedUser, users) => {
    // console.log('=== loggedUser,users ChatLogics.js [10] ===', loggedUser,users);
    return users[0]?._id === loggedUser?.id ? users[1]?.username : users[0]?.username;
}

export const getSenderFull = (loggedUser, users) => {

    return users[0]?._id === loggedUser?.id ? users[1] : users[0];
}

export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1]?.sender?._id === m.sender?._id &&
        messages[i]?.sender?._id !== userId
    ) {
        return "38px";
    } else if (
        (i < messages.length - 1 &&
            messages[i + 1]?.sender?._id !== m.sender?._id &&
            messages[i]?.sender?._id !== userId) ||
        (i === messages.length - 1 && messages[i]?.sender?._id !== userId)
    ) {
        return 0;
    } else {
        return "auto";
    }
};

export const isSameSender = (messages, m, i, userId) => {
    console.log('===  ChatLogics.js [32] ===', i < messages.length - 1 &&
        (messages[i + 1]?.sender?._id !== m.sender?._id ||
            messages[i + 1]?.sender?._id === undefined) &&
        messages[i]?.sender?._id !== userId);
    console.log('=== m,i,userId ChatLogics.js [36] ===', m, i, userId);
    return (
        i < messages.length - 1 &&
        (messages[i + 1]?.sender?._id !== m.sender?._id ||
            messages[i + 1]?.sender?._id === undefined) &&
        messages[i]?.sender?._id !== userId
    );
};

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1]?.sender?._id !== userId &&
        messages[messages.length - 1]?.sender?._id
    );
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1]?.sender?._id === m.sender?._id;
};


