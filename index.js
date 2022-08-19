var input = "101*011*1";
var output1 = ["101001101", "101101101"];
var output2 = ["101001111", "101101111"];
var numberPossibilitiesPermutations = input.match(/\*/g);
console.log("numberPossibilitiesPermutations", numberPossibilitiesPermutations);
// Character to swap * for 0 or 1
var findPermutations = function (checkPermutations) {
    if (!!checkPermutations.length && checkPermutations.length < 2) {
        return checkPermutations;
    }
    var permutationsArray = [];
    for (var i = 0; i < checkPermutations.length; i++) {
        // do something
    }
    return permutationsArray;
};
