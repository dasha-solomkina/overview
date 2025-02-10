# Semantic Segmentation Labeling Tool

The objective was of this project was to create a semantic segmentation labeling tool that enables users to annotate data interactively, either through brush or polygon annotation modes. The tool allows users to upload images, annotate them with configurable classes, and export the results in COCO format. The design is fully responsive to ensure usability across various screen sizes.


<img src="https://github.com/user-attachments/assets/bcd737b3-9d7a-4281-bb4b-b3027db1694e" alt="image" height="250"/>
<img src="https://github.com/user-attachments/assets/c272f3ca-b733-41df-87ee-1b3965f1b0ad" alt="image" height="250"/>


## Key Features

- **Class Management**: Define class names and assign unique colors to each class to avoid color overlap.
- **Annotation Options**: Toggle between brush and polygon annotation modes, with adjustable brush size in brush mode.
- **Canvas Manipulation**: Interactive canvas using Fabric.js with a responsive layout, optimized for smaller screens.
- **Export Functionality**: Export annotations in the COCO format, with validation to ensure data integrity. 
- **Component-based Architecture**: The UI is built with a modular, component-based approach, enhancing maintainability and reusability.
- **Type Safety**: Every component has well-defined types, enhancing developer experience and type safety.
- **Tools**: React, TypeScript, Fabric.js, Material UI, Flask and Pydantic (API Validation).



## How to Run the Project on a Local Machine

### Prerequisites
- Frontend:
  - Node.js installed on your machine.
  - npm or yarn package manager.
- For the API validation:
  - Flask==2.3.3
  - Pydantic==1.10.11
### Steps
1. **Clone the repository**:

```
git clone git@github.com:dasha-solomkina/overview.git
cd overview
```

2. **Install dependencies**:

```
npm install
# or
yarn install
```


3. **Start the development server**:

```
npm run dev
# or
yarn dev
```

4. **Open your browser** and navigate to http://localhost:5173 to see the project in action.

#### API Validation:

1. Create a virtual environment to isolate project dependencies and avoid modifying your global Python setup.
2. Install the required packages:
```
pip install Flask==2.3.3 pydantic==1.10.11
```
3. Run the Flask application:

```
flask run
```
