import { Request, Response } from 'express';

const movies = [
  { id: '1', title: 'Интерстеллар', poster: 'https://krot.info/uploads/posts/2021-12/1639873466_52-krot-info-p-interstellar-art-krasivo-56.jpg' },
  { id: '2', title: 'Начало', poster: 'https://www.film.ru/sites/default/files/movies/posters/1611667-1707898.jpg' }
];

export function getMovies(req: Request, res: Response) {
  res.json(movies);
}