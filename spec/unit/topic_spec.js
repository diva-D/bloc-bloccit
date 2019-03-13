const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("TOPIC", () => {

    beforeEach((done) => {
        this.topic;
        this.post;
        this.user;

        sequelize.sync({ force: true }).then((res) => {
            
            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                        title: "Expeditions to Alpha Centauri",
                        description: "A compilation of reports from recent visits to the star system.",

                        posts: [{
                            title: "My first vist to Proxima Cenauri b",
                            body: "I saw some rocks.",
                            userId: this.user.id
                        }]
                    }, {
                        include: {
                            model: Post,
                            as: "posts"
                        }
                    })
                    .then((topic) => {
                        this.topic = topic;
                        this.post = topic.posts[0];
                        done();
                    });
            });
        });
    });

    describe("#create()", () => {
        it("should return a valid new Topic object", (done) => {
            Topic.create({
                    title: "Title",
                    description: "description"
                })
                .then((topic) => {
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });

    describe("#getPosts()", () => {
        it("should return all associated posts to the Topic", (done) => {
            this.topic.getPosts()
                .then((posts) => {
                    expect(posts[0].title).toBe("My first vist to Proxima Cenauri b");
                    expect(posts[0].body).toBe("I saw some rocks.");
                    expect(posts[0].topicId).toBe(this.topic.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
        });
    });
});