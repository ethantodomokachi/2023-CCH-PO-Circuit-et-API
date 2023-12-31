import type { RouteHandler } from '../../../../models';
import { getCarById } from '../../../../services/car';
import { getActivitiesByCarId } from '../../../../services/activity/';

/**
 * Controller pour la route /activity/:slug
 * @param req Requete
 * @param res Reponse
 * @returns une activité correspondant à l'id de la section
 */
const route: RouteHandler<{ slug: string; }> = async (req, res) => {
  const id = parseInt(req.params.slug);

  // vérifie la validité de l'id
  if (typeof id === null || isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });

    return;
  }

  // vérifie l'existence de la voiture
  if (await getCarById(id) === null) {
    res.status(404).json({ message: 'Car not found' });
    return;
  }

  // retourne les activités de la voiture
  res.json(await getActivitiesByCarId(id));
};
export default route;
