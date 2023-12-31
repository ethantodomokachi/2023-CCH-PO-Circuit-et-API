import type { RouteHandler } from '../../../models';
import { getSectionById } from '../../../services/section';

/**
 * Controller pour la route /section/:slug
 * @param req Requete
 * @param res Reponse
 * @returns La section correspondante à l'id
 */
const route: RouteHandler<{ slug: string; }> = async (req, res) => {
  const id = parseInt(req.params.slug);

  // Vérification de l'id
  if (typeof id === null || isNaN(id)) {
    res.status(400).json({ message: 'Invalid id' });
    return;
  }

  const section = await getSectionById(id);

  // Vérification de l'existence de la section
  if (section === null) {
    res.status(404).json({ message: 'Section not found' });
    return;
  }

  // Envoi des informations
  res.json(section);
};
export default route;
