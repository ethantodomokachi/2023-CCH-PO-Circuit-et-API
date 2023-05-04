import { Prisma } from "@prisma/client";
import buildClient from "../client";
import {raceToCreate} from "../../models";

const prisma = buildClient();

/**
 * Retourne les manches d'une course d'une voiture donnée
 * @param id id de la voiture
 * @returns une liste des manches dans l'ordre croissant
 */
export const getRacesByCar = async (id: number) => {
	return await prisma.race.findMany({
		where: {
			id_car: id
		},
		select: {
			id_race: true,
			realisation_date_time: true,
			sector_one: true,
			id_car: true,
		},
		orderBy: {
			sector_one: Prisma.SortOrder.asc
		}
	});
};

/**
 * Retourne les manches les plus courtes de chaque voiture
 * @returns une liste des manches les plus courtes
 */
export const getShortestRaces = async () => {
	const races = await prisma.race.groupBy({
		by: ["id_car"],
		_min: {
			sector_one: true,
		},
	});

	let res: { id_race: number; sector_one: Date | null; car: { id_car: number; pseudo: string | null; avatar: { image: string | null; }; }; }[] = [];

	for (const k in races) {
		res[k] = await prisma.race.findFirstOrThrow({
			where: {
				sector_one: races[k]._min.sector_one,
			},
			select: {
				id_race: true,
				sector_one: true,
				car: {
					select: {
						id_car: true,
						pseudo: true,
						avatar: {
							select: {
								image: true
							}
						}
					}
				}
			}
		});
	};

	return res;
};

/**
 * Retourne le classement d'une voiture
 * @param id identifiant de la voiture
 * @returns le classement de la voiture ou null si elle n'est pas classée
 */
export const getRankByCar = async (id: number) => {
	const shortestRaces = await getShortestRaces();
	for (let i = 0; i < shortestRaces.length; i++) {
		if(shortestRaces[i].car.id_car === id) {
			return i+1;
		}
	}

	return null;
}

/**
 * Crée une manche de course
 * @param race Manche à créer
 * @returns la manche créée
 */
export const createRace = async (race: raceToCreate) => {

	return await prisma.race.create({
		data: {
			realisation_date_time: race.realisation_date_time,
			sector_one: race.sector_one,
			id_car: race.id_car
		}
	});
}
//
// function validateDate(date: unknown): asserts date is string {
// 	if (typeof date !== 'string') {
// 		throw new Error('Invalid date')
// 	}
// 	const validDate = new Date(date)
// 	if (isNaN(validDate.valueOf()))
// 		throw new Error('Invalid date')
// }
//
// function validateNumber(number: unknown): asserts number is number {
// 	if (typeof number !== 'number') {
// 		throw new Error('Invalid number')
// 	}
// }
