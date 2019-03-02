const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("TOPIC", () => {

    beforeEach((done) => {
        this.topic;
        this.post;

        sequelize.sync({force: true}).then((res) => {
            Topic.create({
                title: "Famous Science Fiction Authors",
                description: "An exploration of the people behind some of our favorite books"
            })
            .then((topic) => {
                this.topic = topic;

                Post.create({
                    title: "Arthur C. Clarke",
                    body: "Mastermind behind classics such as '2001: A Space Odyssey' and 'Childhood's End'",
                    topicId: this.topic.id
                })
                .then((post) => {
                    this.post = post;
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
                expect(posts[0].title).toBe("Arthur C. Clarke");
                expect(posts[0].body).toBe("Mastermind behind classics such as '2001: A Space Odyssey' and 'Childhood's End'");
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