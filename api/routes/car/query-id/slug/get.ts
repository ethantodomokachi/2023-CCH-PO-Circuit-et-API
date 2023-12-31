import type { RouteHandler } from '../../../../models';
import { getCarByQueryId } from '../../../../services/car';

/**
 * Controller get pour la route /car/query-id/:slug
 * @param req Requete
 * @param res Reponse
 * @returns une voiture correspondant à l'ID de query
 */
const route: RouteHandler<{ slug: string; }> = async (req, res) => {
  if (!req.params.slug) {
    res.status(400).json({ message: 'No given ID' });
    return;
  }

  const id = req.params.slug;
  const car = await getCarByQueryId(id);

  if (!car) {
    res.status(404).json({ message: 'Car not found' });
    return;
  }

  res.json(car);
};
export default route;
