const nextPowerOf2 = (num: number): number => {
    // only accept integers
    if (num !== Math.floor(num)) {
        throw new Error("Input must be an integer");
    }
    return Math.pow(2, Math.ceil(Math.log2(num)));
};

export { nextPowerOf2 };
