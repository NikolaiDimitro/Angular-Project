# Game Point

## Description

**Game Point** is a virtual space where users can browse different games and their respective information, such as description, release year, studio, name, image, and video trailer. Users can interact with games by liking them, commenting, and exploring details on each game's page. 

---

## Technologies

- **Angular**
- **Firebase** (2 projects: one for users, another for games)
- **TypeScript**
- **RxJS**

---

## Installation and Setup


### Step 1: Install Angular CLI

If you don't have Angular CLI installed, you can install it globally by running:

```bash
npm install -g @angular/cli

### Step 2 Clone the repository

```bash

git clone https://github.com/NikolaiDimitro/Angular-Project.git

### Step 3  Install dependencies - Navigate to the project directory and install all the required dependencies:

npm install

### Step 4 Start the project

ng serve


### Info 


Components:

 -   **Login: User login page.**
 -   **Registration: User registration page.**
 -   **Catalog: Displays the list of games.
 -   **Home: The homepage of the application.**
 -   **Search: Page for searching games.**
 -   **Game Details: Page to view detailed information about a specific game.**
 -   **Create Game: Allows users to create a new game.**
 -   **Edit Game: Enables users to edit their games (only for creators).
 -   **404: Page for handling unknown routes.**

### Other: 

**Services**

- **Services for handling Firebase operations, such as user authentication and game data.**

**Guards**

- **Guards for route protection, ensuring users can access certain routes only if they meet specific conditions (e.g., only creators can edit games).**

**Interfaces**

 - **TypeScript interfaces defining the structure of game data, user data, and other entities in the app.**
