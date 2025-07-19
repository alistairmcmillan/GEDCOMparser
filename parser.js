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
    for(ln in lines) {

        // INDI indicates the start of a new person
        if (lines[ln].substring(lines[ln].length-4) === "INDI") {
            newPerson = true;
            currentPerson = "";
            currentBirth = "";
        }

        if (newPerson && lines[ln].startsWith("1 NAME")) {
            var clean = lines[ln].substring(7).replace('/','')
            currentPerson = clean.replace('/','')
            newPerson = false;
            gotName = true;
        }

        if (lines[ln].startsWith("1 BIRT")) {
            newBirth = true;
            currentBirth = "";
        }

        if (newBirth && lines[ln].startsWith("2 DATE")) {
            currentBirth = lines[ln].substring(lines[ln].length-4)
            newBirth = false
            gotBirth = true
        }

        if (gotName === true && gotBirth === true) {
            count++
            self.postMessage(`${count} ${currentPerson} (${currentBirth})\n`)
            gotName = false
            gotBirth = false
        }

    }
}
