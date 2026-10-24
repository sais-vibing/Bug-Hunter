// 30-Level Intuitive & Engaging Educational Coding Curriculum
// Designed with approachable fill-in-the-blank '?' and bug-fix puzzles starting from basic fundamentals.

export function getDifficultyForLevel(levelNum) {
    const mod = levelNum % 10;
    if (mod === 0) return 'hard';          // 10, 20, 30
    if (mod === 5) return 'medium'; // 5, 15, 25
    return 'easy';                         // 1-4, 6-9, 11-14, 16-19, 21-24, 26-29
}

export function getMonsterForLevel(levelNum, totalLevels = 30) {
    const diff = getDifficultyForLevel(levelNum);
    if (diff === 'hard') {
        return {
            type: 'boss',
            name: levelNum === totalLevels ? 'IGRIS: THE VOID MONARCH' : `DUNGEON OVERLORD [STAGE ${levelNum}]`,
            sprite: 'assets/enemy_boss.png',
            maxHp: 100,
            flavor: 'A towering colossal shadow knight wielding a rune greatsword.'
        };
    }
    if (diff === 'medium') {
        return {
            type: 'medium',
            name: 'NECROMANCER OF RUINS',
            sprite: 'assets/enemy_medium.png',
            maxHp: 60,
            flavor: 'A hooded dark sorcerer summoning purple cursed flames.'
        };
    }
    return {
        type: 'easy',
        name: 'SHADOW ROGUE ASSASSIN',
        sprite: 'assets/enemy_easy.png',
        maxHp: 30,
        flavor: 'A swift human adversary wielding twin crimson energy daggers.'
    };
}

export const DEFAULT_LEVELS_JS = [
    {
        level: 1,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Variable Output Sum',
        prompt: 'Recruit! Complete the print statement to output the sum of a and b.',
        buggy_code: `a = 20\nb = 90\nsum = a + b\nprint(?)`,
        correct_answer: 'sum',
        options: ['sum', 'a', 'b'],
        hint: 'The result of adding a and b was stored in the variable named "sum". Put "sum" inside print()!',
        explanation: 'The variable "sum" stores the calculation 20 + 90 (110). Passing "sum" into print() displays 110 in the console.'
    },
    {
        level: 2,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'String Concatenation Name',
        prompt: 'Use the name variable so the greeting still works when the name changes. What belongs in the blank?',
        buggy_code: `name = "Asta"\nmessage = "Welcome, " + ?\nprint(message)`,
        correct_answer: 'name',
        options: ['name', '"Hunter"', 'message'],
        hint: 'The variable holding the player\'s name is "name". Add it to the greeting string.',
        explanation: 'Concatenating "Welcome, " with the variable "name" produces "Welcome, Asta".'
    },
    {
        level: 3,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Loop Update Direction',
        prompt: 'The loop keeps running. Fix the update step!',
        buggy_code: `for (let i = 0; i <= 5; i--) {\n    console.log("Strike #" + i);\n}`,
        correct_answer: 'i++',
        options: ['i++', 'i--', 'i += 0'],
        hint: 'Starting at 0 and checking i <= 5 means decrementing i-- goes negative forever (-1, -2, -3...). Increment instead!',
        explanation: 'Because i starts at 0 and must reach <= 5, decrementing "i--" causes an infinite negative loop. "i++" increments toward 5 to complete the loop.'
    },
    {
        level: 4,
        difficulty: 'easy',
        mode: 'typing',
        title: 'First Array Element Index',
        prompt: 'Array indexing starts at 0! Type the index number to grab the first weapon.',
        buggy_code: `const weapons = ["Sword", "Bow", "Dagger"];\n// Access the first weapon\nconst firstWeapon = weapons[?];`,
        correct_answer: '0',
        options: ['0', '1', '-1'],
        hint: 'In programming, arrays are 0-indexed. The very first item is at position 0.',
        explanation: 'Lists and arrays use 0-based indexing. "weapons[0]" yields "Sword", whereas "weapons[1]" would give "Bow".'
    },
    {
        level: 5,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Conditional Branching Else',
        prompt: 'Complete the if-statement so it executes the alternative block when hp is 0.',
        buggy_code: `hp = 100\nif hp > 0:\n    print("Hunter is alive!")\n?:\n    print("Hunter has fallen!")`,
        correct_answer: 'else',
        options: ['else', 'elif', 'then'],
        hint: 'In conditional statements, "else:" runs when the initial "if" condition evaluates to false.',
        explanation: 'The "else" keyword handles all cases where the preceding if condition is false (when hp is not > 0).'
    },
    {
        level: 6,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Function Return Value',
        prompt: 'The spell calculation needs to give back the result. Which keyword returns a value?',
        buggy_code: `function doubleMana(mana) {\n    ? mana * 2;\n}`,
        correct_answer: 'return',
        options: ['return', 'output', 'send'],
        hint: 'Functions use the "return" keyword to pass a value back to whoever called the function.',
        explanation: 'The "return" keyword exits the function and sends "mana * 2" back to the caller.'
    },
    {
        level: 7,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Arithmetic Addition Operator',
        prompt: 'Level up! Which math operator adds 1 to the current level?',
        buggy_code: `let level = 1;\n// Increase level by 1\nlevel = level ? 1;`,
        correct_answer: '+',
        options: ['+', '=', '=='],
        hint: 'Use the plus "+" operator for mathematical addition.',
        explanation: '"level = level + 1" calculates the current level plus 1, increasing the value from 1 to 2.'
    },
    {
        level: 8,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Boolean Game State',
        prompt: 'The quest just started! Type the boolean value indicating the game is NOT over yet.',
        buggy_code: `// Is the game over?\nlet isGameOver = ?;`,
        correct_answer: 'false',
        options: ['false', 'true', 'null'],
        hint: 'Booleans can be either "true" or "false". If the game is still active, isGameOver is false!',
        explanation: 'Setting "isGameOver = false" indicates the player is still in battle and active.'
    },
    {
        level: 9,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Add Element to Array',
        prompt: 'Add a new member to the guild party! Which array method appends to the end?',
        buggy_code: `const party = ["Asta", "Yuno"];\n// Append "Noelle" to the end\nparty.?( "Noelle" );`,
        correct_answer: 'push',
        options: ['push', 'add', 'insert'],
        hint: 'In JavaScript arrays, the .push() method adds new elements onto the end of the array.',
        explanation: 'Array.prototype.push() appends one or more elements to the end of an array and updates its length.'
    },
    {
        level: 10,
        difficulty: 'hard',
        mode: 'typing',
        title: 'BOSS TRIAL: End the Battle Loop',
        prompt: 'BOSS FIGHT! Combine a variable, arithmetic, and a loop. What operator makes bossHp reach 0?',
        buggy_code: `let bossHp = 30;\nwhile (bossHp > 0) {\n    bossHp = bossHp ? 10;\n}\nconsole.log("Boss Slain!");`,
        correct_answer: '-',
        options: ['-', '+', '*'],
        hint: 'The health value must move downward toward zero each turn.',
        explanation: 'Subtracting 10 changes bossHp from 30 to 20 to 10 to 0. The condition then becomes false and the loop ends.'
    },
    {
        level: 11,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Type Checking String',
        prompt: 'What type is the player title enclosed in quotation marks?',
        buggy_code: `let title = "Shadow Monarch";\n// Check variable type\nconsole.log(typeof title); // Output: "?"`,
        correct_answer: 'string',
        options: ['string', 'text', 'word'],
        hint: 'Any value wrapped in double or single quotes has the primitive type "string".',
        explanation: 'In JavaScript, typeof returns "string" for text enclosed in quotes.'
    },
    {
        level: 12,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Multiplication Operator',
        prompt: 'Cast double damage! Which operator multiplies damage by 2?',
        buggy_code: `let damage = 50;\n// Multiply damage by 2\nlet critDamage = damage ? 2;`,
        correct_answer: '*',
        options: ['*', 'x', '^'],
        hint: 'In computer programming, the asterisk "*" is the multiplication operator.',
        explanation: 'The asterisk "*" multiplies numeric operands (50 * 2 = 100).'
    },
    {
        level: 13,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Array Length Property',
        prompt: 'Count the potions in your inventory. Which property gives the total item count?',
        buggy_code: `const potions = ["Health", "Mana", "Stamina"];\n// Get total count of items\nconst totalPotions = potions.?;`,
        correct_answer: 'length',
        options: ['length', 'count', 'size'],
        hint: 'In JavaScript arrays, the property that stores the number of elements is ".length".',
        explanation: 'The ".length" property returns the integer count of elements present in the array (3).'
    },
    {
        level: 14,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Modulo Even Number Check',
        prompt: 'Even numbers have a remainder of 0 when divided by what number? Type the divisor.',
        buggy_code: `function isEven(num) {\n    // Check remainder\n    return (num % ?) === 0;\n}`,
        correct_answer: '2',
        options: ['2', '1', '10'],
        hint: 'Any integer divisible by 2 with no remainder (% 2 === 0) is an even number.',
        explanation: 'The modulo operator % returns the division remainder. Dividing by 2 yields 0 for even numbers.'
    },
    {
        level: 15,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Strict Equality Operator',
        prompt: 'Compare both value and type without loose conversion. Which operator performs strict equality?',
        buggy_code: `let a = 10;\nlet b = "10";\n// Strict equality: false because number !== string\nlet isEqual = (a ? b);`,
        correct_answer: '===',
        options: ['===', '==', '='],
        hint: 'Triple equals "===" checks both the value and the data type without type coercion.',
        explanation: 'Double equals "==" coerces types (10 == "10" is true), while triple equals "===" strictly checks type, correctly returning false.'
    },
    {
        level: 16,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Async Promise Await',
        prompt: 'Waiting for loot from the server! Which keyword pauses until the promise resolves?',
        buggy_code: `async function openChest() {\n    // Pause until server sends loot\n    const loot = ? fetchLoot();\n    return loot;\n}`,
        correct_answer: 'await',
        options: ['await', 'wait', 'sync'],
        hint: 'Inside an "async" function, the "await" keyword pauses execution until the Promise settles.',
        explanation: 'The "await" operator unwraps the resolved value of a Promise inside async functions.'
    },
    {
        level: 17,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'String Uppercase Method',
        prompt: 'Format the quest title in all capital letters! Which method converts to uppercase?',
        buggy_code: `let quest = "dungeon boss";\n// Convert to "DUNGEON BOSS"\nlet shout = quest.?( );`,
        correct_answer: 'toUpperCase',
        options: ['toUpperCase', 'toCapital', 'upper'],
        hint: 'In JavaScript strings, .toUpperCase() transforms all lowercase letters to capital letters.',
        explanation: 'String.prototype.toUpperCase() returns the calling string value converted to uppercase.'
    },
    {
        level: 18,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Object Property Access',
        prompt: 'Extract the player\'s rank! Type the property name following player.stats.',
        buggy_code: `const player = {\n    stats: { rank: "S-Rank", level: 10 }\n};\nconst myRank = player.stats.?;`,
        correct_answer: 'rank',
        options: ['rank', 'level', 'stats'],
        hint: 'The property holding "S-Rank" inside the stats object is named "rank".',
        explanation: 'Dot notation "player.stats.rank" traverses into the nested object to retrieve "S-Rank".'
    },
    {
        level: 19,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Subtraction Assignment Operator',
        prompt: 'Take 20 damage! Which shortcut operator subtracts 20 from current hp?',
        buggy_code: `let hp = 100;\n// Short for hp = hp - 20\nhp ? 20;`,
        correct_answer: '-=',
        options: ['-=', '=-', '--'],
        hint: 'The compound assignment operator "-=" subtracts the right operand from the variable.',
        explanation: '"hp -= 20" is equivalent to "hp = hp - 20", lowering hp from 100 to 80.'
    },
    {
        level: 20,
        difficulty: 'hard',
        mode: 'typing',
        title: 'BOSS TRIAL: Count Even Loot',
        prompt: 'BOSS FIGHT! Use a loop, array indexing, modulo, and a condition. What completes the counter update?',
        buggy_code: `const loot = [2, 5, 8];\nlet count = 0;\nfor (let i = 0; i < loot.length; i++) {\n    if (loot[i] % 2 === 0) count?;\n}\nconsole.log(count); // 2`,
        correct_answer: '++',
        options: ['++', '--', '=='],
        hint: 'Each even item should increase count by one.',
        explanation: 'The loop visits each array item. The modulo check finds 2 and 8; count++ increases the counter once for each, producing 2.'
    },
    {
        level: 21,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Array Map Transformation',
        prompt: 'Double the gold in every chest! Which method transforms every element in an array?',
        buggy_code: `const chests = [10, 20, 30];\n// Returns [20, 40, 60]\nconst boosted = chests.?(gold => gold * 2);`,
        correct_answer: 'map',
        options: ['map', 'filter', 'forEach'],
        hint: '.map() creates a brand new array populated with the results of calling a function on every element.',
        explanation: 'Array.prototype.map() applies the callback to each item, generating an array of transformed elements.'
    },
    {
        level: 22,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Array Includes Search',
        prompt: 'Check if the party has a healer! Which method checks if an array contains an item?',
        buggy_code: `const party = ["Warrior", "Mage", "Healer"];\n// Check if "Healer" is present (true/false)\nconst hasHealer = party.?( "Healer" );`,
        correct_answer: 'includes',
        options: ['includes', 'has', 'contains'],
        hint: 'In JavaScript arrays, .includes() returns true if the value exists in the array.',
        explanation: 'Array.prototype.includes() determines whether an array contains a specified value among its entries.'
    },
    {
        level: 23,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Logical AND Operator',
        prompt: 'The hunter needs both keys AND enough mana. Which operator requires BOTH to be true?',
        buggy_code: `let hasKey = true;\nlet hasMana = true;\n// Both must be true to open the gate\nif (hasKey ? hasMana) {\n    openGate();\n}`,
        correct_answer: '&&',
        options: ['&&', '||', '!='],
        hint: 'Double ampersand "&&" is the logical AND operator in JavaScript.',
        explanation: 'The logical AND (&&) operator evaluates to true if and only if both operands are truthy.'
    },
    {
        level: 24,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Remove Last Array Element',
        prompt: 'Use your last potion! Which array method removes and returns the last element? Type it.',
        buggy_code: `const potions = ["Health", "Mana", "Elixir"];\n// Remove "Elixir" from the end\nconst used = potions.?( );`,
        correct_answer: 'pop',
        options: ['pop', 'shift', 'remove'],
        hint: 'While .push() adds to the end, .pop() removes from the end.',
        explanation: 'Array.prototype.pop() removes the last element from an array and returns that element.'
    },
    {
        level: 25,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Error Catch Block',
        prompt: 'Safely handle traps! Which keyword catches exceptions thrown inside a try block?',
        buggy_code: `try {\n    disarmTrap();\n} ? (error) {\n    console.log("Trap triggered: " + error.message);\n}`,
        correct_answer: 'catch',
        options: ['catch', 'handle', 'except'],
        hint: 'JavaScript uses "try { ... } catch (err) { ... }" to intercept runtime errors.',
        explanation: 'The "catch" block contains statements that specify what to do if an exception is thrown in the try block.'
    },
    {
        level: 26,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Array Filter Predicate',
        prompt: 'Keep only surviving hunters! Which method filters elements based on a condition?',
        buggy_code: `const hunters = [{ hp: 100 }, { hp: 0 }, { hp: 45 }];\n// Filter out hunters with hp > 0\nconst alive = hunters.?(h => h.hp > 0);`,
        correct_answer: 'filter',
        options: ['filter', 'find', 'slice'],
        hint: '.filter() returns an array containing only elements that satisfy the truth condition.',
        explanation: 'Array.prototype.filter() creates a shallow copy of a portion of a given array, filtered down to just the elements that pass the test.'
    },
    {
        level: 27,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Parse String to Integer',
        prompt: 'Convert the string "500" into an integer so you can add 100 gold!',
        buggy_code: `let goldStr = "500";\n// Convert string to number\nlet total = ?(goldStr) + 100; // Expected: 600`,
        correct_answer: 'parseInt',
        options: ['parseInt', 'toString', 'floor'],
        hint: 'parseInt() parses a string argument and returns an integer.',
        explanation: 'Without parseInt(), "500" + 100 would result in string concatenation "500100". parseInt converts it to 500, giving 600.'
    },
    {
        level: 28,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Math Round Down Floor',
        prompt: 'Round 9.8 down to the nearest integer 9! Type the Math method.',
        buggy_code: `// Round 9.8 down to 9\nlet damage = Math.?(9.8);`,
        correct_answer: 'floor',
        options: ['floor', 'ceil', 'round'],
        hint: 'Math.floor() always rounds down to the nearest integer.',
        explanation: 'Math.floor() returns the largest integer less than or equal to a given number.'
    },
    {
        level: 29,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Nullish Coalescing Operator',
        prompt: 'Provide a fallback weapon if currentWeapon is null or undefined!',
        buggy_code: `let currentWeapon = null;\n// Default to "Dagger" if null\nlet weapon = currentWeapon ? "Dagger";`,
        correct_answer: '??',
        options: ['??', '&&', '::'],
        hint: 'Double question mark "??" is the nullish coalescing operator that returns the right-side operand when left is null or undefined.',
        explanation: 'The nullish coalescing operator (??) is a logical operator that returns its right-hand side operand when its left-hand side operand is null or undefined.'
    },
    {
        level: 30,
        difficulty: 'hard',
        mode: 'typing',
        title: 'FINAL BOSS: THE VOID MONARCH ROSTER',
        prompt: 'FINAL TRIAL! After awaiting the roster, keep living hunters and map their ranks. Which method keeps only matching hunters?',
        buggy_code: `async function livingRanks() {\n    const hunters = await fetchHunters();\n    return hunters.?(h => h.hp > 0).map(h => h.rank);\n}`,
        correct_answer: 'filter',
        options: ['filter', 'find', 'forEach'],
        hint: 'You need an array of all hunters whose hp is above zero before mapping their ranks.',
        explanation: 'await gets the roster, filter keeps every hunter with hp above zero, and map turns those survivors into their ranks.'
    }
];

export function normalizeLevels(rawLevels, topicName = 'Custom Pathway') {
    if (!Array.isArray(rawLevels) || rawLevels.length === 0) {
        return DEFAULT_LEVELS_JS;
    }

    const normalized = [];
    for (let i = 1; i <= 30; i++) {
        const raw = rawLevels[i - 1] || DEFAULT_LEVELS_JS[i - 1];
        const diff = getDifficultyForLevel(i);
        const isBoss = diff === 'hard';
        const isTyping = isBoss || i % 4 === 0;

        normalized.push({
            level: i,
            difficulty: diff,
            mode: raw.mode || (isTyping ? 'typing' : 'mcq'),
            title: raw.title || `Level ${i}: ${topicName} Trial`,
            prompt: raw.prompt || (isBoss ? 'BOSS LEVEL! Expose and eliminate the flaw!' : 'Fill in the blank (?) or fix the bug:'),
            buggy_code: raw.buggy_code || DEFAULT_LEVELS_JS[i - 1].buggy_code,
            correct_answer: String(raw.correct_answer || DEFAULT_LEVELS_JS[i - 1].correct_answer).trim(),
            options: Array.isArray(raw.options) && raw.options.length >= 3 
                ? raw.options.slice(0, 3) 
                : DEFAULT_LEVELS_JS[i - 1].options,
            hint: raw.hint || DEFAULT_LEVELS_JS[i - 1].hint,
            explanation: raw.explanation || DEFAULT_LEVELS_JS[i - 1].explanation
        });
    }

    return normalized;
}
