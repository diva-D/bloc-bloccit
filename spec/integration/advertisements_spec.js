const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/advertisements/";
const sequelize = require("../../src/db/models/index").sequelize;
const Advertisement = require("../../src/db/models").Advertisement;

describe("routes : advertisements", () => {
   
    beforeEach((done) => {
        this.advertisement;

        sequelize.sync({force: true}).then((res) => {

            Advertisement.create({
                title: "Daves Wonder Pills",
                description: "They make you yuuge!"
            })
            .then((advertisement) => {
                this.advertisement = advertisement;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("GET /advertisements", () => {
        it("should return a status code of 200 and all advertisements", (done) => {
            request.get(base, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                expect(err).toBeNull();
                console.log(body);
                expect(body).toContain("Advertisements");
                expect(body).toContain("Daves Wonder Pills");
                done();
            });
        });
    });

    describe("GET /advertisements/new", () => {
        it("should render a new advertisment form", (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("New Advertisment");
                done();
            });
        });
    });

    describe("POST /advertisements/create", () => {
        const options = {
            url: `${base}create`,
            form: {
                title: "Apple apples",
                description: "Beacuse you suckers will buy anything from us"
            }
        };

        it("should create a new advertisement and redirect", (done) => {
            request.post(options, (err, res, body) => {
                Advertisement.findOne({where: {title: "Apple apples"}})
                .then((advertisement) => {
                    expect(res.statusCode).toBe(303);
                    expect(advertisement.title).toBe("Apple apples");
                    expect(advertisement.description).toBe("Beacuse you suckers will buy anything from us");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("GET /advertisements/:id", () => {
        it("should render a view with the selected advertisement", (done) => {
            request.get(`${base}${this.advertisement.id}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Daves Wonder Pills");
                done();
            });
        });
    });

    describe("POST /advertisements/:id/destroy", () => {
        it("should delete the topic with the associated ID", (done) => {
            Advertisement.all()
            .then((advertisements) => {
                const advertisementCountBeforeDelete = advertisements.length;
                expect(advertisementCountBeforeDelete).toBe(1);

                request.post(`${base}${this.advertisement.id}/destroy`, (err, res, body) => {
                    Advertisement.all()
                    .then((advertisements) => {
                        expect(err).toBeNull();
                        expect(advertisements.length).toBe(advertisementCountBeforeDelete - 1);
                        done();
                    });
                });
            });
        });
    });

    describe("GET /advertisements/:id/edit", () => {
        it("should render a view with an edit topic form", (done) => {
            request.get(`${base}${this.advertisement.id}/edit`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Edit Advertisement");
                expect(body).toContain("Daves Wonder Pills");
                done();
            });
        });
    });

    describe("POST /advertisements/:id/update", () => {
        it("should update the advertisement with the given values", (done) => {
            const options = {
                url: `${base}${this.advertisement.id}/update`,
                form: {
                    title: "Harrys Wonder Pills",
                    description: "They make you yuuge!"
                }
            };
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();

                Advertisement.findOne({
                    where: { id: this.advertisement.id }
                })
                .then((advertisement) => {
                    expect(advertisement.title).toBe("Harrys Wonder Pills");
                    done();
                });
            });
        });
    });
});