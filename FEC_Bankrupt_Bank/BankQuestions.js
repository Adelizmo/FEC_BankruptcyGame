document.getElementById('HighlightedBox').style.width = "100%"


var AllGameData
var SelectedGameData
 


var currentlySelected = "Reinford"
const PickBankCase = (e) => {
    if (currentlySelected != e) {
        document.getElementById('B_' + currentlySelected).classList.remove('Selected')
        document.getElementById('B_' + currentlySelected + "C").classList.remove('Selected')

        document.getElementById('B_' + e).classList.add('Selected')
        document.getElementById('B_' + e + "C").classList.add('Selected')
        currentlySelected = e
    }
}

const BeginGameFunction = () => {
    let index = AllGameData.findIndex(item => item.Name === currentlySelected)

    if (index == -1) {
        console.log('Error: Game Data not found')
    }
    else {
        SelectedGameData = AllGameData[index].Game
        console.log(AllGameData[index].Game)
    }
}

fetch("BankQ.json")
.then(response => response.json())
.then(json => { 
    json = json[0]
    AllGameData = json.GameData
})