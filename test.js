let obj = {
    name: 'John',
    start: function () {
        console.log('The player ' + obj.name + ' has started the game')
    }
}

var gameStart = obj.start;

gameStart();