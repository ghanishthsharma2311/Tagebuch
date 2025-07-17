// import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
// import App from '../App';

// describe('Tagebuch Pflichtfeatures', () => {
//   test('1️⃣ zeigt alle Tagebucheinträge mit Titel, Datum und Text, neuester zuerst', () => {
//     render(<App />);
    
//     fireEvent.change(screen.getByLabelText(/Title/i), {
//       target: { value: 'Erster Content' }
//     });
//     fireEvent.change(screen.getByLabelText(/Content/i), {
//       target: { value: 'Das ist der erste Text.' }
//     });
//     fireEvent.click(screen.getByText(/add entry/i));

//     fireEvent.change(screen.getByLabelText(/Title/i), {
//       target: { value: 'Zweiter Content' }
//     });
//     fireEvent.change(screen.getByLabelText(/Content/i), {
//       target: { value: 'Das ist der zweite Text.' }
//     });
//     fireEvent.click(screen.getByText(/add entry/i));

//     const entries = screen.getAllByTestId('entry');
//     expect(entries[0]).toHaveTextContent('Zweiter Content');
//     expect(entries[1]).toHaveTextContent('Erster Content');
//   });

 

//   test('2️⃣ erstellt neuen Content mit aktuellem Datum', async () => {
//   render(<App />);
  
//   fireEvent.change(screen.getByLabelText(/Title/i), {
//     target: { value: 'Test Titel' }
//   });
//   fireEvent.change(screen.getByLabelText(/Content/i), {
//     target: { value: 'Test Inhalt' }
//   });
//   fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

//   const formattedDate = new Date().toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });

//   expect(await screen.findByText(/Test Titel/)).toBeInTheDocument();
//   expect(await screen.findByText(/Test Inhalt/)).toBeInTheDocument();

//   // Robust: mindestens ein Element mit dem Datum
//   const dateElements = screen.getAllByText(formattedDate);
//   expect(dateElements.length).toBeGreaterThanOrEqual(1);
//   });

//   test('3️⃣ markiert und entmarkiert Content als wichtig', () => {
//   render(<App />);

//   fireEvent.change(screen.getByLabelText(/Title/i), {
//     target: { value: 'Wichtiger Tag' }
//   });
//   fireEvent.change(screen.getByLabelText(/Content/i), {
//     target: { value: 'Ein besonderer Tag' }
//   });
//   fireEvent.click(screen.getByText(/add entry/i));

//   // Nimm den zuletzt hinzugefügten Button
//   const markButtons = screen.getAllByRole('button', {
//     name: /mark as important/i
//   });
//   const markButton = markButtons[markButtons.length - 1];

//   expect(markButton.classList.contains('important')).toBe(false);

//   fireEvent.click(markButton);
//   expect(markButton.classList.contains('important')).toBe(true);

//   fireEvent.click(markButton);
//   expect(markButton.classList.contains('important')).toBe(false);
// });

// });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Tagebuch Pflichtfeatures', () => {
  // UPDATE: Made the test async and used `findAllByTestId`
  test('1️⃣ zeigt alle Tagebucheinträge mit Titel, Datum und Text, neuester zuerst', async () => {
    render(<App />);
    
    // Add first entry
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Erster Content' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Das ist der erste Text.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

    // Add second entry
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Zweiter Content' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Das ist der zweite Text.' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

    // Use `findAllByTestId` to wait for the entries to appear on the screen
    const entries = await screen.findAllByTestId('entry');

    expect(entries[0]).toHaveTextContent('Zweiter Content');
    expect(entries[1]).toHaveTextContent('Erster Content');
  });

// UPDATE: This test now CONTROLS the date input to be deterministic
  test('2️⃣ erstellt neuen Content mit aktuellem Datum', async () => {
    render(<App />);

    // 1. Define a specific, known date for our test
    const testDate = '2025-07-18';
    // Create a corresponding Date object. Adding 'T12:00:00' avoids timezone issues near midnight.
    const testDateObject = new Date(`${testDate}T12:00:00`); 

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Test Titel' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Test Inhalt' }
    });
    
    // 2. Find the date input and explicitly set its value
    const dateInput = screen.getByLabelText(/Date/i);
    fireEvent.change(dateInput, { target: { value: testDate } }); // Sets the input to '2025-07-18'

    // Click the add entry button
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

    // 3. Format the SAME known date into the expected display format
    const formatDateForTest = (date: Date): string => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric', // Use 'numeric' for '18' instead of '2-digit' for '18'
            month: 'short',
            year: 'numeric'
        };
        return new Intl.DateTimeFormat('en-GB', options).format(date);
    };
    const expectedDateString = formatDateForTest(testDateObject); // This will be "18 Jul 2025"

    // 4. Assert that the controlled date is now displayed in the entry
    expect(await screen.findByText(expectedDateString)).toBeInTheDocument();
    expect(await screen.findByText(/Test Titel/)).toBeInTheDocument();
    expect(await screen.findByText(/Test Inhalt/)).toBeInTheDocument();
  });

  // UPDATE: Made the test async and used `waitFor` for assertions
  test('3️⃣ markiert und entmarkiert Content als wichtig', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Title/i), {
      target: { value: 'Wichtiger Tag' }
    });
    fireEvent.change(screen.getByLabelText(/Content/i), {
      target: { value: 'Ein besonderer Tag' }
    });
    fireEvent.click(screen.getByRole('button', { name: /add entry/i }));

    // Wait for the button to appear and get the last one added
    const markButtons = await screen.findAllByRole('button', {
      name: /mark as important/i
    });
    const markButton = markButtons[markButtons.length - 1];

    // Check initial state (not important)
    expect(markButton.classList.contains('important')).toBe(false);

    // ACTION: Click to mark as important
    fireEvent.click(markButton);
    
    // ASSERTION: Wait for React to re-render and apply the 'important' class
    await waitFor(() => {
      expect(markButton.classList.contains('important')).toBe(true);
    });

    // ACTION: Click to unmark
    fireEvent.click(markButton);

    // ASSERTION: Wait for React to re-render and remove the 'important' class
    await waitFor(() => {
      expect(markButton.classList.contains('important')).toBe(false);
    });
  });
});
