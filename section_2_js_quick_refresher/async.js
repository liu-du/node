console.log('Start script!');

// --------- Callback style 1 ---------
// const fetchData = (callbackA, callbackB) => {
//     // need to nest callbacks
//     setTimeout(() => {
//         callbackA('Fetched data A!');
//         setTimeout(() => {
//             callbackB('Fetched data B!')
//         }, 2000); // 2 seconds for fetch data b 
//     }, 2000); // 2 seconds for fetching data a
// };

// setTimeout(() => {
//     console.log('Timer is done!');
//     fetchData(text => console.log(text), text => console.log(text));
// }, 2000);

// --------- Callback style 2 ---------

// const fetchDataA = callback => {
//     // if want to wait, need to nest callbacks
//     setTimeout(() => {
//         callback('Fetched data A!');
//     }, 2000);
// };

// const fetchDataB = callback => {
//     // if want to wait, need to nest callbacks
//     setTimeout(() => {
//         callback('Fetched data B!');
//     }, 2000);
// };

// setTimeout(() => {
//     console.log('Timer is done!');
//     fetchDataA(text => console.log(text));
//     setTimeout(() => {
//         fetchDataB(text => console.log(text));
//     }, 2000);
// }, 2000);


// --------- Promise ---------
const fetchDataA = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Fetched data A!');
        }, 2000);
    });
    return promise;
};

const fetchDataB = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Fetched data B!');
        }, 2000);
    });
    return promise;
};

setTimeout(() => {
    console.log('Time is done!');
    fetchDataA()
    .then(text => {
        console.log(text);
        return fetchDataB();
    })
    .then(text2 => {
        console.log(text2);
    });
}, 2000);

console.log("End of script!");