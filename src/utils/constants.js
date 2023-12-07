export const frameType = "circle" // "box" or "circle"
export const scale = 0.40

export const scaleEnums = {
    "maize": 0.1850,
    "wheat": 0.30,
    "None": 0.25
}

export const circleFrameTypeCrops = ['maize', 'wheat', 'None']


function removeNumbersAndSpecialChars(inputString) {
    // Use a regular expression to replace numbers, special characters, and spaces with an empty string
    var result = inputString.replace(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/\s-]/g, '');

    return result;
}


function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
            }
        }
    }

    return matrix[b.length][a.length];
}

export function findBestMatch(str, listOfStrings = ["wheat", "maize"]) {
    let closestMatch = null;
    let minDistance = Infinity;
    str = removeNumbersAndSpecialChars(str)

    for (const testStr of listOfStrings) {
        const distance = levenshteinDistance(str, testStr);

        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = testStr;
        }
    }

    // You can adjust the threshold according to your needs
    const threshold = 2;
    return minDistance <= threshold ? closestMatch : 'None';
}


