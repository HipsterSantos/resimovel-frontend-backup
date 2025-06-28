import { houseTraits, typeOfBusiness } from "./house.traits";
import createImovelSteps from './create.imovel'

function truncateWords(word,maxLength){
    if(word.lenght<=maxLength) return word
    const trancatedWrod = word.substring(0,maxLength);
    return trancatedWrod.substring(0,trancatedWrod.lastIndexOf(" "),)+"..."
}

export {
    typeOfBusiness,
    houseTraits,
    truncateWords,
    createImovelSteps

}