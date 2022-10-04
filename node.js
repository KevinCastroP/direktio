import { EventEmitter } from 'events'
import fetch from 'node-fetch'
import fs from 'fs'


const eventEmitter = new EventEmitter()
var args = process.argv


eventEmitter.on('setpeople', async function () {
    const data = await getDataSwapi()
    await writeJsonFile(data)
    console.log('Command: setpeople')
})

eventEmitter.on('getpeople', async function () {
    const sortedBy = ""
    await readJsonFile(sortedBy)
    console.log('Command: getpeople')
})

eventEmitter.on('getpeopleby', async function () {
    const sortedBy = args[3]
    await readJsonFile(sortedBy)
    console.log('Command: getpeopleby')
})

eventEmitter.on('postpeople', async function () {
    // --json-object='{"key1": "value1", "key2": "value2", "key3": "value3"}'
    const newObject = args[3]
    await insertNewPeople(newObject)
    console.log('Command: postpeople')
})

eventEmitter.on('unsetpeoplebyid', async function () {
    const positionId = args[3]
    await deleteById(positionId)
    console.log('Command: unsetpeoplebyid')
})

if (args[2] === "setpeople" && args.length <= 3) {
    eventEmitter.emit('setpeople')
} else if (args[2] === "getpeople" && args.length <= 3) {
    eventEmitter.emit('getpeople')
} else if (args[2] === "getpeopleby") {
    eventEmitter.emit('getpeopleby')
} else if (args[2] === "postpeople") {
    eventEmitter.emit('postpeople')
} else if (args[2] === "unsetpeoplebyid") {
    eventEmitter.emit('unsetpeoplebyid')
} else {
    console.log("Error: Please review commands")
}

async function getDataSwapi() {
    /**
     * Extract data from Star Wars API,
     * Return all characters
     */
    const data = await fetch('https://swapi.dev/api/people/')

    const result = await data.json()

    const finalResult = await organizeData(result.results)

    return finalResult
}

async function organizeData(data) {
    /**
     * Function to organize data before insert
     * @param data
     */
    const result = []

    for (const person in data) {
        const object = {
            "name": data[person].name,
            "height": data[person].height,
            "mass": data[person].mass
        }
        result.push(object)
    }
    return result
}

async function writeJsonFile(data) {
    /**
     * Function to write a json file with all data
     * @param data
     */
    fs.writeFile('./characters.json', JSON.stringify(data), (err) => {
        if (err) throw err
    })
}

async function readJsonFile(sorted) {
    /**
     * Function to read file and sort data
     * @param sorted
     */
    if (sorted !== "") {
        fs.readFile('./characters.json', (err, data) => {
            if (err) throw err
            let people = JSON.parse(data)
            if (sorted === "name" || sorted === "mass" || sorted === "height") {
                console.log(people.sort((a, b) => b[sorted] - a[sorted]))
            } else {
                console.log("Property not supported")
            }
        })
    } else {
        fs.readFile('./characters.json', (err, data) => {
            if (err) throw err
            let people = JSON.parse(data)
            console.log(people)
        })
    }
}

async function insertNewPeople(object) {
    /**
     * Function to insert a new object in file
     * @param object
     */
    fs.readFile('./characters.json', async (err, data) => {
        if (err) throw err
        let people = JSON.parse(data)
        object = object.split("=")
        const newObj = object[1]
        people.push(JSON.parse(newObj))
        await writeJsonFile(people)
        console.log("New object saved!\n", people)
    })
}

async function deleteById(id) {
    /**
     * Function to delete by id
     * @param id
     */
    fs.readFile('./characters.json', async (err, data) => {
        if (err) throw err
        let people = JSON.parse(data)
        await writeDeleteNames(id, people)
        people.splice(id, 1)
        await writeJsonFile(people)
        console.log("Object deleted!\n", people)
    })
}

async function writeDeleteNames(id, peopleArr) {
    /**
     * Function to write deleted names in txt file
     * @param id
     */
    for (let obj in peopleArr) {
        if (obj === id) {
            let names = peopleArr[obj].name
            await writeTXT(names)
        }
    }
}

async function writeTXT(name) {
    /**
     * Write data to TXT file.
     * @param name
     */
    const existIn = "./names.txt"

    fs.appendFileSync(
        existIn,
        `${name}\n`
    )
}
