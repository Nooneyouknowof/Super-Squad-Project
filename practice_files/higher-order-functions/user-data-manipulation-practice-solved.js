// Dummy user data
const users = [
  { id: 1, name: "Alice Johnson", email: "alice@email.com", age: 28, city: "New York", messages: ["Hello", "How are you?"] },
  { id: 2, name: "Bob Smith", email: "bob@email.com", age: 35, city: "Los Angeles", messages: ["What's up?"] },
  { id: 3, name: "Charlie Brown", email: "charlie@email.com", age: 22, city: "Chicago", messages: [] },
  { id: 4, name: "Diana Ross", email: "diana@email.com", age: 40, city: "New York", messages: ["Nice to meet you", "Goodbye"] },
  { id: 5, name: "Edward Norton", email: "edward@email.com", age: 45, city: "Los Angeles", messages: ["Hello world"] },
  { id: 6, name: "Fiona Apple", email: "fiona@email.com", age: 30, city: "Chicago", messages: [] },
  { id: 7, name: "George Clooney", email: "george@email.com", age: 55, city: "New York", messages: ["How's it going?", "See you soon"] },
];


// Practice Activities
function findUserByName(name) {
  return users.find(user => user.name === name);
}
// console.log(findUserByName("Fiona Apple"));

// function findUsersByAge(age) {
//   return users.filter(user=>user.age>age);
// }
const findUsersByAge = age => users.filter(user => user.age > age);
const numbers = [1, 2, 3]
function multiplyNums(arr, x) {
  return arr.map(num => num * x);
}
// console.log(multiplyNums(numbers, 1025));


const oldActors = findUsersByAge(30);
// console.log(oldActors);

// 1. Find a user by ID
function findUserById(id) {
  return users.find(user => user.id === id);
}
const fifthUser = findUserById(5);
// console.log(fifthUser);
// log the users whose id's are 5 and 7

// 2. Filter users by city
function filterUsersByCity(city) {
  // Your code here
  return users.filter(user => user.city === city);
}
const NewYorkers = filterUsersByCity("New York");
// console.log(NewYorkers);
const Chicagoans = filterUsersByCity("Chicago");
// console.log(Chicagoans);
// create two arrayy of users whose cities are Chicago and New York

// 3. Get all users over a certain age
function getUsersOverAge(age) {
  // Your code here
  return users.filter(user => user.age > age);
}
const olderActors = getUsersOverAge(30);
// console.log(olderActors);
// save users who are younger than 30 in an array could under30Demo

// 4. Add a new message to a user's messages array
function addMessageToUser(userId, message) {
  // utilize a try catch block
  try {
    // cache a user to a function call
    const user = findUserById(userId);
    if (user) {
      user.messages.push(message);
      // console.log(user);
      return true;
    } else {
      throw new Error("user does not exist");
    }
    // if the user exists/not undefined
    // push the message to their messages
    // else throw new Error("user does not exist")
  } catch (error) {
    console.error("There was an error" + error.message);
    return false;
  }
}
// console.log(addMessageToUser(5, "Hello"));
const response = addMessageToUser(1, "Wassup");
if (response) {
  console.log("Success adding user message");
  console.log(findUserById(1));
} else {
  console.warn("Failed to add message to user");
}
{
  // 5. Update a user's email
  //app.put(/update-user-email)
  function updateUserEmail(userId, newEmail) {
    try {
      const user = findUserById(userId);
      if (user) {
        // change email
        user.email = newEmail;
        return true; // res.status(200).json({message: "update email successful"})
      } else {
        throw new Error("User not found 404");
      }
    } catch (error) {
      console.error("There was a problem " + error.message);
      return false; // res.status(404).json({error: "404 user not found"});
    }
  }
  // await fetch(/update-user)
  const response = updateUserEmail(2, "bob2@email.com");
  if (response) {
    console.log("success, updating user email");
  } else {
    console.error("You failed! Go to jail");
  }
}