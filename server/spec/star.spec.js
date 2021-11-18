const StarService = require('../services/star');
const starNames = require('../config/game/starNames');

const fakeRandomService = {
    getRandomNumber(max) {
        return max;
    },
    getRandomNumberBetween(min, max) {
        return max;
    },
    getRandomPositionInCircle(radius) {
        return radius;
    },
    getRandomPositionInCircleFromOrigin(originX, originY, radius) {
        return radius;
    },
    generateStarNaturalResources() {
        return 10;
    }
};

const fakeStarNameService = {
    index: 0,
    getRandomStarName() {
        return `Test ${this.index++}`;
    }
};

const fakeDistanceService = {

}

const fakeStarDistanceService = {

}

const game = {
    constants: {
        star: {
            resources: {
                minNaturalResources: 10,
                maxNaturalResources: 50
            }
        }
    }
};

describe('star', () => {

    let starService;

    beforeEach(() => {
        starService = new StarService({}, fakeRandomService, fakeStarNameService, fakeDistanceService, fakeStarDistanceService);
    });

    it('should generate an unowned star', () => {
        const name = 'test star name';

        const newStar = starService.generateUnownedStar(game, name, { x: 0, y: 0 }, 10);

        expect(newStar).not.toBe(null);
        expect(newStar._id).not.toBe(null);
        expect(newStar.name).toEqual(name);
        expect(newStar.naturalResources).toBeGreaterThanOrEqual(game.constants.star.resources.minNaturalResources);
        expect(newStar.naturalResources).toBeLessThanOrEqual(game.constants.star.resources.maxNaturalResources);
        expect(newStar.location).not.toBe(null);
    });

    it('should calculate terraformed resources', () => {
        const gameInput1 = {
            settings: {
                specialGalaxy: {
                    splitResources: 'disabled'
                }
            }
        };
        const gameInput2 = {
            settings: {
                specialGalaxy: {
                    splitResources: 'enabled'
                }
            }
        };
        const gameInput3 = {
            settings: {
                specialGalaxy: {}
            }
        };

        const result1 = starService.calculateTerraformedResources(gameInput1, 10, 5); // Normal resources
        const result2 = starService.calculateTerraformedResources(gameInput2, 30, 5); // Split resources
        const result3 = starService.calculateTerraformedResources(gameInput3, 20, 7); // Normal resources

        expect(result1).toEqual(35);
        expect(result2).toEqual(105);
        expect(result3).toEqual(55);
    });

    it('should setup a player\'s home star', () => {
        const newPlayer = {
            _id: 1
        }

        const homeStar = {
            _id: 2,
            infrastructure: {}
        };

        const gameSettings = {
            player: {
                startingShips: 10,
                startingInfrastructure: {
                    economy: 10,
                    industry: 10,
                    science: 1
                }
            }
        };

        starService.setupHomeStar(game, homeStar, newPlayer, gameSettings);

        expect(homeStar.ownedByPlayerId).toBe(newPlayer._id);
        expect(homeStar.ships).toEqual(gameSettings.player.startingShips);
        expect(homeStar.naturalResources).toEqual(game.constants.star.resources.maxNaturalResources);
        expect(homeStar.infrastructure.economy).toEqual(gameSettings.player.startingInfrastructure.economy);
        expect(homeStar.infrastructure.industry).toEqual(gameSettings.player.startingInfrastructure.industry);
        expect(homeStar.infrastructure.science).toEqual(gameSettings.player.startingInfrastructure.science);
    });

});
