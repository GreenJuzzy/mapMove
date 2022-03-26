// Imports
var fs = require("fs");
var process = require("process");

// Definitions
var map = fs.readFileSync(__dirname + "/map.txt", "utf-8").split("")

// Functions

/**
 * 
 * @param {( "up" | "down" | "left" | "right")} direction Direction of movement.
 * @param {Number} render The radius blocks should be rendered.
 * @param {String} player The symbol of player.
 * @param {String[]} map The full-sized map.
 * 
 * @example
 * move("up", 2, "*", map)
 */

var move = async (direction, render, player, map) => {
    if (!map.includes(player)) return { error: "No character found." }

}

