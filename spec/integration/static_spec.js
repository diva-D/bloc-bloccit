const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {
    
    // Index page
    describe("GET /", () => {
        it("should return status code 200 and have 'Welcome to Bloccit' in the body of the response", () => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toContain("Welcome to Bloccit");
            });
        });
    });

    // About page
    describe("GET /about", () => {
        it("should return status code 200 and have 'About Us' in the body of the response", () => {
            const about = base + "about/";
            request.get(about, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(body).toContain("About Us");
            });
        });
    });
});