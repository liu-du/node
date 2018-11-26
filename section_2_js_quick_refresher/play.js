
// 1. ----------------- let/const/arrow functions -----------------
console.log('\n1. ----------------- let/const/arrow functions -----------------\n')

const name = 'Jimmy';
const age = 29;
const hasHobbies = true;

const summarizeUser = (userName, userAge, userHasHobby) => {
	return('Name is ' + userName + ', age is ' + userAge + ' and the user has hobbies: ' + userHasHobby);
};
console.log(summarizeUser(name, age, hasHobbies));

// alternative syntax, good for "this"? 
const add = (a, b) => a + b;
console.log(add(1,2));

// if one argument, no need to use parens
const addOne = a => a + 1;
console.log(addOne(1));

// if one argument, no need to use parens
const addRandom = () => 10 + 1;
console.log(addRandom());

// 2. ----------------- objects/properties/methods -----------------
console.log('\n2. ----------------- objects/properties/methods -----------------\n')

const person = {
	name: 'Jimmy',
	age: 29,

	// special shorthand syntax, 'this' refers to the object
	greet() {
		console.log('Hi, I am ' + this.name);
	},

	// in normal anonymous function, 'this' refers to the object
	greet2: function() {
		console.log('Hi, I am ' + this.name);
	},

	// in arrow function, 'this' __doesn't__ refer to the object
	greet3: () => {
		console.log('Hi, I am ' + this.name);
	}
};

console.log(person);
person.greet();
person.greet2();
person.greet3();


// 3. ----------------- Arrays -----------------
console.log('\n3. ----------------- Arrays -----------------\n')

// Arrays in javascript can store different types together
const hobbies = ['Sports', 'Cooking', 1, person]

// for let of loop
for (let hobby of hobbies) {
	console.log(hobby)
}

// Arrays have lots of methods, map does not mutate 
console.log(hobbies.map(hobby => hobby + ' haha'))
console.log(hobbies)


// 4. ----------------- Arrays/Object are reference types -----------------
console.log('\n4. ----------------- Arrays/Object are reference types -----------------\n')

// even if hobbies is declared as a constant, we can still mutate the objects it points to
// we cannot change it to let it point to another object, that's why it's called constant

hobbies.push('Promgramming');
console.log(hobbies)


// 5. ----------------- Rest/Spread Operators -----------------
console.log('\n5. ----------------- Rest/Spread Operators -----------------\n');

// slice
const copiedArray = hobbies.slice();

// ... is the spread operator
const copiedArray2 = [...hobbies];

console.log(copiedArray);
console.log(copiedArray2);

// spreak can also create a (shallow) copy of object
const copiedPerson = {...person};

// both slice and ... pull out each element, but doesn't make copy of the element - a shallow copy.
hobbies[3].name = "New name";

// copiedPerson still has name Jimmy
console.log(copiedPerson);

// hobbies, copiedArray, copiedArray2 have New name
console.log(hobbies);
console.log(copiedArray);
console.log(copiedArray2);

// rest operator: allows passing in variable number of arguments
const toArray = (...args) => {
	return args;
};

console.log(toArray(1,2,3,4));

// 6. ----------------- Destructuring -----------------
console.log('\n6. ----------------- Destructuring -----------------\n');

const person2 = {
	name: 'Jimmy',
	age: 20,
	greet() {
		console.log('Hi, I am ' + this.name);
	}
};

// use the name and age fields of the incoming object
const printName = ({ name, age }) => console.log(name + ' ' + age);
printName(person2)


// destructure (same to unpacking in Python?)
const [ hobby1, hobby2 ] = hobbies;
console.log(hobby1, hobby2);


