// Imports
var fs = require("fs");
var process = require("process");
var chalk = require("chalk")

// Definitions
var currentMap = fs.readFileSync(__dirname + "/map.txt", "utf-8")
var lastMap

process.stdin.setRawMode(true)

const settings = {
    character: "*",
    border: "#",
    walkThrough: "-",
    spacing: (currentMap.replace("\r", "").replaceAll(" ", "").split("\n")[0].length / 4)
}

// Functions

/**
 * @param {String[]} map The full-sized map.
 */

var formatMap = async (map) => {
    var newArr = []

    map = map.replaceAll("\r", "").replaceAll(" ", settings.border).split("\n").forEach((value, index, array) => {
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

    if (!map.join("").includes(settings.character)) return { error: "No character found.", map: map } // If theres a character

    var rowMap = {
        row: async () => {
            if (!map.join("").includes(settings.character)) return map
            var result

            map.filter((value, index, array) => {
                value.filter((v, i, a) => {
                    if (v.includes(settings.character)) result = { val: v, row: index, indexRow: i }
                })
            })

            return result ? result : map
        },
        left: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row][pos.indexRow] == map[pos.row][0]) return map
            if (settings.walkThrough !== map[pos.row][pos.indexRow - 1] && settings.border == map[pos.row][pos.indexRow - 1]) return map // If you can walk there or not.

            result[pos.row][pos.indexRow - 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result

        },
        right: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row][pos.indexRow] == map[pos.row][map.length - 1]) return map
            if (settings.walkThrough !== map[pos.row][pos.indexRow + 1] && settings.border == map[pos.row][pos.indexRow + 1]) return map // If you can walk there or not.

            result[pos.row][pos.indexRow + 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result

        },
        up: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row] == map[0]) return map
            if (settings.walkThrough !== map[pos.row - 1][pos.indexRow] && settings.border == map[pos.row - 1][pos.indexRow]) return map // If you can walk there or not.

            result[pos.row - 1][pos.indexRow] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result
        },
        down: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row] == map[map.length - 1]) return map
            if (settings.walkThrough !== map[pos.row + 1][pos.indexRow] && settings.border == map[pos.row + 1][pos.indexRow]) return map // If you can walk there or not.

            result[pos.row + 1][pos.indexRow] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result
        }
    }

    switch (direction) {
        case "w":
            newMap = rowMap.up()
            break;

        case "s":
            newMap = rowMap.down()
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
    var formattedMap = await formatMap(currentMap)
    process.stdin.on("data", async (data) => {
        console.clear()
        data = data.toString().replace("\r\n", "")
        var keys = ["w", "a", "s", "d"]
        if (data == "v") return lastMap.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)) + "\n")
        })

        if (!keys.includes(data)) return lastMap.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)).replaceAll(settings.border, chalk.blue(settings.border)).replaceAll(settings.walkThrough, " ") + "\n")
        })

        var map = await move(data, 0, "*", formattedMap)
        lastMap = map

        map.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)).replaceAll(settings.border, chalk.blue(settings.border)).replaceAll(settings.walkThrough, " ") + "\n")
        })
    })
})()

