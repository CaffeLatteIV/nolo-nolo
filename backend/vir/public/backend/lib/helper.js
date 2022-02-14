const fs = require("fs").promises;
const conditionLevel = require("../models/unit").conditionLevel;
var getDirName = require('path').dirname;

function dayDifference(date1, date2){
    return Math.round((date2-date1)/(1000*60*60*24));
}

function isWeekend(date){
    let day = date.getDay();
    return day === 6 || day === 0;
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function getNumberOfWorkingDays(startDate, endDate) {
  var numWorkDays = 0;
  var currentDate = new Date(startDate);
  while (currentDate <= endDate) {
      // Skips Sunday and Saturday
      if (!isWeekend(currentDate)) {
          numWorkDays++;
      }
      currentDate = currentDate.addDays(1);
  }
  return numWorkDays;
}

function getNumberOfWeekendDays(startDate, endDate) {
  var numWorkDays = 0;
  var currentDate = new Date(startDate);
  while (currentDate <= endDate) {
      // Skips Sunday and Saturday
      if (isWeekend(currentDate)) {
          numWorkDays++;
      }
      currentDate = currentDate.addDays(1);
  }
  return numWorkDays;
}

function toPercent(value) {
  return Math.round(value * 100)
}

function translateUnitConditionToItalian(condition) {
  if (condition === conditionLevel.minorflaw) return 'danni minori'
  if (condition === conditionLevel.majorflaw) return 'danni maggiori'
  if (condition === conditionLevel.broken) return 'rotta'
  if (condition === conditionLevel.perfect) return 'perfetta'
  else return 'condizione errata'
}

async function createFileAndDir(path) {
  try{
    await fs.mkdir(getDirName(path), { recursive: true });
    (await fs.open(path, "a")).close();
  } catch (error) {
    console.error(error);
  }
}

function createFileAndDirSync(path) {
  const fsSync = require("fs");
  try{
    fsSync.mkdirSync(getDirName(path), { recursive: true });
    const file = fsSync.openSync(path, "a");
    fsSync.closeSync(file);
  } catch (error) {
    console.error(error);
  }
}

const fileExists = async path => !!(await fs.stat(path).catch(e => false));

async function deleteFile(absPath) {
    console.log(absPath);
    if (await fileExists(absPath))
        await fs.unlink(absPath);

}

function getRandomNameForImage(prefix, suffix) {
    const random = Math.floor(Math.random() * 1000000) 
    return `${prefix}-${Date.now()}-${random}${suffix}`;
}

function mapAsync(array, callbackfn) {
  return Promise.all(array.map(callbackfn));
}

function filterAsync(array, callbackfn) {
  return mapAsync(array, callbackfn).then(filterMap => {
    return array.filter((value, index) => filterMap[index]);
  });
}

Array.prototype.mapAsync = async function (callbackfn){ return mapAsync(this, callbackfn); }

Array.prototype.filterAsync = async function (callbackfn){ return filterAsync(this, callbackfn); }


module.exports = {dayDifference,
  isWeekend,
  getNumberOfWorkingDays,
  getNumberOfWeekendDays,
  toPercent, 
  translateUnitConditionToItalian,
  createFileAndDir, 
  createFileAndDirSync, 
  deleteFile, 
  getRandomNameForImage, 
  filterAsync}