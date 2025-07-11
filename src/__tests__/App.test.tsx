import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Tagebuch Pflichtfeatures', () => {
  test('1️⃣ zeigt alle Tagebucheinträge mit Titel, Datum und Text, neuester zuerst', () => {
    render(<App />);
    
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Erster Content' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Das ist der erste Text.' }
    });
    fireEvent.click(screen.getByText(/add entry/i));

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Zweiter Content' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Das ist der zweite Text.' }
    });
    fireEvent.click(screen.getByText(/add entry/i));

    const entries = screen.getAllByTestId('entry');
    expect(entries[0]).toHaveTextContent('Zweiter Content');
    expect(entries[1]).toHaveTextContent('Erster Content');
  });

 

  test('2️⃣ erstellt neuen Content mit aktuellem Datum', async () => {
  render(<App />);
  
  fireEvent.change(screen.getByLabelText(/Title/i), {
    target: { value: 'Test Titel' }
  });
  fireEvent.change(screen.getByLabelText(/Content/i), {
    target: { value: 'Test Inhalt' }
  });
  fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  expect(await screen.findByText(/Test Titel/)).toBeInTheDocument();
  expect(await screen.findByText(/Test Inhalt/)).toBeInTheDocument();

  // Robust: mindestens ein Element mit dem Datum
  const dateElements = screen.getAllByText(formattedDate);
  expect(dateElements.length).toBeGreaterThanOrEqual(1);
  });

  test('3️⃣ markiert und entmarkiert Content als wichtig', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/Title/i), {
    target: { value: 'Wichtiger Tag' }
  });
  fireEvent.change(screen.getByLabelText(/Content/i), {
    target: { value: 'Ein besonderer Tag' }
  });
  fireEvent.click(screen.getByText(/add entry/i));

  // Nimm den zuletzt hinzugefügten Button
  const markButtons = screen.getAllByRole('button', {
    name: /mark as important/i
  });
  const markButton = markButtons[markButtons.length - 1];

  expect(markButton.classList.contains('important')).toBe(false);

  fireEvent.click(markButton);
  expect(markButton.classList.contains('important')).toBe(true);

  fireEvent.click(markButton);
  expect(markButton.classList.contains('important')).toBe(false);
});

});
