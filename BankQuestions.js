var slider = document.getElementsByClassName('HighlightedBox')
slider[0].style.width = "100%";
slider[1].style.width = "100%";


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
var playerPointsRange = [9.25, 19]
var timer = document.getElementById('TimeIndicator')

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
    document.getElementById('End_Advice'),
    document.getElementById('End_PlayerTitle'),
    document.getElementById('End_ContentContainer'),
    //after 11
    document.getElementById('SLP_Name_AR'),
    document.getElementById('SLP_DiffDetail_AR'),
    document.getElementById('SLP_TimeDetail_AR'),
    document.getElementById('SLP_CaseDetail_AR'),
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

        PickInputs[11].innerHTML = data.FullName_Ar
        PickInputs[12].innerHTML = `صعوبة: <status class="SLP_DIF_${data.Game.Difficulty}">${data.Game.Difficulty_Ar}</status>`
        PickInputs[13].innerHTML = `الزمن المتوقع: <i class="fa-solid fa-clock"></i>${data.Game.EstimatedTime_Ar}`
        PickInputs[14].innerHTML = data.Game.CaseDescription_Ar
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
    else if (e == 'Back') {
        document.getElementById('MainPage').classList.remove('hidden')
        document.getElementById('SelectLevelPage').classList.add('hidden')
        document.getElementById('ScenarioQuestionPage').classList.add('hidden')
        document.getElementById('ScenarioEndPage').classList.add('hidden')
        ColumnStyling(true)
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
    PickInputs[4].innerHTML = `
        <p class="EnglishText Animation_Appear">${e.Scenario}</p>
        <p class="ScenarioCaseFONT ArabicText Animation_Appear">${e.Scenario_Ar}</p>
    `
    // PickInputs[4].style.animation = "AppearFromLeft 0.75s ease-in-out forwards"

    //render options
    PickInputs[5].innerHTML = `
        <p class="EnglishText Animation_Appear" style="color: gray; font-size: 30px; text-align: center;">Select the optimal choice for this case.</p>
        <p class="ArabicText Animation_Appear" style="color: gray; font-size: 30px; text-align: center;">اختر الخيار الأمثل لهذه الحالة</p>
    `

    for (i = 0; i < e.ScenarioOptions.length; i++) {
        PickInputs[5].innerHTML += `
            <div class="ScenarioCaseOption Text_Layout Animation_Appear">
                <p class="EnglishText_Pure ScenarioCaseP">${e.ScenarioOptions[i].Option}</p>
                <p class="ArabicText_Pure ScenarioCaseP">${e.ScenarioOptions[i].Option_Ar}</p>
                <div onclick="ChangeDecision(${i})" id="SQC_Option${i}" class="SCO_SelectionBox">
                    <div id="SQ_Option${i}" class="SCO_Selector"><i class="fa-solid fa-check"></i></div>
                </div>
            </div>
        `
    }
    Game_ChangeLanguage('reapply')

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

// Game timing function (Experimental)
var inv = undefined
const Game_Timing = (type, min) => {
    if (type == "Set") {
        var countdownTime = new Date().getTime() + min * 60 * 1000;
        timer.style.opacity = "1"
        inv = setInterval(function() {
            var now = new Date().getTime()
            var timeLeft = countdownTime - now

            var hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            if (minutes == 0 && seconds < 10) {
                timer.style.color = "red"
            }
            if (seconds <= 9) {
                seconds = "0" + seconds
            }
            timer.innerHTML = `${minutes}:${seconds}`

            if (minutes == 0 && seconds == "00") {
                clearInterval(inv)
               
                console.log('Game Over')
                var data = currentSenario.ScenarioOptions[pastSelection]

                if (data == undefined) {
                    PickInputs[10].style.height = "calc(100% - 230px)"
                    PickInputs[9].style.display = "none"

                    PickInputs[7].style.color = "darkred"
                    global_message = "ran out of time"

                    PickInputs[8].innerHTML = "You can't buy Time nor Health"
                    document.getElementById('End_Advice_Ar').innerHTML = "لا يمكنك شراء الوقت ولا الصحة"

                    PickInputs[6].innerHTML = ""
                    for (i = 0; i < recordedGamePlay.length; i++) {
                        PickInputs[6].innerHTML += `
                            <div class="End_CaseContainer EnglishText">
                                <div class="End_CaseNB"><p>${i + 1}</p></div>
                                <div class="End_DecisionContainer">
                                    <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                    <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                    <p class="End_Explain">${"Explanation: " + recordedGamePlay[i].OptionExplain}</p>
                                </div>
                            </div>
                            <div style="display: none;" class="End_CaseContainer ArabicText">
                                <div class="End_CaseNB"><p>${i + 1}</p></div>
                                <div class="End_DecisionContainer">
                                    <p style="text-align: end" class="End_Scenario">${recordedGamePlay[i].OptionScenario_Ar}</p>
                                    <p style="text-align: end" class="End_Decision">${recordedGamePlay[i].Option_Ar}</p>
                                    <p style="text-align: end" class="End_Explain">${"توضيح: " + recordedGamePlay[i].OptionExplain_Ar}</p>
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
                    Game_ChangeLanguage('reapply')
                }
                else {
                    var sen = currentSenario.Scenario
                    var sen_Ar = currentSenario.Scenario_Ar
        
                    var data_Name = data.Option
                    var data_Name_Ar = data.Option_Ar
        
                    var data_Points = data.OptionPTS
                    var data_Lead = data.OptionLead
        
                    var data_Explain = data.OptionExplaination
                    var data_Explain_Ar = data.Optionxplanation_Ar
                    recordedGamePlay.push({
                        OptionScenario_Ar: sen_Ar,
                        OptionScenario: sen,
                        Option: data_Name,
                        OptionExplain: data_Explain,
                        Option_Ar: data_Name_Ar,
                        OptionExplain_Ar: data_Explain_Ar,
                    })
                    playerPTS += data_Points

                    PickInputs[10].style.height = "calc(100% - 230px)"
                    PickInputs[9].style.display = "none"

                    PickInputs[7].style.color = "darkred"
                    global_message = "ran out of time"

                    PickInputs[8].innerHTML = "You can't buy Time nor Health"
                    document.getElementById('End_Advice_Ar').innerHTML = "لا يمكنك شراء الوقت ولا الصحة"

                    PickInputs[6].innerHTML = ""
                    for (i = 0; i < recordedGamePlay.length; i++) {
                        PickInputs[6].innerHTML += `
                            <div class="End_CaseContainer EnglishText">
                                <div class="End_CaseNB"><p>${i + 1}</p></div>
                                <div class="End_DecisionContainer">
                                    <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                    <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                    <p class="End_Explain">${"Explanation: " + recordedGamePlay[i].OptionExplain}</p>
                                </div>
                            </div>
                            <div style="display: none;" class="End_CaseContainer ArabicText">
                                <div class="End_CaseNB"><p>${i + 1}</p></div>
                                <div class="End_DecisionContainer">
                                    <p style="text-align: end" class="End_Scenario">${recordedGamePlay[i].OptionScenario_Ar}</p>
                                    <p style="text-align: end" class="End_Decision">${recordedGamePlay[i].Option_Ar}</p>
                                    <p style="text-align: end" class="End_Explain">${"توضيح: " + recordedGamePlay[i].OptionExplain_Ar}</p>
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
                    Game_ChangeLanguage('reapply')
                }
                
            }
        }, 100)
    }
    else if (type == "End") {
        if (inv == undefined) {
            
        }
        else {
            clearInterval(inv)
        }
    }

}
// -----
var global_message = true
var currentLevel = 1;
const Game_Configuration = (e) => { 
    if (e == 'StartGame') {
        currentLevel = 1;

        Game_Timing("Set", 4.5)

        if (SelectedGameData.Levels == undefined) {
            PopUp('This Case is still<br>under development.', false)
        }
        else {
            let index = SelectedGameData.Levels.findIndex(item => item.LevelNb === currentLevel)
            var starterScenario = SelectedGameData.Levels[index]
            RenderLevel(starterScenario)
            ChangePage('Questions')
            recordedGamePlay = []
        }
    }
    else if (e == 'Next') {
        var data = currentSenario.ScenarioOptions[pastSelection]
        if (data == undefined) {
            PopUp('Select an option <br> to continue', false)
        }
        else {
            var sen = currentSenario.Scenario
            var sen_Ar = currentSenario.Scenario_Ar

            var data_Name = data.Option
            var data_Name_Ar = data.Option_Ar

            var data_Points = data.OptionPTS
            var data_Lead = data.OptionLead

            var data_Explain = data.OptionExplaination
            var data_Explain_Ar = data.Optionxplanation_Ar
           
            if (data.OptionCause == "Cont.") {
                recordedGamePlay.push({
                    OptionScenario_Ar: sen_Ar,
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain,
                    Option_Ar: data_Name_Ar,
                    OptionExplain_Ar: data_Explain_Ar,
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
                    OptionScenario_Ar: sen_Ar,
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain,
                    Option_Ar: data_Name_Ar,
                    OptionExplain_Ar: data_Explain_Ar,
                })

                playerPTS += data_Points
                Game_WinPlayerTitle(playerPTS)

                var data_Why = data.OptionWhy
                var data_Why_Ar = data.OptionWhy_Ar

                PickInputs[10].style.height = " calc(100% - 281px)"
                PickInputs[9].style.display = "flex"

                global_message = true
                PickInputs[7].style.color = "green"
                PickInputs[8].innerHTML = data_Why
                document.getElementById('End_Advice_Ar').innerHTML = data_Why_Ar
                PickInputs[6].innerHTML = ""
                for (i = 0; i < recordedGamePlay.length; i++) {
                    PickInputs[6].innerHTML += `
                        <div class="End_CaseContainer EnglishText">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                <p class="End_Explain">${"Explanation: " + recordedGamePlay[i].OptionExplain}</p>
                            </div>
                        </div>
                        <div style="display: none;" class="End_CaseContainer ArabicText">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p style="text-align: end" class="End_Scenario">${recordedGamePlay[i].OptionScenario_Ar}</p>
                                <p style="text-align: end" class="End_Decision">${recordedGamePlay[i].Option_Ar}</p>
                                <p style="text-align: end" class="End_Explain">${"توضيح: " + recordedGamePlay[i].OptionExplain_Ar}</p>
                            </div>
                        </div>
                    `
                    if (i == recordedGamePlay.length - 1) {
                        PickInputs[6].innerHTML += `
                            <div style="padding-block: 50px; width: 100%;"></div>
                        `
                    }
                }
                Game_Timing('End')
                ChangePage('End')
                Game_ChangeLanguage('reapply')
            }
             else if (data.OptionCause == "Lost") {
                recordedGamePlay.push({
                    OptionScenario_Ar: sen_Ar,
                    OptionScenario: sen,
                    Option: data_Name,
                    OptionExplain: data_Explain,
                    Option_Ar: data_Name_Ar,
                    OptionExplain_Ar: data_Explain_Ar,
                })
                var data_Why = data.OptionWhy
                var data_Why_Ar = data.OptionWhy_Ar
                
                PickInputs[10].style.height = "calc(100% - 230px)"
                PickInputs[9].style.display = "none"

                global_message = false
                PickInputs[7].style.color = "darkred"
                PickInputs[8].innerHTML = data_Why
                document.getElementById('End_Advice_Ar').innerHTML = data_Why_Ar
                PickInputs[6].innerHTML = ""
                for (i = 0; i < recordedGamePlay.length; i++) {
                    PickInputs[6].innerHTML += `
                        <div class="End_CaseContainer EnglishText">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p class="End_Scenario">${recordedGamePlay[i].OptionScenario}</p>
                                <p class="End_Decision">${recordedGamePlay[i].Option}</p>
                                <p class="End_Explain">${"Explanation: " + recordedGamePlay[i].OptionExplain}</p>
                            </div>
                        </div>
                        <div style="display: none;" class="End_CaseContainer ArabicText">
                            <div class="End_CaseNB"><p>${i + 1}</p></div>
                            <div class="End_DecisionContainer">
                                <p style="text-align: end" class="End_Scenario">${recordedGamePlay[i].OptionScenario_Ar}</p>
                                <p style="text-align: end" class="End_Decision">${recordedGamePlay[i].Option_Ar}</p>
                                <p style="text-align: end" class="End_Explain">${"توضيح: " + recordedGamePlay[i].OptionExplain_Ar}</p>
                            </div>
                        </div>
                    `
                    if (i == recordedGamePlay.length - 1) {
                        PickInputs[6].innerHTML += `
                            <div style="padding-block: 50px; width: 100%;"></div>
                        `
                    }
                }
                Game_Timing('End')
                ChangePage('End')
                Game_ChangeLanguage('reapply')
            }  
        } 
    }
    console.log(playerPTS)
}
const Game_WinPlayerTitle = (e) => {
    if (e <= 11) 
        PickInputs[9].innerHTML = "<p class='EnglishText' style='color: black;'>Title:</p> <span class='EnglishText' id='End_PlayerTitleCallingCard'>The Turnaround Titan</span> <span class='ArabicText' id='End_PlayerTitleCallingCard'>العبقري الإداري</span> <p class='ArabicText' style='color: black;'>:لقب</p>"

    else if (e > 11 && e <= 13)
        PickInputs[9].innerHTML = "<p class='EnglishText' style='color: black;'>Title:</p> <span class='EnglishText' id='End_PlayerTitleCallingCard'>The Innovation Architect</span> <span class='ArabicText' id='End_PlayerTitleCallingCard'>الزعيم المالي</span> <p class='ArabicText' style='color: black;'>:لقب</p>"

    else if (e > 13 && e <= 15)
        PickInputs[9].innerHTML = "<p class='EnglishText' style='color: black;'>Title:</p> <span class='EnglishText' id='End_PlayerTitleCallingCard'>The Bankruptcy Buster</span> <span class='ArabicText' id='End_PlayerTitleCallingCard'>قائد الابتكار</span> <p class='ArabicText' style='color: black;'>:لقب</p>"

    else if (e > 15 && e <= 18)
        PickInputs[9].innerHTML = "<p class='EnglishText' style='color: black;'>Title:</p> <span class='EnglishText' id='End_PlayerTitleCallingCard'>The Strategic Conqueror</span> <span class='ArabicText' id='End_PlayerTitleCallingCard'>محقق الرؤى</span> <p class='ArabicText' style='color: black;'>:لقب</p>"
    
    else if (e > 18)
        PickInputs[9].innerHTML = "<p class='EnglishText' style='color: black;'>Title:</p> <span class='EnglishText' id='End_PlayerTitleCallingCard'>The Apex Executor</span> <span class='ArabicText' id='End_PlayerTitleCallingCard'>الملك المالي</span> <p class='ArabicText' style='color: black;'>:لقب</p>"
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
            <div class="SLP_Level Text_Layout">
                <h4 class="EnglishText">${AllGameData[i].FullName}</h4>
                <h4 style="display: none;" class="ArabicText">${AllGameData[i].FullName_Ar}</h4>
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

            PickInputs[11].innerHTML = AllGameData[i].FullName_Ar
            PickInputs[12].innerHTML = `صعوبة: <status class="SLP_DIF_${AllGameData[i].Game.Difficulty}">${AllGameData[i].Game.Difficulty_Ar}</status>`
            PickInputs[13].innerHTML = `الزمن المتوقع: <i class="fa-solid fa-clock"></i>${AllGameData[i].Game.EstimatedTime_Ar}`
            PickInputs[14].innerHTML = AllGameData[i].Game.CaseDescription_Ar

        }
        else {
            document.getElementById('SLP_LevelsDisplay').innerHTML += `
            <div class="SLP_Level">
                <h4 class="EnglishText">${AllGameData[i].FullName}</h4>
                <h4 style="display: none;" class="ArabicText">${AllGameData[i].FullName_Ar}</h4>
                <div data-JSON='${js}' id="B_${name}" onclick="PickBankCase('${name}')" class="SLP_LevelCheckBox">
                    <i id="B_${name}C" class="SLP_LevelCheck fa-solid fa-check"></i>
                </div>
            </div>
            `
        }
    }
} 

// Retry Function
const Game_Retry = () => {
    ChangePage('Back')
    playerPTS = 0
    recordedGamePlay = []
    timer.style.color = "white"
    clearInterval(inv)
    timer.style.opacity = "0"
    inv = undefined
    Game_Timing('End')
}

// Change Language
var currentLanguage = "En"
const Game_ChangeLanguage = (type) => {
    var lang1 = document.getElementsByClassName('EnglishText')
    var lang2 = document.getElementsByClassName('ArabicText')

    var lang3 = document.getElementsByClassName('EnglishText_Pure')
    var lang4 = document.getElementsByClassName('ArabicText_Pure')

    var lang_layout = document.getElementsByClassName('Text_Layout')
    var lang_Qalign = document.getElementsByClassName('ScenarioCaseP')

    if (type == "reapply") {
        if (currentLanguage == "Ar") {
            for (i = 0; i < lang1.length; i++) {
                lang1[i].style.display = "none" 
             }
             for (i = 0; i < lang2.length; i++) {
                 lang2[i].style.display = "flex" 
             }
             //pure
             for (i = 0; i < lang3.length; i++) {
                 lang3[i].style.display = "none" 
             }
             for (i = 0; i < lang4.length; i++) {
                 lang4[i].style.display = "block" 
             }
            // layout
            for (i = 0; i < lang_layout.length; i++) {
                lang_layout[i].style.flexDirection = "row-reverse"
            }
            for (i = 0; i < lang_Qalign.length; i++) {
                lang_Qalign[i].style.textAlign = "end" 
            }
            currentLanguage = "Ar"
            if (global_message == true) {
                PickInputs[7].innerHTML = "مبروك! لقد أنقذت البنك"
            }
            else if (global_message == "ran out of time") {
                PickInputs[7].innerHTML = "لقد انتهى الوقت"
            }
            else {
                PickInputs[7].innerHTML = "حاول مرة أخرى"
            }
        }
        else if (currentLanguage == "En") {
            for (i = 0; i < lang1.length; i++) {
                lang1[i].style.display = "flex" 
             }
     
             for (i = 0; i < lang2.length; i++) {
                 lang2[i].style.display = "none" 
             }
             //pure
             for (i = 0; i < lang3.length; i++) {
                 lang3[i].style.display = "block" 
             }
             for (i = 0; i < lang4.length; i++) {
                 lang4[i].style.display = "none" 
             }
            // layout
            for (i = 0; i < lang_layout.length; i++) {
                lang_layout[i].style.flexDirection = "row"
            }
            for (i = 0; i < lang_Qalign.length; i++) {
                lang_Qalign[i].style.textAlign = "start" 
            }
            currentLanguage = "En"
            if (global_message == true) {
                PickInputs[7].innerHTML = "Congrats! You've saved the bank"
            }
            else if (global_message == "ran out of time") {
                PickInputs[7].innerHTML =  "You ran out of time."
            }
            else {
                PickInputs[7].innerHTML = "Try Again"
            }
        }
    }
    else if (type == "Arabic") {
        for (i = 0; i < lang1.length; i++) {
           lang1[i].style.display = "none" 
        }
        for (i = 0; i < lang2.length; i++) {
            lang2[i].style.display = "flex" 
        }
        //pure
        for (i = 0; i < lang3.length; i++) {
            lang3[i].style.display = "none" 
        }
        for (i = 0; i < lang4.length; i++) {
            lang4[i].style.display = "block" 
        }
        // layout
        for (i = 0; i < lang_layout.length; i++) {
            lang_layout[i].style.flexDirection = "row-reverse"
        }
        for (i = 0; i < lang_Qalign.length; i++) {
            lang_Qalign[i].style.textAlign = "end" 
        }
        currentLanguage = "Ar"
        if (global_message == true) {
            PickInputs[7].innerHTML = "مبروك! لقد أنقذت البنك"
        }
        else if (global_message == "ran out of time") {
            PickInputs[7].innerHTML = "لقد انتهى الوقت"
        }
        else {
            PickInputs[7].innerHTML = "حاول مرة أخرى"
        }
    }
    else if (type == "English") {
        for (i = 0; i < lang1.length; i++) {
           lang1[i].style.display = "flex" 
        }

        for (i = 0; i < lang2.length; i++) {
            lang2[i].style.display = "none" 
        }
        //pure
        for (i = 0; i < lang3.length; i++) {
            lang3[i].style.display = "block" 
        }
        for (i = 0; i < lang4.length; i++) {
            lang4[i].style.display = "none" 
        }
        // layout
        for (i = 0; i < lang_layout.length; i++) {
            lang_layout[i].style.flexDirection = "row" 
        }
        for (i = 0; i < lang_Qalign.length; i++) {
            lang_Qalign[i].style.textAlign = "start" 
        }
        currentLanguage = "En"
        if (global_message == true) {
            PickInputs[7].innerHTML = "Congrats! You've saved the bank"
        }
        else if (global_message == "ran out of time") {
            PickInputs[7].innerHTML =  "You ran out of time."
        }
        else {
            PickInputs[7].innerHTML = "Try Again"
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
