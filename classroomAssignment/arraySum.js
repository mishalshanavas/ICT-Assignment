
function arraySum(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum = sum + numbers[i];
    }
    return sum;
}

console.log(arraySum([1, 2, 3, 4, 5]));
console.log(arraySum([10, 20, 30]));