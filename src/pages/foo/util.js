
import { get } from 'utils/request';

export const getInitialData = () => {
  return get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(res => res.url)
    .catch(err => console.log(err));
};