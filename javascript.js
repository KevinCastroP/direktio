import fetch from 'node-fetch';


async function get_data_swapi() {
    /**
     * Extract data from Star Wars API,
     * Return all characters that its height is grater or equal than 100
     */
    const data = await fetch('https://swapi.dev/api/people/')
    
    const result = await data.json()

    const finalResult = await validateHeight(result.results)
    
    console.log(finalResult)
    return finalResult
}

async function validateHeight(data) {
    /**
     * Function to validate people height
     * @param data
     */
    const result = []

    for (const person in data) {
        if(data[person].height >= 100) {
            const object = {
                "name": data[person].name,
                "height": data[person].height
            }
            result.push(object)
        }
    }
    return result
}

get_data_swapi()