import type { RouteHandler } from '../../../../models';
import { getSectionById } from '../../../../services/section';
import { getActivitiesBySectionId } from '../../../../services/activity/';

/**
 * Controller pour la route /activity/:slug
 * @param req Requete
 * @param res Reponse
 * @returns une activité correspondant à l'id de la section
 */
const route: RouteHandler<{ slug: string; }> = async (req, res) => {
  const id = parseInt(req.params.slug);

  if (typeof id === null || isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });

    return;
  }

  if (await getSectionById(id) === null) {
    res.status(404).json({ message: 'Section not found' });
    return;
  }

  res.json(await getActivitiesBySectionId(id));
};
export default route;
