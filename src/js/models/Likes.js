export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id); //find element with id
        this.likes.splice(index, 1); //remove using splice
    }

    isLiked(id) {
        //if can't find any element with id, then it will be -1, then the entire expression will be false
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}