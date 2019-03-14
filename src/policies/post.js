const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

    create() {
        return (this._isMember() || this._isAdmin());
    }
    edit() {
        return (this.create() && this._isOwner() || (this._isAdmin()) );
    }

    update() {
        return this.edit();
    }

    destroy() {
        return this.update();
    }
};