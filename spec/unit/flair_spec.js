const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Flair = require("../../src/db/models").Flair;

describe("Flair", () => {

    beforeEach((done) => {
        this.topic;
        this.flair;
        sequelize.sync({
            force: true
        }).then((res) => {

            Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A complication of reports from recent visits to the star system."
                })
                .then((topic) => {
                    this.topic = topic;

                    Flair.create({
                            name: "Space",
                            color: "Black",

                            topicId: this.topic.id
                        })
                        .then((flair) => {
                            this.flair = flair;
                            done();
                        });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("#create()", () => {
        it("should create a flair object with a title and color", (done) => {
            Flair.create({
                    name: "New",
                    color: "red",
                    topicId: this.topic.id
                })
                .then((flair) => {
                    expect(flair.name).toBe("New");
                    expect(flair.color).toBe("red");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });

        it("should not create a flair with a missing title or color", (done) => {
            Flair.create({
                    name: "New"
                })
                .then((flair) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain("Flair.color cannot be null");
                    expect(err.message).toContain("Flair.topicId cannot be null");
                    done();
                });
        });
    });

    describe("#setTopic()", () => {
        it("should associate a topic and a flair together", (done) => {
            Topic.create({
                    title: "Challenges of intersellar travel",
                    description: "1. The Wi-Fi is terrible"
                })
                .then((newTopic) => {
                    expect(this.flair.topicId).toBe(this.topic.id);

                    this.flair.setTopic(newTopic)
                        .then((flair) => {
                            expect(flair.topicId).toBe(newTopic.id);
                            done();
                        });
                });
        });
    });

    describe("#getTopic()", () => {
        it("should return the associated topic", (done) => {
            this.flair.getTopic()
                .then((associatedTopic) => {
                    expect(associatedTopic.title).toBe("Expeditions to Alpha Centauri");
                    done();
                });
        });
    });

});