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

        //persist data in localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id); //find element with id
        this.likes.splice(index, 1); //remove using splice

        //persist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        //if can't find any element with id, then it will be -1, then the entire expression will be false
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restore likes from the localStorage
        if(storage) this.likes = storage;
    }
}