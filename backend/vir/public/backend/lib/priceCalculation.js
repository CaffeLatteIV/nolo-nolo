const modifiersList = require("./modifiers").modifiersList;
const Offer = require("../models/offer").model;

const Helper = require("./helper");

class DayPriceEstimation {
    constructor(date, modifiers, basePrice, finalPrice) {
        this.date = date
        this.modifiers = modifiers
        this.basePrice = basePrice
        this.finalPrice = finalPrice
    }
}

class Modifier {
    constructor(shortExplanation, longExplanation, modifierID, daysCount = 0) {
        this.shortExplanation = shortExplanation;
        this.longExplanation = longExplanation;
        this.modifierID = "" + modifierID;
        this.daysCount = daysCount;
    }
}

class PriceEstimation{
    constructor(basePrice, modifiersList, finalPrice, unitID, daysCount, unitBasePrice, repairDamageSurcharge = 0){
        this.basePrice = basePrice;
        this.modifiersList = modifiersList;
        this.finalPrice = finalPrice;
        this.unitID = unitID;
        this.daysCount = daysCount;
        this.pricePerDay = (finalPrice - repairDamageSurcharge )/ this.daysCount;
        this.unitBasePrice = unitBasePrice;
        this.repairDamageSurcharge = repairDamageSurcharge;
    }
}

async function computePriceEstimation(units, info) {
    let estimations = [];

    info.activeOffers = await getSortedAndFilteredOffers(info.category, info.from, info.to)

    for (const unit of units) {
        estimations.push(await unitPriceEstimation(unit, info));
    }

    return estimations.sort( (a, b) => parseFloat(a.finalPrice) - parseFloat(b.finalPrice) );
}

async function unitPriceEstimation(unit, info) {
    if(!info.activeOffers){
        info.activeOffers = await getSortedAndFilteredOffers(info.category, info.from, info.to)
    }
    
    const modifiersMap = new Map();
    const daysCount = Helper.dayDifference(info.from, info.to) + 1;
    let basePrice = 0;
    let finalPrice = 0;

    let currentDate = info.from;
    for(let i = 0; i < daysCount; i += 1){
        const dayPriceEstimation = await computeUnitPriceEstimationForADay(currentDate, unit, info)

        for(const modifier of dayPriceEstimation.modifiers) {
            const id = modifier.modifierID;
            const newModifier = modifiersMap.has(id) ? modifiersMap.get(id) : modifier;
            newModifier.daysCount += 1;
            modifiersMap.set(id, newModifier)
        }

        basePrice = basePrice + dayPriceEstimation.basePrice;
        finalPrice = finalPrice + dayPriceEstimation.finalPrice;

        currentDate = currentDate.addDays(1);   
    }

    if(info.repairDamageSurcharge) {
        finalPrice = finalPrice + parseInt(info.repairDamageSurcharge);
    }

    return new PriceEstimation(basePrice, Array.from(modifiersMap.values()), finalPrice, unit._id, daysCount, unit.price, info.repairDamageSurcharge || 0);
}

async function computeUnitPriceEstimationForADay(day, unit, info) {
    const modifiers = []
    const contex = {...info, day, unit};
    const basePrice = unit.price;
    let finalPrice = basePrice;

    // For normal modifiers
    for (const modifier of modifiersList) {
        if(await modifier.condition(contex)) {
            modifiers.push(new Modifier(await modifier.shortExplanation(contex), await modifier.longExplanation(contex), modifier.id));
            finalPrice = finalPrice * await modifier.value(contex)
        }
    }

    // For modifiers given by periods special offers, it only takes the best offers for the day
    for(const offer of info.activeOffers || []){
        if(!(offer.start <= day && day <= offer.end)) {
            continue;
        }

        modifiers.push(new Modifier(offer.shortDescription, offer.description, offer._id))
        finalPrice = finalPrice * offer.modifier
        // It breaks at the first offer since it is the best
        break;
    }

    return new DayPriceEstimation(day, modifiers, basePrice, finalPrice);
}

async function getSortedAndFilteredOffers(category, from, to) {
    const offers = await Offer.find();
    const offersInPeriod = offers.filter(o => {
        return (o.start <= from && from <= o.end) || 
               (o.start <= to && to <= o.end) ||
               (from <= o.start && o.end <= to)
    })
    const filtered = offersInPeriod.filter(o => {
        return o.categoryFilter.length === 0 || o.categoryFilter.includes(category)
    })
    const sorted = filtered.sort((a, b) => {a.modifier - b.modifier})

    return sorted;
}

module.exports.computePriceEstimation = computePriceEstimation;
module.exports.unitPriceEstimation = unitPriceEstimation
