// Imports
var fs = require("fs");
var process = require("process");

// Definitions
var map = fs.readFileSync(__dirname + "/map.txt", "utf-8")

process.stdin.setRawMode(true)

const settings = {
    character: "*",
    border: "#",
    walkThrough: "-"
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

    if (!map.join("").includes(settings.character)) return { error: "No character found.", map: map} // If theres a character

    var rowMap = {
        row: async () => {
            var result
            map.filter((value, index, array) => {
                value.filter((v, i, a) => {
                    if (v.includes(settings.character)) result = { val: v, row: index, indexRow: i }
                })
            })
            return result ? result : map
        },
        left: async () => {
            var result = map

            var pos = await rowMap.row()

            if (settings.walkThrough !== map[pos.row][pos.indexRow - 1] && settings.border == map[pos.row][pos.indexRow - 1]) return map // If you can walk there or not.

            result[pos.row][pos.indexRow - 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result

        },
        right: async () => {
            var result = map

            var pos = await rowMap.row()

            if (settings.walkThrough !== map[pos.row][pos.indexRow + 1] && settings.border == map[pos.row][pos.indexRow + 1]) return map // If you can walk there or not.

            result[pos.row][pos.indexRow + 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result

        },
        above: async () => {
            var result = []
            map.forEach((value, index, array) => {
                if (value.includes(settings.character)) { result = map[index - 1] }
            })
            return result || undefined
        },
        under: async () => {
            var result = []
            map.forEach((value, index, array) => {
                if (value.includes(settings.character)) { result = map[index + 1] }
            })
            return result || undefined
        }
    }

    switch (direction) {
        case "w":
            newMap = rowMap.above()
            break;

        case "s":
            newMap = rowMap.under()
            break;

        case "a":
            newMap = rowMap.left()
            break;

        case "d":
            newMap = rowMap.right()
            break;
    }

    return newMap
}
(async () => {
    var formattedMap = await formatMap(map)
    process.stdin.on("data", async (data) => {

        data = data.toString().replace("\r\n", "")

        console.log(await move(data, 0, "*", formattedMap))
    })
})()

