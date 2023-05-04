import {raceToCreate, routeHandler} from "../../models";
import {createRace, getShortestRaces} from "../../services/race/implementation";
import {checkStructureOrThrow} from "check-structure";
import {getCarById} from "../../services/car/implementation";
import type {Server} from "socket.io";

/**
 * Controller post pour la route /race
 * @param req Requete
 * @param res Reponse
 * @returns le temps créé
 */
export const route: routeHandler = async (req, res) => {
    const race = req.body;

    // Vérification de la structure de la requête
    try {
        checkStructureOrThrow(race, {
            realisation_date_time: Date,
            sector_one: Date,
            id_car: Number,
        })
    } catch (e: any) {
        res.status(400).json({ error: e.message });
        return;
    }

    // Vérification de l'existence de la voiture
    if (await getCarById(parseInt(race.id_car)) === null) {
        res.status(404).json({ error: 'Car not found' });
        return;
    }

    const raceToCreate: raceToCreate = {
        realisation_date_time: new Date(race.realisation_date_time),
        sector_one: new Date(race.sector_one),
        id_car: race.id_car,
    }

    // Création de la manche
    try {
        res.json(await createRace(raceToCreate));
    } catch (e: any) {
        res.status(500).json({ error: e.message });
        return
    }

    res.app.get<Server>("socketio").emit("updatedRaces", await getShortestRaces())
};

export default route;


