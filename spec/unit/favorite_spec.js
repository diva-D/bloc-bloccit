const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const User = require("../../src/db/models").User;
const Favorite = require("../../src/db/models").Favorite;

describe("Favorite", () => {
    
    beforeEach((done) => {
        this.user;
        this.topic;
        this.post;
        this.favorite;

        sequelize.sync({force: true}).then((res) => {

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

                    Comment.create({
                        body: "ay caramba!!!!!",
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((res) => {
                        this.comment = res;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#create()", () => {

        it("should create a favorite for a post on a user", (done) => {
            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {
                expect(favorite.postId).toBe(this.post.id);
                expect(favorite.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        
        it("should not create a favorite without assigned post or user", (done) => {
            Favorite.create({
                userId: null    
            })
            .then((favorite) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Favorite.userId cannot be null");
                expect(err.message).toContain("Favorite.postId cannot be null");
                done();
            });
        });
    
    });

    describe("#setUser()", () => {

        it("should associate a favorite and a user together", (done) => {
            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {
                this.favorite = favorite;
                expect(favorite.userId).toBe(this.user.id);

                User.create({
                    email: "bob@example.com",
                    password: "password"
                })
                .then((newUser) => {
                    this.favorite.setUser(newUser)
                    .then((favorite) => {
                        expect(favorite.userId).toBe(newUser.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#getUser()", () => {

        it("should return the associated user", (done) => {
            Favorite.create({
                userId: this.user.id,
                postId: this.post.id
            })
            .then((favorite) => {
                favorite.getUser()
                .then((user) => {
                    expect(user.id).toBe(this.user.id);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe("#setPost()", () => {

        it("should associate a post and a favorite together", (done) => {
            Favorite.create({
                postId: this.post.id,
                userId: this.user.id
            })
            .then((favorite) => {
                this.favorite = favorite;

                Post.create({
                    title: "Dress code on Proxima b",
                    body: "Spacesuit, space helmet, space boots, and space gloves",
                    topicId: this.topic.id,
                    userId: this.user.id
                })
                .then((newPost) => {
                    expect(this.favorite.postId).toBe(this.post.id);

                    this.favorite.setPost(newPost)
                    .then((favorite) => {
                        expect(favorite.postId).toBe(newPost.id);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#getPost()", () => {

        it("should return the associated post", (done) => {
            Favorite.create({
                userId: this.user.id,
                postId: this.post.id
            })
            .then((favorite) => {
                favorite.getPost()
                .then((associatedPost)=> {
                    expect(associatedPost.title).toBe("My first visit to Proxima Centauri b");
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

});