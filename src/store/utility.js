export const updateObject = (oldObj, newValue) => {
    return {
        ...oldObj,
        ...newValue
    };
};
