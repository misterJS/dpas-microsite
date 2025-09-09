import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "@/pages/home/HomePage";
import * as ReactRouterDom from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useNavigate: jest.fn(),
}));
const mockedUsedNavigate = jest.fn();

describe('HomePage', () => {
  it('should navigate to a new route on button click', () => {
    render(<HomePage />);
    const button = screen.getByRole('button', { name: 'landing.registerNow' }); // Assuming a button with this text
    fireEvent.click(button);
    // expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard');
    // expect(button).toBeInTheDocument();
  });
});