const nextPowerOf2 = (num: number): number => {
    return Math.pow(2, Math.ceil(Math.log2(num)));
};

export { nextPowerOf2 };
