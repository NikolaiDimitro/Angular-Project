Game Point

Description

Game Point is a virtual space where users can browse different games and their respective information, such as description, release year, studio, name, image, and video trailer.

Technologies

Angular

Firebase (2 projects: one for users, another for games)

TypeScript

RxJS

Installation and Setup

Install Angular CLI if you haven't already:


npm install -g @angular/cli


Clone the repository:

git clone <https://github.com/NikolaiDimitro/Angular-Project.git>

Install dependencies:

npm install

Configure Firebase keys (follow Firebase documentation for setup).

Role of Firebase

Firebase Project 1: Stores user data (authentication).

Firebase Project 2: Stores game data and related information.

Project Structure

In the src folder, the following directories are organized:

Interfaces

Services

Guards

Components for Login and Registration

Catalog (for the game list)

Home Page

Search Page

Game Details Page

Game Creation Page

Game Edit Page

404 Page

App Component: Includes the header and footer components. The header contains navigation buttons.
