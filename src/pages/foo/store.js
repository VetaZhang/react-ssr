import { generateReducer } from '../../redux/generater';

const foo = {
  name: 'Veeta',
  changeName() {
    this.set({ name: `${this.name}!` });
  },
};

generateReducer({
  name: 'foo',
  state: foo,
});