// Imports
var fs = require("fs");
var process = require("process");

// Definitions
var map = fs.readFileSync(__dirname + "/map.txt", "utf-8")

const settings = {
    character: "*",
    borders: ["#"]
}

// Functions

/**
 * @param {String[]} map The full-sized map.
 */

var formatMap = async (map) => {
    var newArr = []

    map = map.replaceAll("\r", "").replaceAll(" ", "").split("\n").forEach((value, index, array) => {
        newArr[index] = value.split("")
    })

    newArr.forEach((value, index, array) => { if (value[value.length - 1] == "") value.pop() })

    return newArr
}

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
    var newMap


    console.log({ map })
    if (!map.join("").includes(settings.character)) return { error: "No character found." }
    
    var rowMap = {
        row: () => {
            var result = []
            map.filter((value, index, array) => {
                if(value.includes(settings.character)) result = value
            })
            return result.length > 0 ? result : map
        },
        left: () => {

        },
        above: () => {
            var result = []
            map.forEach((value, index, array) => {
                if (value.includes(settings.character)) { result = map[index - 1] }
            })
            return result || undefined
        },
        under: () => {
            var result = []
            map.forEach((value, index, array) => {
                if (value.includes(settings.character)) { result = map[index + 1] }
            })
            return result || undefined
        }
    }

    switch (direction) {
        case "up":
            newMap = rowMap.above()
            break;
    
        default:
            break;
    }
}
(async () => {
    move("up", 3, "*", await formatMap(map))
})()

