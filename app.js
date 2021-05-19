'use strict';

// To do:
// - Visual error handling

// Page elements
const raceSelect = document.getElementById('races');
const classSelect = document.getElementById('classes');
const raceDescriptionContainer = document.querySelector('.race-description');
const classDescriptionContainer = document.querySelector('.class-description');

// Render race data
const renderRaceDescription = function (data) {
  let html = `
  <h3 class="race_name">${data.name}</h3>
  <h4 class="race_size">${data.size}</h3>
  <p class="race_size-description">${data.size_description}</h3>
  <p class="race_size-description">${data.alignment}</h3>
  <p class="race_size-description">${data.language_desc}</h3>
  <h4 class="race_trait-title">Traits:</h3>
  `;
  raceDescriptionContainer.insertAdjacentHTML('beforeend', html);
  handleTraits(data);
};

// Retrieve race trait data
const handleTraits = async function (data) {
  const traits = Object.values(data.traits);
  let urlArr = [];
  for (let i = 0; i < traits.length; i++) {
    urlArr.push(traits[i].url);
  }
  console.log(urlArr);

  // Dynamically render trait titles and descriptions
  for (let i = 0; i < urlArr.length; i++) {
    traitDescription(urlArr[i]);
  }
};

const traitDescription = async function (url) {
  try {
    const res = await fetch(`https://www.dnd5eapi.co${url}`);
    const data = await res.json();
    const traitName = data.name;
    const traitDesc = data.desc.map((entries) => {
      return entries;
    });
    console.log(traitName);
    let html = `<p class="race_trait-description"> ${traitName} - ${traitDesc} </p>`;
    raceDescriptionContainer.insertAdjacentHTML('beforeend', html);
  } catch (err) {
    console.log('Error - could not retrieve trait data', `${err}`);
  }
};

const renderClass = function (data) {
  const proficiencies = data.proficiencies;
  console.log(proficiencies);
  const html = `
  <h3 class="class_name">${data.name}</h3>`;
  classDescriptionContainer.insertAdjacentHTML('beforeend', html);
};

const renderError = function (msg) {
  raceDescriptionContainer.insertAdjacentHTML('beforeend', msg);
};

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
    renderClass(data);
    console.log(data);
  } catch (err) {
    renderError(err.message);
  }
};

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
