// 30-Level Intuitive & Engaging Educational Coding Curriculum
// Designed with approachable fill-in-the-blank '?' and bug-fix puzzles starting from basic fundamentals.

export function getDifficultyForLevel(levelNum) {
    const mod = levelNum % 10;
    if (mod === 0) return 'hard';          // 10, 20, 30
    if (mod === 5 || mod === 6) return 'medium'; // 5, 6, 15, 16, 25, 26
    return 'easy';                         // 1-4, 7-9, 11-14, 17-19, 21-24, 27-29
}

export function getMonsterForLevel(levelNum) {
    const diff = getDifficultyForLevel(levelNum);
    if (diff === 'hard') {
        return {
            type: 'boss',
            name: levelNum === 30 ? 'IGRIS: THE VOID MONARCH' : `DUNGEON OVERLORD [STAGE ${levelNum}]`,
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
        title: 'Basic Addition Operation',
        prompt: 'Recruit! Calculate the sum of the two variables.',
        buggy_code: `a = 20\nb = 10\nsum = a + b\nprint(sum)\n\n# que - what is sum?`,
        correct_answer: '30',
        options: ['30', '20', '10'],
        hint: '20 + 10 = 30. The variable sum holds the number 30.',
        explanation: 'a + b calculates 20 + 10 = 30. The sum variable holds 30.'
    },
    {
        level: 2,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'String Concatenation Name',
        prompt: 'Greet the hunter! Which variable should be added to complete the welcome message?',
        buggy_code: `name = "Asta"\nmessage = "Welcome, " + ?\nprint(message)`,
        correct_answer: 'name',
        options: ['name', '"Asta"', 'message'],
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
        title: 'BOSS TRIAL: Loop Break Command',
        prompt: 'BOSS FIGHT! Stop the infinite battle loop when the boss is slain! Type the break command.',
        buggy_code: `while (true) {\n    if (bossHp <= 0) {\n        console.log("Boss Slain!");\n        /* STOP THE LOOP */\n        ?;\n    }\n}`,
        correct_answer: 'break',
        options: ['break', 'stop', 'exit'],
        hint: 'Type "break" to immediately exit out of a while or for loop.',
        explanation: 'The "break" statement terminates the surrounding loop immediately, preventing an infinite loop freeze.'
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
        explanation: 'Text values enclosed in quotes are of type "string" in JavaScript and Python.'
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
        title: 'BOSS TRIAL: Parse JSON String',
        prompt: 'BOSS FIGHT! Convert the raw dungeon save string into a usable object! Type the JSON method.',
        buggy_code: `const saveStr = '{"gold": 500, "stage": 20}';\n// Convert JSON string to JavaScript object\nconst saveObj = JSON.?(saveStr);`,
        correct_answer: 'parse',
        options: ['parse', 'stringify', 'decode'],
        hint: 'JSON.parse() turns a text string formatted as JSON back into a JavaScript object.',
        explanation: 'JSON.parse() deserializes a JSON string into a live JavaScript object or array.'
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
        prompt: 'Convert the string "500" into a real number so you can add 100 gold!',
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
        title: 'FINAL BOSS: THE VOID MONARCH PROMISE RACE',
        prompt: 'FINAL TRIAL! Race the sealing spell against the void timer! Type the Promise race method.',
        buggy_code: `// Whichever finishes first wins the race!\nconst result = await Promise.?( [sealSpell(), voidTimer()] );`,
        correct_answer: 'race',
        options: ['race', 'all', 'any'],
        hint: 'Promise.race() settles as soon as ANY of the promises in the iterable settles.',
        explanation: 'Promise.race() returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.'
    }
];

export const DEFAULT_LEVELS_PYTHON = [
    {
        level: 1,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Addition Operation',
        prompt: 'Calculate the sum of the two variables!',
        buggy_code: `a = 20\nb = 10\nsum = a + b\nprint(sum)\n\n# que - what is sum?`,
        correct_answer: '30',
        options: ['30', '20', '10'],
        hint: 'In Python, the + operator adds the numbers: 20 + 10 = 30.',
        explanation: 'sum stores the calculation a + b (20 + 10 = 30). print(sum) displays 30.'
    },
    {
        level: 2,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Subtraction Operation',
        prompt: 'Subtract the second variable from the first!',
        buggy_code: `x = 50\ny = 20\ndiff = x - y\nprint(diff)\n\n# que - what is diff?`,
        correct_answer: '30',
        options: ['30', '70', '20'],
        hint: '50 - 20 equals 30.',
        explanation: 'diff stores x - y (50 - 20 = 30). In Python, - is the arithmetic subtraction operator.'
    },
    {
        level: 3,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Multiplication Operation',
        prompt: 'Multiply the variables to get the total product!',
        buggy_code: `score = 5\nmultiplier = 6\ntotal = score * multiplier\nprint(total)\n\n# que - what is total?`,
        correct_answer: '30',
        options: ['30', '11', '25'],
        hint: 'The asterisk (*) represents multiplication: 5 * 6 = 30.',
        explanation: 'score * multiplier calculates 5 * 6, which evaluates to 30.'
    },
    {
        level: 4,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python Integer Division',
        prompt: 'Type the integer floor result of dividing 40 by 2!',
        buggy_code: `num = 40\nhalf = num // 2\nprint(half)\n\n# que - type the value of half`,
        correct_answer: '20',
        options: ['20', '40', '2'],
        hint: '// performs integer (floor) division. 40 // 2 gives 20.',
        explanation: 'In Python, // is floor division which returns an integer result without decimals.'
    },
    {
        level: 5,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python Modulo (Remainder)',
        prompt: 'What remainder remains when dividing 15 by 4?',
        buggy_code: `a = 15\nb = 4\nrem = a % b\nprint(rem)\n\n# que - what is rem?`,
        correct_answer: '3',
        options: ['3', '4', '1'],
        hint: '15 divided by 4 is 3 with a remainder of 3 (4 * 3 = 12, 15 - 12 = 3).',
        explanation: 'The modulo operator % returns the remainder of the division. 15 % 4 leaves 3.'
    },
    {
        level: 6,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python Exponentiation Power',
        prompt: 'Calculate 2 raised to the power of 4!',
        buggy_code: `base = 2\nexp = 4\npower = base ** exp\nprint(power)\n\n# que - what is power?`,
        correct_answer: '16',
        options: ['16', '8', '6'],
        hint: '** is the power operator: 2 ** 4 = 2 * 2 * 2 * 2 = 16.',
        explanation: 'In Python, ** calculates exponents. 2 ** 4 evaluates to 16.'
    },
    {
        level: 7,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python String Concatenation',
        prompt: 'What combined text does the print statement output?',
        buggy_code: `greeting = "Shadow"\ntitle = "Hunter"\nname = greeting + " " + title\nprint(name)\n\n# que - what is name?`,
        correct_answer: 'Shadow Hunter',
        options: ['Shadow Hunter', 'ShadowHunter', 'Hunter Shadow'],
        hint: 'Adding strings with + joins them together with the space in between.',
        explanation: 'String concatenation merges "Shadow", " ", and "Hunter" into "Shadow Hunter".'
    },
    {
        level: 8,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python In-Place Addition',
        prompt: 'Type the updated value of score after += 15!',
        buggy_code: `score = 15\nscore += 15\nprint(score)\n\n# que - type the value of score`,
        correct_answer: '30',
        options: ['30', '15', '0'],
        hint: 'score += 15 is shorthand for score = score + 15 (15 + 15 = 30).',
        explanation: 'The in-place operator += adds 15 to the existing 15, updating score to 30.'
    },
    {
        level: 9,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Boolean Comparison',
        prompt: 'Determine whether the hunter has enough HP to survive!',
        buggy_code: `hp = 50\nis_alive = hp > 0\nprint(is_alive)\n\n# que - what is is_alive?`,
        correct_answer: 'True',
        options: ['True', 'False', 'None'],
        hint: 'Since 50 is strictly greater than 0, the comparison evaluates to True.',
        explanation: 'Comparisons in Python evaluate to boolean values (True or False). 50 > 0 is True.'
    },
    {
        level: 10,
        difficulty: 'hard',
        mode: 'typing',
        title: 'BOSS RAID: PYTHON POWER SPELL',
        prompt: 'BOSS GATE! Type the Python power operator that calculates 3 squared (9)!',
        buggy_code: `# BOSS TRIAL: Exponent Operator\nbase = 3\npower = base ? 2  # 3 squared is 9\nprint(power)`,
        correct_answer: '**',
        options: ['**', '*', '^'],
        hint: 'In Python, power/exponentiation is written with double asterisks (**).',
        explanation: 'Python uses ** for exponentiation (e.g. 3 ** 2 = 9), whereas ^ is bitwise XOR.'
    },
    {
        level: 11,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python List Indexing',
        prompt: 'Which weapon is retrieved from index 0?',
        buggy_code: `weapons = ["Dagger", "Bow", "Staff"]\nfirst = weapons[0]\nprint(first)\n\n# que - what is first?`,
        correct_answer: 'Dagger',
        options: ['Dagger', 'Bow', 'Staff'],
        hint: 'Python lists are 0-indexed. Index 0 corresponds to the first item ("Dagger").',
        explanation: 'List indexing starts at 0, so weapons[0] accesses "Dagger".'
    },
    {
        level: 12,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Negative List Index',
        prompt: 'What item is retrieved by negative index -1?',
        buggy_code: `potions = ["Heal", "Mana", "Elixir"]\nlast = potions[-1]\nprint(last)\n\n# que - what is last?`,
        correct_answer: 'Elixir',
        options: ['Elixir', 'Heal', 'Mana'],
        hint: 'In Python, index -1 accesses the very last element of a list.',
        explanation: 'Negative indices count backwards from the end. -1 retrieves the final item: "Elixir".'
    },
    {
        level: 13,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python len() Function',
        prompt: 'How many items are inside the inventory list?',
        buggy_code: `inventory = ["Sword", "Shield", "Ring"]\ncount = len(inventory)\nprint(count)\n\n# que - what is count?`,
        correct_answer: '3',
        options: ['3', '2', '4'],
        hint: 'There are 3 items in the list. len() counts total elements.',
        explanation: 'The built-in len() function returns the number of elements in a sequence (3).'
    },
    {
        level: 14,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python List Append',
        prompt: 'Type the new length of items after appending "potion"!',
        buggy_code: `items = ["sword", "shield"]\nitems.append("potion")\nprint(len(items))\n\n# que - type the value of len(items)`,
        correct_answer: '3',
        options: ['3', '2', '1'],
        hint: 'items started with 2 elements. Appending 1 more item makes it 3.',
        explanation: 'append() adds an element to the end of a list in-place, increasing its length from 2 to 3.'
    },
    {
        level: 15,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python If-Else Branching',
        prompt: 'What rank is assigned when player_level is 12?',
        buggy_code: `player_level = 12\nif player_level >= 10:\n    rank = "S-Rank"\nelse:\n    rank = "E-Rank"\nprint(rank)\n\n# que - what is rank?`,
        correct_answer: 'S-Rank',
        options: ['S-Rank', 'E-Rank', 'None'],
        hint: '12 is >= 10, so the if block executes.',
        explanation: 'Because player_level (12) is >= 10, rank is assigned "S-Rank".'
    },
    {
        level: 16,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python Elif Multi-Branch',
        prompt: 'Determine which branch executes when gold is 75!',
        buggy_code: `gold = 75\nif gold >= 100:\n    tier = "Diamond"\nelif gold >= 50:\n    tier = "Gold"\nelse:\n    tier = "Bronze"\nprint(tier)\n\n# que - what is tier?`,
        correct_answer: 'Gold',
        options: ['Gold', 'Diamond', 'Bronze'],
        hint: '75 is not >= 100, but 75 >= 50 is True, so the elif block triggers.',
        explanation: 'The first condition (gold >= 100) is False. The elif (gold >= 50) is True, assigning tier = "Gold".'
    },
    {
        level: 17,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python For Loop with range()',
        prompt: 'How many times does the loop increment strikes?',
        buggy_code: `strikes = 0\nfor i in range(4):\n    strikes += 1\nprint(strikes)\n\n# que - what is strikes?`,
        correct_answer: '4',
        options: ['4', '3', '5'],
        hint: 'range(4) produces numbers 0, 1, 2, 3 (4 total iterations).',
        explanation: 'range(4) iterates exactly 4 times, adding 1 each time so strikes becomes 4.'
    },
    {
        level: 18,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python List Sum Loop',
        prompt: 'Calculate the total accumulated sum across the numbers!',
        buggy_code: `total = 0\nfor num in [5, 10, 15]:\n    total += num\nprint(total)\n\n# que - what is total?`,
        correct_answer: '30',
        options: ['30', '15', '25'],
        hint: '5 + 10 = 15; 15 + 15 = 30.',
        explanation: 'The for loop visits 5, then 10, then 15, adding each to total to reach 30.'
    },
    {
        level: 19,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python While Loop Counter',
        prompt: 'Type the final value of counter when the while loop finishes!',
        buggy_code: `counter = 0\nwhile counter < 3:\n    counter += 1\nprint(counter)\n\n# que - type the value of counter`,
        correct_answer: '3',
        options: ['3', '2', '4'],
        hint: 'The loop continues while counter < 3. When counter hits 3, the condition becomes False and it stops.',
        explanation: 'counter advances 0 -> 1 -> 2 -> 3. At 3, 3 < 3 is False, so the loop halts.'
    },
    {
        level: 20,
        difficulty: 'hard',
        mode: 'typing',
        title: 'BOSS RAID: PYTHON SEQUENCE GENERATOR',
        prompt: 'BOSS GATE! Type the built-in generator function that produces 0 to 4 in a for loop!',
        buggy_code: `# BOSS RAID: Generate numbers 0 to 4\ncount = 0\nfor i in ?(5):\n    count += 1\nprint(count)`,
        correct_answer: 'range',
        options: ['range', 'len', 'count'],
        hint: 'range(5) generates a sequence of numbers from 0 up to 4 (5 numbers total).',
        explanation: 'range() is the built-in Python generator used to run loops a specified number of times.'
    },
    {
        level: 21,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Function Return Value',
        prompt: 'What value is returned by add_points(12, 18)?',
        buggy_code: `def add_points(a, b):\n    return a + b\n\nresult = add_points(12, 18)\nprint(result)\n\n# que - what is result?`,
        correct_answer: '30',
        options: ['30', '12', '18'],
        hint: '12 + 18 equals 30.',
        explanation: 'The function add_points returns a + b (12 + 18 = 30), which is stored in result.'
    },
    {
        level: 22,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Function Parameter Calculation',
        prompt: 'What does double_damage(15) return?',
        buggy_code: `def double_damage(dmg):\n    return dmg * 2\n\nfinal_dmg = double_damage(15)\nprint(final_dmg)\n\n# que - what is final_dmg?`,
        correct_answer: '30',
        options: ['30', '15', '20'],
        hint: '15 multiplied by 2 is 30.',
        explanation: 'Calling double_damage(15) computes 15 * 2 = 30 and returns the result.'
    },
    {
        level: 23,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python Dictionary Lookup',
        prompt: 'What value is accessed with key "hp"?',
        buggy_code: `hero = {"name": "Asta", "hp": 100}\ncurrent_hp = hero["hp"]\nprint(current_hp)\n\n# que - what is current_hp?`,
        correct_answer: '100',
        options: ['100', 'Asta', 'hp'],
        hint: 'hero["hp"] looks up the key "hp", which maps to 100.',
        explanation: 'Dictionaries store key-value pairs. Accessing ["hp"] retrieves the value 100.'
    },
    {
        level: 24,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python String upper() Method',
        prompt: 'Type the uppercase string produced by "python".upper()!',
        buggy_code: `lang = "python"\nupper_lang = lang.upper()\nprint(upper_lang)\n\n# que - type the value of upper_lang`,
        correct_answer: 'PYTHON',
        options: ['PYTHON', 'python', 'Python'],
        hint: 'The upper() method converts all lowercase characters to capital letters: PYTHON.',
        explanation: '"python".upper() returns all uppercase letters "PYTHON".'
    },
    {
        level: 25,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python in Membership Operator',
        prompt: 'Does "ring" exist inside the loot list?',
        buggy_code: `loot = ["dagger", "potion", "ring"]\nhas_ring = "ring" in loot\nprint(has_ring)\n\n# que - what is has_ring?`,
        correct_answer: 'True',
        options: ['True', 'False', 'None'],
        hint: '"ring" is present in the list, so the in operator evaluates to True.',
        explanation: 'The in operator checks membership. Since "ring" is an element of loot, it returns True.'
    },
    {
        level: 26,
        difficulty: 'medium',
        mode: 'mcq',
        title: 'Python List Slicing',
        prompt: 'How many items are in the slice nums[1:3]?',
        buggy_code: `nums = [10, 20, 30, 40, 50]\nsub = nums[1:3]  # items at index 1 and 2\nprint(len(sub))\n\n# que - what is len(sub)?`,
        correct_answer: '2',
        options: ['2', '3', '1'],
        hint: 'Slice 1:3 includes indices 1 and 2 (20 and 30). Total elements = 2.',
        explanation: 'Slicing [start:end] includes start index up to but excluding end. 1:3 takes elements at 1 and 2 (length 2).'
    },
    {
        level: 27,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python max() Function',
        prompt: 'What is the highest number among the scores?',
        buggy_code: `scores = [25, 80, 50]\ntop = max(scores)\nprint(top)\n\n# que - what is top?`,
        correct_answer: '80',
        options: ['80', '50', '25'],
        hint: 'max() finds the largest element in an iterable. 80 is the largest.',
        explanation: 'The built-in max() function returns the largest item (80).'
    },
    {
        level: 28,
        difficulty: 'easy',
        mode: 'mcq',
        title: 'Python f-string Formatting',
        prompt: 'What message is printed by the formatted f-string?',
        buggy_code: `hero = "Asta"\nlevel = 99\nmsg = f"{hero} Lv.{level}"\nprint(msg)\n\n# que - what is msg?`,
        correct_answer: 'Asta Lv.99',
        options: ['Asta Lv.99', 'hero Lv.level', 'Asta 99'],
        hint: 'f-strings interpolate variables inside curly braces: {hero} becomes Asta, {level} becomes 99.',
        explanation: 'f"{hero} Lv.{level}" replaces expressions in braces with their values: "Asta Lv.99".'
    },
    {
        level: 29,
        difficulty: 'easy',
        mode: 'typing',
        title: 'Python Combined Operations',
        prompt: 'Type the final value of power after multiplication and addition!',
        buggy_code: `base = 5\nboost = 2\npower = base * boost + 10\nprint(power)\n\n# que - type the value of power`,
        correct_answer: '20',
        options: ['20', '60', '15'],
        hint: 'Multiplication happens first: 5 * 2 = 10; then 10 + 10 = 20.',
        explanation: 'Operator precedence executes multiplication before addition: (5 * 2) + 10 = 20.'
    },
    {
        level: 30,
        difficulty: 'hard',
        mode: 'typing',
        title: 'FINAL BOSS: THE VOID MONARCH DEFEAT SPELL',
        prompt: 'FINAL TRIAL! Calculate the boss remaining HP after the ultimate slash (100 - 100)!',
        buggy_code: `# FINAL TRIAL: Defeat the Boss!\ndef execute_finisher(boss_hp, slash_dmg):\n    return boss_hp - slash_dmg\n\nremaining_hp = execute_finisher(100, 100)\nprint(remaining_hp)\n\n# que - type remaining_hp`,
        correct_answer: '0',
        options: ['0', '100', '-1'],
        hint: '100 - 100 = 0. The Void Monarch is defeated!',
        explanation: 'execute_finisher computes 100 - 100 = 0. Boss HP reaches 0, unlocking victory!'
    }
];

export function isPythonTopic(topic = '') {
    const t = String(topic).toLowerCase();
    return t.includes('python') || t.includes('py') || t.includes('django') || t.includes('flask') || t.includes('numpy') || t.includes('pandas');
}

export function getCurriculumForTopic(topic = '') {
    if (isPythonTopic(topic)) {
        return DEFAULT_LEVELS_PYTHON;
    }
    return DEFAULT_LEVELS_JS;
}

export function normalizeLevels(rawLevels, topicName = 'Custom Pathway') {
    const baseCurriculum = getCurriculumForTopic(topicName);
    if (!Array.isArray(rawLevels) || rawLevels.length === 0) {
        return [...baseCurriculum];
    }

    const normalized = [];
    for (let i = 1; i <= 30; i++) {
        const base = baseCurriculum[i - 1];
        const raw = rawLevels[i - 1];

        // If Ollama didn't return this level, use hardcoded
        if (!raw || !raw.buggy_code || !raw.correct_answer) {
            normalized.push({ ...base });
            continue;
        }

        const diff = getDifficultyForLevel(i);
        const isBoss = diff === 'hard';
        const isTyping = isBoss || i % 4 === 0;
        const correctAnswer = String(raw.correct_answer).trim();

        // Validate options: must be array of 3+ AND must contain the correct answer
        let options = base.options;
        if (Array.isArray(raw.options) && raw.options.length >= 3) {
            const hasCorrect = raw.options.some(o => String(o).trim() === correctAnswer);
            if (hasCorrect) {
                options = raw.options.slice(0, 3);
            }
        }

        normalized.push({
            level: i,
            difficulty: diff,
            mode: raw.mode || (isTyping ? 'typing' : 'mcq'),
            title: raw.title || base.title,
            prompt: raw.prompt || base.prompt,
            buggy_code: raw.buggy_code,
            correct_answer: correctAnswer,
            options,
            hint: raw.hint || base.hint,
            explanation: raw.explanation || base.explanation
        });
    }

    return normalized;
}
