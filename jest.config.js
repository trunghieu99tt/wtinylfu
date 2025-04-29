module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["."],
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};
