import { fireEvent, render, screen } from '@testing-library/react'
import App from './App';
import '@testing-library/jest-dom';
import LandingCard from './Card'


/*LandingCard*/
test('Render Test', () => {
  //do something
  render(<LandingCard onGoClick={()=>{}} />);
  expect(screen.getByText('Where are you headed?')).toBeInTheDocument();
  expect(screen.getByLabelText('Destination')).toBeInTheDocument();
  expect(screen.getByRole('button', {name: 'Go'})).toBeInTheDocument();
});
test('updates input value on change', () => {
  render(<LandingCard onGoClick={()=>{}} />);
  const input = screen.getByLabelText('Destination');
  fireEvent.change(input, { target: {value: '123 This is a test Location st.' +
        ' @!#$'}});
  expect(input.value).toBe('123 This is a test Location st.' +
    ' @!#$');
});

//figure out if this is a a problem with the test or the module
//todo: fix this test; the component works as expected
test('Calls onGoClick with input value on submit', () => {
  const mockGoClick = jest.fn();
  render(<LandingCard onGoClick={mockGoClick} />);
  const input = screen.getByLabelText('Destination');
  fireEvent.change(input, { target: {Value: '123 This is a test Location st.'}});
  fireEvent.click(screen.getByRole('button', { name: 'Go'}));
  expect(mockGoClick).toBeCalledWith('123 This is a test Location st.');
})
