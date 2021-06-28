let starship = {
    allChars = [],
    parseCharacters: function() {
        $.ajax({
            url: "https://crizzo.github.io/virtual-dnd-char/characters.json",
            dataType: "json"
        }).done(function (result) {
            starship.allChars = result;
            starship.testLoadHero();
        });
    },
    testLoadHero: function() {
        const player = allChars[1];
        $("#char-name").text(player.charName);
    }
};

$(document).ready(function () {
    starship.parseCharacters();
});