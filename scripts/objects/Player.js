class Player {
    constructor(name, totalPoints) {
        this.name = name;
        this.totalPoints = totalPoints;
    }

    // Adding a method to the constructor
    toString() {
        return `{${this.name},${this.totalPoints}}`;
    }
}