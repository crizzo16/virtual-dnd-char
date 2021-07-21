let starship = {
    allChars: [],
    colors: [],
    selectedColor: 0,
    skillz: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Data", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Piloting", "Religion", "Sleight of Hand", "Stealth", "Survival", "Technology"],
    skillzAS: ["Dex", "Wis", "Int", "Str", "Int", "Cha", "Int", "Wis", "Cha", "Int", "Wis", "Int", "Wis", "Cha", "Cha", "Dex", "Int", "Dex", "Dex", "Wis", "Int"],
    currentHP: 0,
    parseCharacters: function () {
        $.ajax({
            url: "https://crizzo16.github.io/virtual-dnd-char/characters.json",
            dataType: "json"
        }).done(function (result) {
            starship.allChars = result;
            starship.loadFirstPC();
        });
    },
    parseColors: function () {
        $.ajax({
            url: "https://crizzo16.github.io/virtual-dnd-char/colors.json",
            dataType: "json"
        }).done(function (result) {
            starship.colors = result;
            starship.loadColorButtons();
            starship.loadPCButtons();
            starship.colorStuff();
        });
    },
    switchColors: function () {
        console.log("firing");
        const sel = $(".color-selected").attr("color-id");
        const id = $(this).attr("color-id");
        $(".color-selected").removeClass("color-selected");
        if (sel != id) {
            starship.selectedColor = id;
            $(this).addClass("color-selected");
            starship.loadPCButtons();
            starship.colorStuff();
        }
    },
    colorStuff: function () {
        $("#list-skills").attr("style", "background:" + starship.colors[starship.selectedColor].secondary + "; color:" + starship.colors[starship.selectedColor].secondaryText);
        $("#saving-throws").attr("style", "background:" + starship.colors[starship.selectedColor].secondary + "; color:" + starship.colors[starship.selectedColor].secondaryText);
        $(".skill-as").attr("style", "color:" + starship.colors[starship.selectedColor].main);
        $(".border-color").attr("style", "fill:" + starship.colors[starship.selectedColor].main + "!important;");
    },
    loadFirstPC: function () {
        const player = starship.allChars[0];
        $("#char-name").text(player.charName);
        $("#hd-class").text(player.class);
        $("#hd-subclass").text(player.subclass);
        $("#hd-background").text(player.background);
        $("#hd-race").text(player.race);
        starship.loadAbilityScores(player);
        starship.loadSkills(player);
        starship.loadSavingThrows(player);
        starship.loadMisc(player);
        starship.loadHealth(player);
    },
    loadPC: function () {
        const num = $(this).attr("char-id") - 1;
        const player = starship.allChars[num];
        $("#char-name").text(player.charName);
        $("#hd-class").text(player.class);
        $("#hd-subclass").text(player.subclass);
        $("#hd-background").text(player.background);
        $("#hd-race").text(player.race);
        starship.loadAbilityScores(player);
        starship.loadSkills(player);
        starship.loadSavingThrows(player);
        starship.loadMisc(player);
        starship.loadHealth(player);
    },
    loadPCButtons: function () {
        $("#pc-buttons").html("");
        starship.allChars.forEach(function (item, index, array) {
            let button = $("<div>").addClass("pc-button").text(item.charName).attr("char-id", item.id);
            button.attr("style", "background:" + starship.colors[starship.selectedColor].main + "; color:" + starship.colors[starship.selectedColor].mainText);
            $("#pc-buttons").append(button);
        });
    },
    loadColorButtons: function () {
        $("#color-buttons").html("");
        starship.colors.forEach(function (item, index, array) {
            let button = $("<div>").addClass("color-button").attr("color-id", item.id);
            if (index == 0) button.addClass("color-selected");
            const nums = ["main", "secondary", "third", "fourth"];
            nums.forEach(function (jitem, jindex, jarray) {
                let sec = $("<div>").addClass("sub-color").attr("style", "background: " + eval("item." + jitem));
                button.append(sec);
            });
            $("#color-buttons").append(button);
        });
    },
    loadAbilityScores: function (player) {
        const types = ["str", "dex", "con", "int", "wis", "cha"]
        types.forEach(function (item, index, array) {
            const scoreID = "#" + item + "-as";
            const modID = "#" + item + "-mod";
            const mod = starship.calculateModifier(player.abilityScores[index]);
            $(scoreID).text(player.abilityScores[index]);
            if (mod > 0) {
                const temp = "+" + mod;
                $(modID).text(temp);
            } else {
                $(modID).text(mod);
            }
        });
    },
    loadSkills: function (player) {
        $("#list-skills").html("");
        starship.skillz.forEach(function (item, index, array) {
            let skill = $("<div>").addClass("skill-sec");
            let proficiency = $("<div>").addClass("skill-regular");
            if (player.skillsProf[index] == 1) {
                proficiency.addClass("skill-prof")
            } else if (player.skillsProf[index] == 2) {
                proficiency.addClass("skill-expert");
            }
            let skillAS = $("<div>").addClass("skill-as").addClass("skill-item").text(starship.skillzAS[index]);
            let skillName = $("<div>").addClass("skill-name").addClass("skill-item").text(item);
            let skillBonus = $("<div>").addClass("skill-bonus").addClass("skill-item");
            /*if (player.skills[index] > 0) {
                skillBonus.text("+" + player.skills[index]);
            } else {
                skillBonus.text(player.skills[index]);
            }*/
            skillBonus.text(starship.formatNumber(player.skills[index]));
            skill.append(proficiency).append(skillAS).append(skillName).append(skillBonus);

            $("#list-skills").append(skill);
        });

    },
    loadSavingThrows: function (player) {
        const ability = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];
        $("#saving-throws").html("");
        player.savingThrows.forEach(function (item, index, array) {
            let score = $("<div>").addClass("savingThrow");
            let title = $("<div>").addClass("st-as").text(ability[index]);

            let num = 0;
            if (item) {
                num = starship.formatNumber(starship.calculateModifier(player.abilityScores[index]) + player.proficiencyBonus);
            } else {
                num = starship.formatNumber(starship.calculateModifier(player.abilityScores[index]));
            }
            let number = $("<div>").addClass("st-num").text(num);
            score.append(title).append(number);
            $("#saving-throws").append(score);
        });
    },
    loadMisc: function (player) {
        $("#prof-bonus-num").text(starship.formatNumber(player.proficiencyBonus));
        $("#speed-num").text(player.speed + " ft.");
    },
    loadHealth: function (player) {
        $("#max-hp").text(player.maxHP);
        starship.currentHP = player.maxHP;
        $("#current-hp").text(starship.currentHP);
    },
    calculateModifier: function (score) {
        const mod = Math.floor((score - 10) / 2);
        return mod;
    },
    calculatePassivePerception: function (player) {
        const perception = player.skills[12];
        const prof = player.skillsProf[12];
        const bonus = player.proficiencyBonus;
        let passive = 10 + perception;
        if (prof === 1) {
            passive = passive + perception + bonus;
        } else if (prof === 2) {
            passive = passive + perception + (bonus * 2);
        }
        return passive;
    },
    formatNumber: function (number) {
        if (number > 0) {
            return "+" + number;
        } else {
            return number;
        }
    }
};

$(document).ready(function () {
    starship.parseCharacters();
    starship.parseColors();
    $(".tabs").tabs();
});

$(document).on("click", ".pc-button", starship.loadPC);
$(document).on("click", ".color-button", starship.switchColors);