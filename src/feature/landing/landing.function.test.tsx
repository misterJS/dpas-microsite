import { render, screen, fireEvent, queryByAttribute } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from "@/pages/home/HomePage";

const getById = queryByAttribute.bind(null, 'id');
const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('Landing Page', () => {
  it('routing button "Daftar sekarang"', () => {
    render(<HomePage />);
    const buttonRegister = screen.getByRole('button', { name: 'landing.registerNow' });
    fireEvent.click(buttonRegister);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/products');
  });
  it('routing button "Check RIPLAY Umum"', () => {
    render(<HomePage />);
    const button = screen.getByRole('button', { name: 'landing.checkRiplay' });
    fireEvent.click(button);
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/pdf/check-replay');
  });
});