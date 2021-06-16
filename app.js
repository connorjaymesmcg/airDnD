'use strict';

// To do:
// - Visual error handling
// Refactor handleTraits function to handle dynamic data (proficiencies, starting equipment, etc)
// Assign class levels/features/bonuses to dynamic table

//
// Page elements
const raceSelect = document.getElementById('races');
const classSelect = document.getElementById('classes');
const raceDescriptionContainer = document.querySelector('.race-description');
const classDescriptionContainer = document.querySelector('.class-description');
const classTable = document.querySelector('.class-table');
const classLevel = document.querySelector('.level');

//
// Render race data
const renderRaceDescription = function (data) {
  let html = `
  <div class="race_container">
  <h3 class="race_name">${data.name ? data.name : `Please make a selection`}</h3>
  <h4 class="race_size">${data.size ? data.size : ' '}</h3>
  <p class="race_size-description">${data.size_description ? data.size_description : ' '}</h3>
  <p class="race_size-description">${data.alignment ? data.alignment : ' '}</h3>
  <p class="race_size-description">${data.language_desc ? data.language_desc : ' '}</h3>
  <h4 class="race_trait-title">Traits:</h3>
  </div>
  `;
  raceDescriptionContainer.insertAdjacentHTML('beforeend', html);
  handleTraits(data);
};

//
// Retrieve race trait data
const handleTraits = async function (data) {
  try {
    // if (data.traits === undefined) raceDescriptionContainer.insertAdjacentHTML('afterbegin', 'Please select a valid option')
    const traits = Object.values(data.traits);
    let urlArr = [];
    for (let i = 0; i < traits.length; i++) {
      urlArr.push(traits[i].url);
    }
    // Dynamically render trait titles and descriptions
    for (let i = 0; i < urlArr.length; i++) {
      traitDescription(urlArr[i]);
    }
  } catch (err) {
    console.log('Error - could not retrieve trait data', `${err}`);
  }
};

//
// Retrieve trait description data
const traitDescription = async function (url) {
  try {
    const res = await fetch(`https://www.dnd5eapi.co${url}`);
    const data = await res.json();
    const traitName = data.name;
    const traitDesc = data.desc.map((entries) => {
      return entries;
    });
    let html = `<p class="race_trait-description"> ${traitName} - ${traitDesc} </p>`;
    raceDescriptionContainer.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.log('Error - could not retrieve trait data', `${err}`);
  }
};

//
// Render class description data
const renderClassDescription = function (data) {
  // console.log(data);
  const html = `
  <h3 class="class_name">${data.name}</h3>
  `;
  console.log(data)
  classDescriptionContainer.insertAdjacentHTML('beforeend', html);
  handleProficiencies(data);
  // renderClassTable(data)
  renderClassTable(data.name)
};

// const renderClassTable = async function (data) {
//   data = data.name
//   renderClassTable(data)

// };


//
// Retrieve class description data
const handleProficiencies = async function (data) {
  try {
    const proficiencies = Object.values(data.proficiencies).map((el) => el.name);
    let html = `<p>${proficiencies}<p>`;
    classDescriptionContainer.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.log('Error - could not retrieve proficiencies');
  }
};

const renderClassTable = async function (data) {
  console.log(data)
  data = data.toLowerCase()
  try {
    const res = await (await fetch(`https://www.dnd5eapi.co/api/classes/${data}/levels/`)).json()
    let levelData = Object.entries(res)
    levelData = levelData.map(e => e[1])
    console.log(levelData)
    // levelData.forEach(e => console.log(e[1].features))
    // const levels = await levelData.map(entries => {
    //   return entries
    // });
    const html = `
    <h3 class='levelHeadline'>${levelData}</h3>
    `
    // classTable.insertAdjacentHTML('beforeend', html)
  } catch (err) {
    console.log('Could not retrieve class levels');
  }
};


//
// Visual error handling
const renderError = function (msg) {
  raceDescriptionContainer.insertAdjacentHTML('beforeend', msg);
};

//
// Pull race data and populate select element
const getRaces = async function () {
  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/races/`);
    const data = await res.json();
    const races = await data.results.map((entries) => {
      return entries.name;
    });
    console.log(races);
    races.forEach((el) => {
      const opt = document.createElement('option');
      opt.innerHTML = el;
      opt.value = el;
      raceSelect.appendChild(opt);
    });
  } catch (err) {
    console.log('Error - could not retrieve race data');
  }
};

//
// Pull class data and populate select element
const getClasses = async function () {
  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/classes`);
    const data = await res.json();
    const classes = await data.results.map((entries) => {
      return entries.name;
    });
    console.log(classes);
    classes.forEach((el) => {
      const opt = document.createElement('option');
      opt.innerHTML = el;
      opt.value = el;
      classSelect.appendChild(opt);
    });
  } catch (err) {
    console.log('Error - could not retrieve class data');
  }
};

const getRaceInfo = async function (race) {
  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/races/${race}/`);
    const data = await res.json();
    console.log(data);
    const removeEmpty = (obj) => {
      let newObj = {};
      Object.keys(obj).forEach((key) => {
        if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
        else if (obj[key] !== undefined) newObj[key] = obj[key];
      });
      return newObj;
    };
    const newData = removeEmpty(data);
    renderRaceDescription(newData);
  } catch (err) {
    renderError(err.message);
  }
};

const getClassInfo = async function (classString) {
  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/classes/${classString}/`);
    const data = await res.json();
    renderClassDescription(data);
    // renderClassTable(data)
  } catch (err) {
    renderError(err.message);
  }
};

//
// Event handlers for DOM interaction
raceSelect.addEventListener('change', (e) => {
  raceDescriptionContainer.innerHTML = ' ';
  const race = e.target.value.toLowerCase();
  getRaceInfo(race);
});

classSelect.addEventListener('change', (e) => {
  classDescriptionContainer.innerHTML = ' ';
  const selectedClass = e.target.value.toLowerCase();
  getClassInfo(selectedClass);
});

getClasses();
getRaces();
