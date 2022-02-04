/* eslint-disable no-unused-vars */
const conditionLevel = require("../models/unit").conditionLevel;
const Helper = require("./helper");

let discoutBasedOnCondition = {
    id: 0,
    majorflawDiscount: 0.5,
    minorflawDiscount: 0.8,
    async condition({ unit, ...others }) {
        if(unit.condition === conditionLevel.broken) {
            throw new Error("Tryied to calculate modifers for a broken unit");
        }

        return unit.condition === conditionLevel.majorflaw || unit.condition === conditionLevel.minorflaw;
    },
    async value({ unit, ...others}) {
        if(unit.condition === conditionLevel.majorflaw) return this.majorflawDiscount
        if(unit.condition === conditionLevel.minorflaw) return this.minorflawDiscount
        return 1;
    },
    async shortExplanation({...others }) {
        return "Sconto dovuto allo stato dell'unità";
    },
    async longExplanation(contex) {
        return `Uno sconto del ${Helper.toPercent(1 - await this.value(contex))}% è applicato perché l'unità ha ${Helper.translateUnitConditionToItalian(contex.unit.condition)}`;
    }
};

let surchargeBasedOnWeekendDays = {
    id: 1,
    //This modifier modify the price based on how much day are on the weekend
    //Weekend day cost 20% more
    surchargePrice: 1.2,
    weekendDays: null,
    async condition({ day }) {
        return Helper.isWeekend(day)
    },
    async value(contex) {
        return this.surchargePrice;
    },
    async shortExplanation({ unit }) {
        return "Prezzo aumentanto nei weekend";
    },
    async longExplanation({ unit }) {
        return `I giorni nel weekend, visto la grossa richiesta, hanno un sovvrapprezzo del ${Helper.toPercent(this.surchargePrice - 1)}%`;
    }
};

let surchargeBasedOnLateDays = {
    id: 2,
    //This modifier modify the price based on if the days is after the expected end date, so the rent is late
    //Each late days cost 25% more
    surchargePrice: 1.25,
    async condition({ day, expectedEndDate }) {
        if(!expectedEndDate) {return false}

        return day > expectedEndDate;
    },
    async value(contex) {
        return this.surcharge;
    },
    async shortExplanation({ unit }) {
        return "Prezzo aumentanto nei giorni di ritardo";
    },
    async longExplanation({ unit }) {
        return `Ogni giorno di ritardo ha un sovraprezzo del ${Helper.toPercent(this.surchargePrice - 1)}%, a causa dei disguidi che comporta alla compagnia`;
    }
}

const modifiersList = [
    discoutBasedOnCondition,
    surchargeBasedOnWeekendDays,
    surchargeBasedOnLateDays
]

module.exports.modifiersList = modifiersList;
    