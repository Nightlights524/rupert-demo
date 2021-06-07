import { render, screen } from '@testing-library/react';
import RupertApp from './RupertApp';

test('renders learn react link', () => {
  render(<RupertApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
