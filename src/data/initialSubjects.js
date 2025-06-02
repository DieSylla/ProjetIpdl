/**
 * Liste initiale des matières pour l'application
 * Ces matières seront utilisées pour initialiser la base de données
 * si aucune matière n'existe déjà.
 */

export const initialSubjects = [
  {
    id: '1',
    nom: 'Mathématiques',
    description: 'Algèbre, géométrie, analyse et autres domaines des mathématiques',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '2',
    nom: 'Physique',
    description: 'Mécanique, électricité, optique, thermodynamique et autres domaines de la physique',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '3',
    nom: 'Chimie',
    description: 'Chimie organique, inorganique, physique et autres domaines de la chimie',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '4',
    nom: 'Biologie',
    description: 'Biologie cellulaire, moléculaire, génétique et autres domaines de la biologie',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '5',
    nom: 'Informatique',
    description: 'Programmation, algorithmes, bases de données et autres domaines de l\'informatique',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '6',
    nom: 'Langues',
    description: 'Français, anglais, espagnol, allemand et autres langues',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '7',
    nom: 'Histoire',
    description: 'Histoire ancienne, médiévale, moderne et contemporaine',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '8',
    nom: 'Géographie',
    description: 'Géographie physique, humaine, économique et politique',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '9',
    nom: 'Philosophie',
    description: 'Éthique, métaphysique, épistémologie et autres domaines de la philosophie',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '10',
    nom: 'Économie',
    description: 'Microéconomie, macroéconomie, finance et autres domaines de l\'économie',
    dateCreation: new Date().toISOString(),
    createdBy: 'system'
  }
];
