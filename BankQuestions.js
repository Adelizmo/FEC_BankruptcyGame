document.getElementById('HighlightedBox').style.width = "100%"

// Game PopUp
var PopUpStatus = false
const PopUp = (text, type) => {
    var t = document.getElementById('POP_P')
    var h = document.getElementById('POP_H')
    if (PopUpStatus == false) {
        if (type == true) {
            t.innerHTML = text
            h.innerHTML = "<i id='POP_I' class='fa-solid fa-check'></i>"
            h.style.fontSize = "80px"
            document.getElementById('POP_I').style.color = "var(--b5)"
            document.getElementById('PopUpContent').classList.add('PopOut')
        }
        else if (type == false) {
            t.innerHTML = text
            h.innerHTML = "!"
            h.style.color = "red"
            h.style.fontSize = "100px"
            document.getElementById('PopUpContent').classList.add('PopOut')
        }
        PopUpStatus = true

        setTimeout(function() {
            document.getElementById('PopUpContent').classList.remove('PopOut')
            PopUpStatus = false
        }, 4000)
    }
    else {
        console.log('Wait')
    }
}
var AllGameData
var SelectedGameData
var recordedGamePlay = []
var playerPTS = 0
var playerPointsRange = [5, 10]


var currentlySelected = ""
var PickInputs = [
    document.getElementById('SLP_Name'),
    document.getElementById('SLP_DiffDetail'),
    document.getElementById('SLP_TimeDetail'),
    document.getElementById('SLP_CaseDetail'),
    // after 4
    document.getElementById('ScenarioCaseDisplay'),
    document.getElementById('ScenarioCaseOptions'),
    // after 6
    document.getElementById('End_PDMC'),
    document.getElementById('End_Message'),
    document.getElementById('End_Advice')

]
const PickBankCase = (e) => {
    if (currentlySelected != e) {
        document.getElementById('B_' + currentlySelected).classList.remove('Selected')
        document.getElementById('B_' + currentlySelected + "C").classList.remove('Selected')

        document.getElementById('B_' + e).classList.add('Selected')
        document.getElementById('B_' + e + "C").classList.add('Selected')
        currentlySelected = e

        var data = JSON.parse(document.getElementById('B_' + e).getAttribute('data-JSON'))
        PickInputs[0].innerHTML = data.FullName
        PickInputs[1].innerHTML = `Difficulty: <status class="SLP_DIF_${data.Game.Difficulty}">${data.Game.Difficulty}</status>`
        PickInputs[2].innerHTML = `Estimated Time: <i class="fa-solid fa-clock"></i>${data.Game.EstimatedTime}`
        PickInputs[3].innerHTML = data.Game.CaseDescription
    }
}
const BeginGameFunction = () => {
    let index = AllGameData.findIndex(item => item.Name === currentlySelected)

    if (index == -1) {
        console.log('Error: Game Data not found')
    }
    else {
        SelectedGameData = AllGameData[index].Game
        Game_Configuration('StartGame')
    }
}
const ChangePage = (e) => {        
    if (e == 'Main') {
        document.getElementById('MainPage').classList.add('hidden')
        document.getElementById('SelectLevelPage').classList.remove('hidden')
        document.getElementById('ScenarioQuestionPage').classList.add('hidden')
        document.getElementById('ScenarioEndPage').classList.add('hidden')
        ColumnStyling(false)
    }
    else if (e == 'Questions') {
        document.getElementById('MainPage').classList.add('hidden')
        document.getElementById('SelectLevelPage').classList.add('hidden')
        document.getElementById('ScenarioQuestionPage').classList.remove('hidden')
        document.getElementById('ScenarioEndPage').classList.add('hidden')
        ColumnStyling(true)
    }
    else if (e == 'End') {
        document.getElementById('MainPage').classList.add('hidden')
        document.getElementById('SelectLevelPage').classList.add('hidden')
        document.getElementById('ScenarioQuestionPage').classList.add('hidden')
        document.getElementById('ScenarioEndPage').classList.remove('hidden')
        ColumnStyling(true)
    }
}

// Decisions function
var currentSenario
var pastSelection = undefined
const RenderLevel = (e) => {
    currentSenario = e
    pastSelection = undefined
    PickInputs[4].innerHTML = `<p class="Animation_Appear">${e.Scenario}</p>`
    // PickInputs[4].style.animation = "AppearFromLeft 0.75s ease-in-out forwards"

    //render options
    PickInputs[5].innerHTML = `<p class="Animation_Appear" style="text-align: center; color: gray; font-size: 30px;">Select the optimal choice for this case.</p>`

    for (i = 0; i < e.ScenarioOptions.length; i++) {
        PickInputs[5].innerHTML += `
            <div class="ScenarioCaseOption Animation_Appear">
                <p>${e.ScenarioOptions[i].Option}</p>
                <div onclick="ChangeDecision(${i})" id="SQC_Option${i}" class="SCO_SelectionBox">
                    <div id="SQ_Option${i}" class="SCO_Selector"><i class="fa-solid fa-check"></i></div>
                </div>
            </div>
        `
    }
}
const ChangeDecision = (e) => {
    if (pastSelection == undefined) {
        document.getElementById('SQ_Option' + e).classList.add('Selected')
        pastSelection = e
    }
    else if (e == pastSelection) {

    }
    else {
        document.getElementById('SQ_Option' + e).classList.add('Selected')
        document.getElementById('SQ_Option' + pastSelection).classList.remove('Selected')
        pastSelection = e
    }
}




var currentLevel = 1;
const Game_Configuration = (e) => {
    if (e == 'StartGame') {
        currentLevel = 1;

        let index = SelectedGameData.Levels.findIndex(item => item.LevelNb === currentLevel)
        var starterScenario = SelectedGameData.Levels[index]
        RenderLevel(starterScenario)
        ChangePage('Questions')
        recordedGamePlay = []
    }
    else if (e == 'Next') {
        var data = currentSenario.ScenarioOptions[pastSelection]
        if (data == undefined) {
            PopUp('Select an option <br> to continue', false)
        }
        else {
            var sen = currentSenario.Scenario
            var data_Name = data.Option
            var data_Points = data.OptionPTS
            var data_Lead = data.OptionLead
            var data_Explain = data.OptionExplaination
    
            if (data.OptionCause == "Cont.") {
                recordedGamePlay.push({
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain
                })
                console.log(recordedGamePlay)
                playerPTS += data_Points
    
                currentLevel = data_Lead
                let index = SelectedGameData.Levels.findIndex(item => item.LevelNb === currentLevel)
                var Scenario = SelectedGameData.Levels[index]
                RenderLevel(Scenario)
            }
            else if (data.OptionCause == "Victory") {
                recordedGamePlay.push({
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain
                })

                var data_Why = data.OptionWhy

                PickInputs[7].innerHTML = "Congrats, You've Saved The Bank"
                PickInputs[7].style.color = "green"
                PickInputs[8].innerHTML = data_Why
                PickInputs[6].innerHTML = ""
                for (i = 0; i < recordedGamePlay.length; i++) {
                    PickInputs[6].innerHTML += `
                        <div class="End_CaseContainer">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                <p class="End_Explain">${recordedGamePlay[i].OptionExplain}</p>
                            </div>
                        </div>
                    `
                    if (i == recordedGamePlay.length - 1) {
                        PickInputs[6].innerHTML += `
                            <div style="padding-block: 50px; width: 100%;"></div>
                        `
                    }
                }
                ChangePage('End')
            }
            else if (data.OptionCause == "Lost") {
                recordedGamePlay.push({
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain
                })

                var data_Why = data.OptionWhy

                PickInputs[7].innerHTML = "Failed to prevent Bankruptcy."
                PickInputs[7].style.color = "darkred"
                PickInputs[8].innerHTML = data_Why
                PickInputs[6].innerHTML = ""
                for (i = 0; i < recordedGamePlay.length; i++) {
                    PickInputs[6].innerHTML += `
                        <div class="End_CaseContainer">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                <p class="End_Explain">${recordedGamePlay[i].OptionExplain}</p>
                            </div>
                        </div>
                    `
                    if (i == recordedGamePlay.length - 1) {
                        PickInputs[6].innerHTML += `
                            <div style="padding-block: 50px; width: 100%;"></div>
                        `
                    }
                }
                ChangePage('End')
            }  
        } 
    }
}
var currentCaseShowStatus = false
const End_ShowCasees = () => {
    var doc = document.getElementsByClassName('End_Scenario')
    console.log(currentCaseShowStatus)
    if (currentCaseShowStatus == false) {
        document.getElementById('ViewAllScenarios').innerHTML = "Close Cases"
        for (i = 0; i < document.getElementsByClassName('End_Scenario').length; i++) {
            doc[i].style.display = "flex"
        } 
        currentCaseShowStatus = true
    }
    else if (currentCaseShowStatus == true) {
        document.getElementById('ViewAllScenarios').innerHTML = "View Cases"
        for (i = 0; i < document.getElementsByClassName('End_Scenario').length; i++) {
            doc[i].style.display = "none"
        }
        currentCaseShowStatus = false
    }
}



const Game_Setup = () => {
    var length = AllGameData.length
    document.getElementById('SLP_LevelsDisplay').innerHTML = ""
    for (i = 0; i < length; i++) {
        var name = AllGameData[i].Name
        var js = AllGameData[i]
        js = JSON.stringify(js)
        if (i == 0) {
            document.getElementById('SLP_LevelsDisplay').innerHTML += `
            <div class="SLP_Level">
                <h4>${AllGameData[i].FullName}</h4>
                <div data-JSON='${js}' id="B_${name}" onclick="PickBankCase('${name}')" class="SLP_LevelCheckBox Selected">
                    <i id="B_${name}C" class="Selected SLP_LevelCheck fa-solid fa-check"></i>
                </div>
            </div>
            `
            currentlySelected = name

            PickInputs[0].innerHTML = AllGameData[i].FullName
            PickInputs[1].innerHTML = `Difficulty: <status class="SLP_DIF_${AllGameData[i].Game.Difficulty}">${AllGameData[i].Game.Difficulty}</status>`
            PickInputs[2].innerHTML = `Estimated Time: <i class="fa-solid fa-clock"></i>${AllGameData[i].Game.EstimatedTime}`
            PickInputs[3].innerHTML = AllGameData[i].Game.CaseDescription

        }
        else {
            document.getElementById('SLP_LevelsDisplay').innerHTML += `
            <div class="SLP_Level">
                <h4>${AllGameData[i].FullName}</h4>
                <div data-JSON='${js}' id="B_${name}" onclick="PickBankCase('${name}')" class="SLP_LevelCheckBox">
                    <i id="B_${name}C" class="SLP_LevelCheck fa-solid fa-check"></i>
                </div>
            </div>
            `
        }
    }
} 

fetch("BankQ.json")
.then(response => response.json())
.then(json => { 
    json = json[0]
    AllGameData = json.GameData

    Game_Setup()
})



const ColumnStyling = (e) => {
    var length = 6
    var bounds = [80, 50, 30, 30, 50, 80]
    for (i = 0; i < length; i++) {
        var height = Math.random() * (15) + bounds[i]
        document.getElementById('SBC_' + (i + 1)).style.height = height + "%"
    }

    if (e == false) {
        for (i = 0; i < length; i++) {
            document.getElementById('SBC_' + (i + 1)).style.display = "none";
        }
    }
    else if (e == true) {
        for (i = 0; i < length; i++) {
            document.getElementById('SBC_' + (i + 1)).style.display = "flex";
        }
    }
}
ColumnStyling()
var interval = setInterval(ColumnStyling, 1500)
