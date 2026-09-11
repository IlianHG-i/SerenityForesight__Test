const { json } = require('express');
const presidio = require('../Presidio adapter/presidio')

function actual_level(data) {
    const HIGH_RISK_ENTITIES = ["CREDIT_CARD", "CRYPTO", "IBAN_CODE", "IP_ADDRESS", "MAC_ADDRESS", "LOCATION", "PERSON", "PHONE_NUMBER", "EMAIL_ADDRESS", "MEDICAL_LICENSE", "US_BANK_NUMBER", "US_DRIVER_LICENSE", "US_ITIN", "US_MBI", "US_NPI", "US_PASSPORT", "US_SSN", "UK_DRIVING_LICENCE", "UK_NHS", "UK_NINO", "UK_PASSPORT", "UK_VEHICLE_REGISTRATION", "MEDICAL_FAMILY_HISTORY", "MEDICAL_HISTORY"], MEDIUM_RISK_ENTITIES = ["NRP", "UK_POSTCODE"], LOW_RISK_ENTITIES = ["DATE_TIME", "URL", "MEDICAL_DISEASE_DISORDER", "MEDICAL_MEDICATION", "MEDICAL_THERAPEUTIC_PROCEDURE", "MEDICAL_CLINICAL_EVENT", "MEDICAL_BIOLOGICAL_ATTRIBUTE", "MEDICAL_BIOLOGICAL_STRUCTURE"], level = {high : 0, medium : 0, low : 0};
    for (const i in data) {
        if (HIGH_RISK_ENTITIES.includes(data[i].entity_type) == true) {
            level.high += 1; 
        } if (MEDIUM_RISK_ENTITIES.includes(data[i].entity_type) == true) {
            level.medium += 1; 
        } if (LOW_RISK_ENTITIES.includes(data[i].entity_type) == true) {
            level.low += 1; 
        }  
    }
    return level; 
}

function risk_level(data) {
    if (data.length === 0) {
        return "none";    
    } else {
        const level = actual_level(data);
        const high_risk = level.high, medium_risk = level.medium, low_risk = level.low;
        if (high_risk >= 2) {
            return "high";
        } if (high_risk == 1 || medium_risk >= 2) {
            return "medium";
        } if (medium_risk == 1 || low_risk >= 1) {
            return "low";
        } else {
            return "none";
        }
    }
} 

function summary (data) {
    const entities = {};
    for (const i in data) {
        if (data[i].entity_type in entities) {
            entities[data[i].entity_type] += 1;
        } else {
            entities[data[i].entity_type] = 1;
        }
    }   
    return {totalEntities:data.length, entityTypes:entities}
}

 
async function service_health () {
    const requete = await presidio.health()
    if (requete != true) {
        return false;
    }
    return true;
}

async function service_analyze(texte, lang) {
    try {
        const data = await presidio.analyze(texte, lang); 
        const risk = risk_level(data);
        return {
            "containsSensitiveData": risk !=='none', 
            "riskLevel": risk, 
            "summary": summary(data), 
            "entities": data.map(entities => ({ type: entities.entity_type, start: entities.start, end: entities.end, confidence: entities.score }))
        }
    }
    catch(err) {
        console.error('Erreur:', err);
        if (err.message == "PRESIDIO_UNREACHABLE") {
            throw new Error('PRESIDIO_UNREACHABLE')
        } else {
            throw new Error('PRESIDIO_ERROR')

        }
  }
}


module.exports = {service_health, service_analyze}