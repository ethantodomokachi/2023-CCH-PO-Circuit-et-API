import {defineStore} from 'pinia'
import {ref} from "vue";
import type {Ref} from "vue";
import Car from "../models/car";
import api from "../models/api";
import Race from "@/models/race";

export const useCarStore = defineStore('car', () => {

    //Initialisation des variables
    let car: Ref<Car> = ref(new Car());

    /**
     * Initialisation de la voiture en fonction de l'URL actuel
     */
    async function initUserCarQueryId(queryId: string | string[]) {

        //Récupère les informations de la voiture
        let {json: dataUserCar, status} = await api.getDataOneCarQueryId(queryId.toString())

        //Remplissage des champs de la voiture
        car.value.idCar = await  dataUserCar["id_car"];
        car.value.pseudo = await dataUserCar["pseudo"];
        car.value.idQuery = await  dataUserCar["query_id"];
        car.value.avatar = await dataUserCar["id_avatar"];

        return status;
    }


    /**
     * Initialisation de la voiture en fonction de l'URL actuel
     */
    async function initUserCarId(idCar: string | string[]) {

        //Récupère les informations de la voiture
        let {json: dataUserCar, status} = await api.getDataOneCarId(idCar.toString())

        //Remplissage des champs de la voiture
        car.value.idCar = await dataUserCar["id_car"];
        car.value.pseudo = await dataUserCar["pseudo"];
        car.value.idQuery = await dataUserCar["query_id"];
        car.value.avatar = await dataUserCar["id_avatar"];

        /**
         * Si on trouve la voiture alors, on renvoie le code
         */
        if (status.valueOf() === api.ReturnCodes.Success) {
            localStorage.setItem("userCarId", car.value.idCar.toString())
        }

        return status;
    }

    /**
     * Initialisation des courses de l'utilisateur dans le store
     */
    async function initUserAllRaceCar() {
        let {json: dataUserRaceCar, status} = await api.getAllRaceOneCar(car.value.idCar);

        //Récupération du rang de la voiture
        car.value.rank = dataUserRaceCar['rank'];

        car.value.listRace = [];
        //Remplissage de la liste de course
        await dataUserRaceCar['races'].forEach(function (race:any) {
            car.value.listRace.push(
                new Race(race['id_race'], new Date(race['race_start']), new Date(race['total_time']))
            )
        })

        return status;
    }

    return {car, initUserCarId, initUserCarQueryId, initUserAllRaceCar};
})

