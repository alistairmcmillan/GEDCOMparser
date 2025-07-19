self.onmessage = (event) => {
    console.log(`self.onmessage called`)
    const gedcomData = event.data;
    self.postMessage(parseData(gedcomData));
}

function parseData(data) {
    console.log(`parseData called`)
    var newPerson = true
    var newBirth = false
    var gotName = false
    var gotBirth = false
    var currentPerson = ""
    var currentBirth = ""

    var lines = data.split('\n')

    var count = 0

    // Then search through the entire file
    for(const line of lines) {

        switch(line.substring(0,6)) {
            case "1 NAME":
                if (newPerson) {
                    var clean = line.substring(7).replace('/','')
                    currentPerson = clean.replace('/','')
                    newPerson = false;
                    gotName = true;
                }
                break
            case "1 BIRT":
                newBirth = true
                currentBirth = ""
                break
            case "2 DATE":
                if (newBirth) {
                    currentBirth = line.substring(line.length-4)
                    newBirth = false
                    gotBirth = true
                }
                break
        }

        // INDI indicates the start of a new person
        if (line.substring(line.length-4) === "INDI") {
            newPerson = true;
            currentPerson = "";
            currentBirth = "";
        }

        if (gotName === true && gotBirth === true) {
            count++
            self.postMessage(`${count} ${currentPerson} (${currentBirth})\n`)
            gotName = false
            gotBirth = false
        }

    }
}
