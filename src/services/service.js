const presidio = require('../Presidio adapter/presidio')

function actual_level(data) {
    const HIGH_RISK_ENTITIES = ["CREDIT_CARD", "CRYPTO", "IBAN_CODE", "IP_ADDRESS", "MAC_ADDRESS", "LOCATION", "PERSON", "PHONE_NUMBER", "EMAIL_ADDRESS", "MEDICAL_LICENSE", "US_BANK_NUMBER", "US_DRIVER_LICENSE", "US_ITIN", "US_MBI", "US_NPI", "US_PASSPORT", "US_SSN", "UK_DRIVING_LICENCE", "UK_NHS", "UK_NINO", "UK_PASSPORT", "UK_VEHICLE_REGISTRATION", "MEDICAL_FAMILY_HISTORY", "MEDICAL_HISTORY"]
    const MEDIUM_RISK_ENTITIES = ["NRP", "UK_POSTCODE"]
    const LOW_RISK_ENTITIES = ["DATE_TIME", "URL", "MEDICAL_DISEASE_DISORDER", "MEDICAL_MEDICATION", "MEDICAL_THERAPEUTIC_PROCEDURE", "MEDICAL_CLINICAL_EVENT", "MEDICAL_BIOLOGICAL_ATTRIBUTE", "MEDICAL_BIOLOGICAL_STRUCTURE"]
    const level = {high : 0, medium : 0, low : 0};

    for (const i in data) {
        let found = HIGH_RISK_ENTITIES.includes(data[i].entity_type); 
        if (found == true) {
            level.high += 1; 
        }
        found = MEDIUM_RISK_ENTITIES.includes(data[i].entity_type); 
        if (found == true) {
            level.medium += 1; 
        }
        found = LOW_RISK_ENTITIES.includes(data[i].entity_type); 
        if (found == true) {
            level.low += 1; 
        }  
    }
    return level; 
}

function risk_level(data) {
    if (data == "") {
        return null;    
    } else {
        const level = actual_level(data);
        console.log(level); 
    }
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
        risk_level(data); 
        // if (data == "") {
        //     console.log("c'est vide");
        // } else {
        //     console.log("c'est pas vide");
            
        // }
        // console.log(data);
        return data;
    }
    catch(err) {
        console.error('Erreur:', err);
        throw new Error('Erreur, le service ne fonctionne pas')
  }
}


module.exports = {service_health, service_analyze}