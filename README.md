# Diary Semester Project
This repository contains the "Diary" semester project, a React application that allows users to create, view, and manage diary entries.

#  Instructions to Run the Project
To run the project locally, please follow these steps:

# Clone the Repository:

git clone https://github.com/ghanishthsharma2311/Tagebuch.git

# Navigate to the Project Directory:

cd Tagebuch

# Install Dependencies:
Ensure that Node.js and npm are installed on your system.

- npm install


# Start the Application:
After all dependencies have been installed, you can start the application:

- npm run dev


The application will open by default in your browser at http://localhost:3000.

# Implemented Features
The following features have been implemented as part of this semester project:

# Mandatory Features !!
Display All Diary Entries:

1. The most recent diary entry will always be displayed at the top of the list. The title, creation date, and a preview of the text will be displayed.

2. Create and Display New Diary Entries:
    - An entry consists of a title and a text block of any length.

    - A new entry is always assigned the current date upon creation.

3. Marking Important / Special Diary Entries:

    - Marked entries are easily accessible, e.g., through a dedicated view or a suitable filtering option.

    - Markings can be set and removed dynamically by the user.

    - Marked diary entries can be visually distinguished (e.g., by an icon or color) from regular diary entries.

4. Diary Entry Preview:

    - In the overview, the text of the entry is displayed only as a preview with a maximum of 250 characters.

    - If the text of the diary entry is less than 250 characters long, the entire text is displayed.

    - For entries exceeding this limit, the user can display the entire diary entry through suitable interaction (e.g., clicking on the entry).

# Optional Features
1. Persistent Storage of Diary Entries:

    - All diary entries remain even after closing the application and are displayed again when restarting.

2. Setting an Alternative Creation Date:

    - Users can set a creation date different from the current date when creating an entry.

# Instructions to Run Unit Tests
Unit tests have been implemented with Jest to ensure the functionality of the application. Tests have been created for three mandatory features of the project, which run successfully.

To run the unit tests, follow these steps:
- Ensure you are in the project directory and all dependencies are installed.
- Execute the test command:
    * npm jest

This command starts Jest and runs all tests defined in the project. The results will be displayed directly in the console
