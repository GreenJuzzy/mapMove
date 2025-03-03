// Imports
var fs = require("fs");
var process = require("process");
var chalk = reire("chalk")


// Definitions
var crrentMap  fs.readFileSync(__dirname + "/map.txt", "utf-8")
var lastMap

process.stdin.setRawMode(true)

const settings = {
    character: "*",
    border: "#",
    walkThrough: "-",
    spacing: 5,
    interactable: ""
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
 * @param {( "w" | "s" | "a" | "d")} direction Direction of movement.
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
                value.filter((v, i) => {
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
            if (!settings.walkThrough.includes(map[pos.row][pos.indexRow - 1]) || settings.border == map[pos.row][pos.indexRow - 1]) return map // If you can walk there or not.

            result[pos.row][pos.indexRow - 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result

        },
        right: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row][pos.indexRow] == map[pos.row][map[pos.row].length - 1]) return map
            if (!settings.walkThrough.includes(map[pos.row][pos.indexRow + 1]) || settings.border == map[pos.row][pos.indexRow + 1]) return map

            result[pos.row][pos.indexRow + 1] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result
        },
        up: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row][pos.indexRow] == map[0][pos.indexRow]) return map
            if (!settings.walkThrough.includes(map[pos.row - 1][pos.indexRow]) || settings.border == map[pos.row - 1][pos.indexRow]) return map

            result[pos.row - 1][pos.indexRow] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result
        },
        down: async () => {
            if (!map.join("").includes(settings.character)) return map

            var result = map
            var pos = await rowMap.row()

            if (map[pos.row][pos.indexRow] == map[map.length - 1][pos.indexRow]) return map
            if (!settings.walkThrough.includes(map[pos.row + 1][pos.indexRow]) || settings.border == map[pos.row + 1][pos.indexRow]) return map

            result[pos.row + 1][pos.indexRow] = settings.character
            result[pos.row][pos.indexRow] = settings.walkThrough

            return result
        }
    }

    switch (direction) {
        case "w":
            newMap = rowMap.up()
            if (newMap == map) newMap = map
            break;

        case "s":
            newMap = rowMap.down()
            if (newMap == map) newMap = map
            break;

        case "a":
            newMap = rowMap.left()
            if (newMap == map) newMap = map
            break;

        case "d":
            newMap = rowMap.right()
            if(newMap == map) newMap = map
            break;
    }

    return newMap
}

(async () => {
    var formattedMap = await formatMap(currentMap)
    process.stdin.on("data", async (data) => {
        console.clear()
        process.stdout.write('\u001B[?25l')
        data = data.toString().replace("\r\n", "")
        var keys = ["w", "a", "s", "d"]
        if (data == "v") return lastMap.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)) + "\n")
        })

        if (!keys.includes(data)) return lastMap.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)).replaceAll(settings.border, chalk.blue(settings.border)).replaceAll(settings.walkThrough, " ") + "\n")
        })

        if (JSON.stringify(map) == JSON.stringify(await move(data, 0, settings.character, formattedMap))) return
        var map = await move(data, 0, settings.character, formattedMap)
        
        lastMap = map

        map.forEach((value, index) => {
            console.log("  " + value.join(" ".repeat(settings.spacing)).replace(settings.character, chalk.red(settings.character)).replaceAll(settings.border, chalk.blue(settings.border)).replaceAll(settings.walkThrough, " ") + "\n")
        })
    })
})()
