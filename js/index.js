"use strict";

const Promise = require("bluebird");

/**
 * API for communication with the wrapper ionic app.
 *
 * Important: call api.init() first!
 *
 * @type {module.Api}
 */
module.exports = class Api {

    /**
     * To call first, set the unique name of the game and the window object.
     *
     * @param window to post the messages on and register listeners
     * @param name unique name of the game
     */
    init(window, name) {

        if (!window) {
            throw new Error("No window")
        }
        if (!name) {
            throw new Error("No game name given")
        }

        this.name = name;
        this.window = window;
    }

    /**
     *  Saves the current highscore.
     *
     * @param highscore
     */
    saveHighscore(highscore) {
        if (!highscore || isNaN(highscore)) {
            return;
        }

        this.window.parent.postMessage({
            method: "saveHighscore",
            payload: {
                score: parseInt(highscore),
                name: this.name
            }
        }, "*");
    }

    /**
     *  Quits the game. Used to close it without saving
     *
     */
    quitGame() {

        this.window.parent.postMessage({
            method: "quitGame",
            payload: {
                name: this.name
            }
        }, "*");
    }

    /**
     * Asks the app for the current highscore of this game.
     *
     * @returns Promise<number> is resolved with the current highscore of the app
     */
    getHighscore() {
        return new Promise((resolve, reject) => {

            if (!this.window.parent || this.window.parent === this.window) {
            return reject(new Error("App missing"));
        }

        let handler = (event) => {
            if (event.data.method === "setHighscore") {
                resolve(event.data.payload.score);
                this.window.removeEventListener("message", handler);
            }

        };

        this.window.addEventListener("message", handler);

        this.window.parent.postMessage({
            method: "getHighscore",
            payload: {
                name: this.name
            }
        }, "*");
    });
    }

    /**
     * Asks the app for the current highscore of this game.
     *
     * @returns Promise<User> is resolved with the current user of the app
     */
    getUser() {
        return new Promise((resolve, reject) => {

            if (!this.window.parent || this.window.parent === this.window) {
            return reject(new Error("App missing"));
        }

        let handler = (event) => {
            if (event.data.method === "setUser") {
                resolve(event.data.payload.user);
                this.window.removeEventListener("message", handler);
            }

        };

        this.window.addEventListener("message", handler);

        this.window.parent.postMessage({
            method: "getUser",
            payload: {
                name: this.name
            }
        }, "*");
    });
    }

    /**
     * Asks the app is the current user is a guest.
     *
     * @returns Promise<boolean> is resolved with is guest value
     */
    isGuest() {
        return new Promise((resolve, reject) => {

            if (!this.window.parent || this.window.parent === this.window) {
            return reject(new Error("App missing"));
        }

        let handler = (event) => {
            if (event.data.method === "setGuest") {
                resolve(event.data.payload.isGuest);
                this.window.removeEventListener("message", handler);
            }

        };

        this.window.addEventListener("message", handler);

        this.window.parent.postMessage({
            method: "isGuest",
            payload: {
                name: this.name
            }
        }, "*");
    });
    }

}
