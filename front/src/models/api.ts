import { Socket, io } from 'socket.io-client';
import api from '@/models/api';
import type Avatar from '@/models/avatar';

const routeApi: string = import.meta.env.VITE_ROUTE_API;

export namespace restful {
  export enum ReturnCodes {
    NoCode = 0,
    Success = 200,
    NotFound = 404,
    Conflict = 409,
    BadGateway = 502,
    Unauthorized = 401
  }

  export const ERROR_MESSAGE = 'Error';

  /**
   * Retourne les données d'une voiture en fonction de son ID
   * @param queryId Query id de la voiture à retourner
   */
  export async function getDataOneCarQueryId(queryId: number | string) {
    try {
      const routeCar = `${routeApi}car/query-id/${queryId}`;
      const res = await fetch(routeCar);
      const json: models.rawData.CarData = await res.json();
      const parsedJson: models.parsedData.CarData = {
        idCar: json.id_car,
        queryId: json.query_id,
        pseudo: json.pseudo,
        avatar: json.avatar
      };
      return { json: parsedJson, status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Retourne les données d'une voiture en fonction de son ID
   * @param idCar Id de la voiture à retourner
   */
  export async function getDataOneCarId(idCar: number | string) {
    try {
      const routeCar = `${routeApi}car/${idCar}`;
      const res = await fetch(routeCar);
      const json: models.rawData.CarData = await res.json();
      const parsedJson: models.parsedData.CarData = {
        idCar: json.id_car,
        queryId: json.query_id,
        pseudo: json.pseudo,
        avatar: json.avatar
      };
      return { json: parsedJson, status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Obtient toutes les manches d'une voiture passée en paramètre
   * @param idCar Id de la voiture
   */
  export async function getAllRaceOneCar(idCar: number | string) {
    try {
      const routeRaceCar = `${routeApi}race/${idCar}`;
      const res = await fetch(routeRaceCar);
      const json: models.rawData.CarRaces = await res.json();
      const parsedJson: models.parsedData.RacesData = {
        rank: json.rank,
        races: json.races.map(value => ({
          idCar: value.id_car,
          idRace: value.id_race,
          sector1: new Date(value.sector1),
          raceStart: new Date(value.race_start),
          raceFinish: new Date(value.race_finish),
          totalTime: new Date(value.total_time)
        }))
      };
      return { json: parsedJson, status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Obtient le nom d'une section en fonction de son id
   * @param idSection Id de la section
   */
  export async function getNameSectionById(idSection: number | string) {
    try {
      const routeRaceCar = `${routeApi}section/${idSection}`;
      const res = await fetch(routeRaceCar);
      const json: models.rawData.SectionName = await res.json();
      const parsedJson: models.parsedData.SectionName = {
        idSection: json.id_section,
        label: json.label
      };
      return { json: parsedJson, status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Obtient toutes les activités présente dans une section
   * @param idSection Id de la section
   */
  export async function getAllActivitiesOneSection(idSection: number | string) {
    try {
      const routeRaceCar = `${routeApi}activity/by-section/${idSection}`;
      const res = await fetch(routeRaceCar);
      const json: models.rawData.SectionActivities = await res.json();
      const parsedJson: models.parsedData.SectionActivities = json.map(value => ({
        idActivity: value.id_activity,
        idSection: value.id_section,
        label: value.label
      }));
      return {
        json: parsedJson, status: res.status
      };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Obtient toutes les sections
   */
  export async function getAllSections() {
    try {
      const routeRaceCar = `${routeApi}section/`;
      const res = await fetch(routeRaceCar);
      return { json: (await res.json()), status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  export async function getActivityOneCar(idCar: number | string) {
    try {
      const routeRaceCar = `${routeApi}activity/by-car/${idCar}`;
      const res = await fetch(routeRaceCar);
      return { json: (await res.json()), status: res.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Lance une requête POST pour récupérer un token d'authentification
   * @param sectionName Nom de la section
   * @param pwd Mot de passe de la section
   */
  export async function authenticationSectionPwd(sectionName: string, pwd: string) {

    //Construction des options de requête
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        section: sectionName,
        password: pwd
      })
    };

    try {
      const response = await fetch(`${routeApi}authentication/section`, requestOptions);
      const json: models.rawData.AuthenticationToken = await response.json();
      const parsedJson: models.parsedData.AuthenticationToken = json;
      return { json: parsedJson, status: response.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Lance une requête POST pour l'ajout d'une nouvelle activité pour une voiture
   * @param idActivity Nom de la section
   * @param queryId Query id de la voiture
   * @param token Token d'identification
   */
  export async function addRealisationCar(idActivity: number, queryId: number | string, token: string) {

    // POST request using fetch with async/await
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.toString()}`
      },

      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        id_activity: idActivity,
        // eslint-disable-next-line camelcase
        query_id: queryId,
        // eslint-disable-next-line camelcase
        date_time: new Date()
      })
    };

    try {
      const response = await fetch(`${routeApi}realise/query-id`, requestOptions);
      return response.status;
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Lance une requête POST pour récupérer un token d'authentification
   * @param queryId Identifiant d'url de la voiture
   * @param pwd Mot de passe de la voiture
   */
  export async function authenticationQueryIdPwd(queryId: string, pwd: string) {
    //Construction des options de requête
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        query_id: queryId,
        // eslint-disable-next-line camelcase
        password: pwd
      })
    };
    try {
      const response = await fetch(`${routeApi}authentication/car`, requestOptions);
      const json: models.rawData.AuthenticationToken = await response.json();
      const parsedJson: models.parsedData.AuthenticationToken = json;
      return { json: parsedJson, status: response.status };
    } catch (e) {
      return { json: ERROR_MESSAGE, status: ReturnCodes.BadGateway };
    }
  }

  /**
   * Lance une requête PATCH pour modifier une voiture
   * @param userCar la voiture de l'utilisateur, contenant le token
   */
  export async function updateCar(userCar: models.parsedData.AuthenticatedUpdateCarData) {
    // Teste si l'id de la voiture est défini
    if(!userCar.car.idCar) {
      throw new Error('Car id is undefined');
    }

    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userCar.token}`
      },
      body: JSON.stringify({
        // eslint-disable-next-line camelcase
        id_car: userCar.car.idCar,
        // eslint-disable-next-line camelcase
        pseudo: userCar.car.pseudo,
        // eslint-disable-next-line camelcase
        avatar: userCar.car.avatar,
      })
    };

    // Envoie la requête
    const response = await fetch(`${routeApi}car`, requestOptions);

    if (!(response.status === api.ReturnCodes.Success)) {
      throw new Error('Unauthorized');
    }

    const json: models.rawData.CarData = await response.json();
    const parsedJson: models.parsedData.CarData = {
      idCar: json.id_car,
      queryId: json.query_id,
      pseudo: json.pseudo,
      avatar: json.avatar
    };
    return { json: parsedJson, status: response.status };
  }
}

/**
 * Classe représentant une connexion au webSocket
 */
export class WebsocketConnection {
  socket: Socket;
  carId?: number;

  /**
   * Initialise une connection. Il est possible de s'identifier en passant un identifiant de voiture, ou de rester
   * anonyme en laissant le paramètre vide.
   * @param carId L'id de la voiture. La connection n'acceptera pas de UpdatedUserRaces si ce paramètre est vide.
   */
  constructor(carId?: number) {
    // Définis les paramètres du socket, si on doit passer la voiture ou pas
    const parameters =
      carId !== undefined
        ? {
          query: {
            carId,
          },
        }
        : undefined;

    // Se connecte au websocket
    this.socket = io(`${(new URL(routeApi)).protocol}//${(new URL(routeApi)).host}`, parameters);
    this.carId = carId;
  }

  /**
   * Déconnecte le socket.
   */
  destroy() {
    this.socket.disconnect();
  }

  /**
   * Évènement exécuté à la mise à jour du classement
   * @param callback Code à exécuter à la réception de l'évènement
   * @event updatedRaces
   */
  onRankingReceived(callback: (data: models.rawData.RankingData) => void) {
    this.socket.on('updatedRaces', callback);
    return this;
  }

  /**
   * Évènement exécuté à la mise à jour des courses d'un utilisateur
   * <p style="color: red; font-weight: bold;">
   *   Il est nécessaire d'initialiser le websocket avec un carId pour utiliser cette fonction!
   *   </p>
   * @param callback Code à exécuter à la réception de l'évènement
   * @event updatedUserRaces
   */
  onUserRace(callback: (data: models.rawData.CarRaces) => void) {
    // Interdit l'utilisation de l'évènement si la connexion est anonyme
    if (this.carId === undefined)
      throw new Error('carId is undefined');

    this.socket.on('updatedUserRaces', callback);
    return this;
  }

  /**
   * Évènement exécuté à la réalisation d'activités
   * @param callback Code à exécuter à la réception de l'évènement
   * @event updatedActivities
   */
  onActivityRealisation(callback: (data: models.rawData.WSRealisation) => void) {
    this.socket.on('updatedActivities', callback);
    return this;
  }

  onConnectedError(callback: (error: unknown) => void) {
    this.socket.on('connect_error', callback);
  }
}

export namespace models {

  /**
   * Contient les structures des données brutes retournées par les endpoints de l'api
   */
  export namespace rawData {
    /**
     * Représente une activité pour le webSocket
     */
    export interface Activity {
      id_activity: number,
      label: string
      id_section: number
    }

    /**
     * Représente une donnée de statistiques sur la réalisation des activités
     */
    export interface WSRealisation {
      count: number,
      mostPopular: rawData.Activity & { count: number }
    }

    /**
     * Retourné par /car/
     */
    export interface CarData {
      id_car: number,
      query_id: string,
      pseudo: string,
      avatar: Avatar.Avatar
    }

    /**
     * Retourné par /race/{idcar}
     */
    export interface CarRaces {
      races: {
        id_race: number;
        race_start: string;
        sector1: string;
        race_finish: string;
        id_car: number;
        total_time: string;
      }[],
      rank: number
    }

    /**
     * Retourné par /section/{idSection}
     */
    export interface SectionName {
      id_section: number,
      label: string
    }

    /**
     * Retourné par /activity/by-section/{idSection}
     */
    export type SectionActivities = {
      id_activity: number,
      label: string,
      id_section: number
    }[]

    /**
     * Retourné par /authentication/section et par /authentication/car
     */
    export interface AuthenticationToken {
      token: string
    }


    /**
     * Représente une course unique du classement
     */
    export type WsRaceData = {
      id_race: number,
      car: {
        id_car: number,
        pseudo: string,
        avatar: Avatar.Avatar,
      },
      total_time: Date | string
    }

    /**
     * Représente le classement des courses
     */
    export type RankingData = {
      races: WsRaceData[],
      count: number,
      fastest: WsRaceData
    };
  }

  export namespace parsedData {
    export interface CarData {
      idCar: number,
      queryId: string,
      pseudo: string,
      avatar: Avatar.Avatar
    }

    /**
     * Représente les courses d'un utilisateur
     */
    export interface RacesData {
      races: {
        idRace: number,
        raceStart: Date,
        raceFinish: Date,
        idCar: number,
        totalTime: Date,
        sector1: Date
      }[],
      rank: number
    }

    /**
     * Représente une paire nom de section / id de section
     */
    export interface SectionName {
      idSection: number,
      label: string
    }

    /**
     * Représente une liste d'activités d'une section
     */
    export type SectionActivities = {
      idActivity: number,
      label: string,
      idSection: number
    }[]

    /**
     * Représente un token d'authentification
     */
    export interface AuthenticationToken {
      token: string
    }

    /**
     * Représente les données basiques d'une voiture
     */
    export interface UpdateCarData {
      idCar: number | undefined,
      pseudo: string,
      avatar: Avatar.Avatar
    }

    /**
     * Représente les données basiques d'une voiture authentifiée
     */
    export interface AuthenticatedUpdateCarData {
      token: string,
      car: UpdateCarData
    }
  }
}

export default restful;
