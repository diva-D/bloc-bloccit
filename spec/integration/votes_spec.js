const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Vote = require("../../src/db/models").Vote;

describe("routes : votes", () => {

    beforeEach((done) => {
        this.user;
        this.topic;
        this.post;
        this.vote;

        sequelize.sync({
            force: true
        }).then((res) => {
            User.create({
                    email: "starman@tesla.com",
                    password: "Trekkie4lyfe"
                })
                .then((res) => {
                    this.user = res;

                    Topic.create({
                            title: "Expeditions to Alpha Centauri",
                            description: "A compilation of reports from recent visits to the star system.",
                            posts: [{
                                title: "My first visit to Proxima Centauri b",
                                body: "I saw some rocks.",
                                userId: this.user.id
                            }]
                        }, {
                            include: {
                                model: Post,
                                as: "posts"
                            }
                        })
                        .then((res) => {
                            this.topic = res;
                            this.post = this.topic.posts[0];
                            done();
                        })
                        .catch((err) => {
                            console.log(err);
                            done();
                        });
                });
        });
    });

    describe("guest attempting to vote on a post", () => {
        beforeEach((done) => {
            request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        userId: 0
                    }
                },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
            it("should not create a new vote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Vote.findOne({
                                where: {
                                    userId: this.user.id,
                                    postId: this.post.id
                                }
                            })
                            .then((vote) => {
                                expect(vote).toBeNull();
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });
    });

    describe("signed in user voting on a post", () => {
        beforeEach((done) => {
            request.get({
                    url: "http://localhost:3000/auth/fake",
                    form: {
                        role: "member",
                        userId: this.user.id
                    }
                },
                (err, res, body) => {
                    done();
                }
            );
        });

        describe("GET /topics/:topicId/posts/:postId/votes/upvote", () => {
            it("should create an upvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Vote.findOne({
                                where: {
                                    userId: this.user.id,
                                    postId: this.post.id
                                }
                            })
                            .then((vote) => {
                                expect(vote).not.toBeNull();
                                expect(vote.value).toBe(1);
                                expect(vote.userId).toBe(this.user.id);
                                expect(vote.postId).toBe(this.post.id);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );

            });

        });

        describe("GET /topics/:topicId/posts/:postId/votes/downvote", () => {
            it("should create an upvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Vote.findOne({
                                where: {
                                    userId: this.user.id,
                                    postId: this.post.id
                                }
                            })
                            .then((vote) => {
                                expect(vote).not.toBeNull();
                                expect(vote.value).toBe(-1);
                                expect(vote.userId).toBe(this.user.id);
                                expect(vote.postId).toBe(this.post.id);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    });
            });
        });


        describe("wrong vote values", () => {

            it("should not create a vote with a value other than 1 or -1", (done) => {
                Vote.create({
                        value: 2,
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((vote) => {
                        // nothing as code should not run
                        done();
                    })
                    .catch((err) => {
                        expect(err.message).toContain("Validation error: Validation isIn on value failed");
                        done();
                    });
            });

            it("should not create more than one vote per user per post", (done) => {
                Vote.create({
                        value: 1,
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((vote) => {
                        Vote.create({
                                value: 1,
                                userId: this.user.id,
                                postId: this.post.id
                            })
                            .then((vote) => {
                                // nothing as code should not run
                                done();
                            })
                            .catch((err) => {
                                expect(err.message).toContain("Validation error");
                                done();
                            });
                    });
            });
        });

        describe("#Post.getPoints()", () => {

            it("should return the correct vote total for an upvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Post.findById(this.post.id, {
                                include: [{
                                    model: Vote,
                                    as: "votes"
                                }]
                            })
                            .then((post) => {
                                expect(post.getPoints()).toBe(1);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });

            it("should return the correct vote total for an downvote", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Post.findById(this.post.id, {
                                include: [{
                                    model: Vote,
                                    as: "votes"
                                }]
                            })
                            .then((post) => {
                                expect(post.getPoints()).toBe(-1);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });

        describe("#Post.hasUpvoteFor()", () => {
            it("should return true if the user has upvoted a post", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/upvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Post.findById(this.post.id, {
                                include: [{
                                    model: Vote,
                                    as: "votes"
                                }]
                            })
                            .then((post) => {
                                expect(post.hasUpvoteFor(this.user.id)).toBe(true);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });

        describe("#Post.hasDownvoteFor()", () => {
            it("should return true if the user has downvoted a post", (done) => {
                const options = {
                    url: `${base}${this.topic.id}/posts/${this.post.id}/votes/downvote`
                };
                request.get(options,
                    (err, res, body) => {
                        Post.findById(this.post.id, {
                                include: [{
                                    model: Vote,
                                    as: "votes"
                                }]
                            })
                            .then((post) => {
                                expect(post.hasDownvoteFor(this.user.id)).toBe(true);
                                done();
                            })
                            .catch((err) => {
                                console.log(err);
                                done();
                            });
                    }
                );
            });
        });

    });

});