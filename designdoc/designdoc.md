# Design Document for DishDialog

## 1. Introduction

DishDialog is a MERN (MongoDB, Express.js, React, Node.js) application that allows users to interact with recipes and comments. The application provides functionalities such as user registration, authentication, recipe creation, and commenting.

## 2. Backend Design

### 2.1 Controllers

#### 2.1.1 Comments Controller (`commentscontroller.ts`)

Handles operations related to comments.

```typescript
router.post('/add', auth, async (req: Request, res: Response) => {
    // ... code for adding a comment ...
});
```
#### 2.1.2 Recipes Controller (`recipescontroller.ts`)
Manages operations related to recipes.

```typescript
router.post('/create', auth, async (req: Request, res: Response) => {
    // ... code for creating a recipe ...
});
```

#### 2.1.3 Users Controller (`userscontroller.ts`)
Responsible for user-related operations.

```typescript
router.post('/register', async (req: Request, res: Response) => {
    // ... code for registering a user ...
});
```

### 2.2 Middleware

#### 2.2.1 Authentication Middleware (`auth.ts`)
Ensures authentication for certain routes and operations.

```typescript
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    // ... authentication logic ...
};
```

### 2.3 Models

#### 2.3.1 Comment Model (`comment.ts`)
Defines the schema and model for comments in the MongoDB database.

```typescript
const commentSchema = new mongoose.Schema({
    // ... comment schema definition ...
});
```

#### 2.3.2 Recipe Model (`recipe.ts`)
Defines the schema and model for recipes in the MongoDB database.

```typescript
const recipeSchema = new mongoose.Schema({
    // ... recipe schema definition ...
});
```

#### 2.3.3 User Model (`user.ts`)
Defines the schema and model for users in the MongoDB database.

```typescript
const userSchema = new mongoose.Schema({
    // ... user schema definition ...
});
```

### 2.4 Routes

#### 2.4.1 Comments Routes (`comments.ts`)
Defines the routes for comments.

```typescript
router.post('/add', auth, async (req: Request, res: Response) => {
    // ... code for adding a comment ...
});
```

#### 2.4.2 Recipes Routes (`recipes.ts`)
Defines the routes for recipes.

```typescript
router.post('/create', auth, async (req: Request, res: Response) => {
    // ... code for creating a recipe ...
});
```

#### 2.4.3 Users Routes (`users.ts`)
Defines the routes for users.

```typescript
router.post('/register', async (req: Request, res: Response) => {
    // ... code for registering a user ...
});
```

### 2.5 Server (`server.ts`)
Defines the server for the application.

```typescript
const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/users', usersRouter);
app.use('/api/recipes', recipesRouter);
app.use('/api/comments', commentsRouter);
```

## 3. Frontend Design

## App.tsx
- The main application component that integrates various components based on routing and application state.

## Components

### NavigationBar.tsx
- Serves as the main navigation bar for the application.
- Contains links to various views and possibly user authentication options.

### AddEditRecipeDialog.tsx
- Provides a dialog interface for adding or editing recipes.

### ConfirmationDialog.tsx
- A generic confirmation dialog that can be used across the application.

### LoginModal.tsx
- A modal dialog for user login.

### SignUpModal.tsx
- A modal dialog for user registration.

### NavBarLoggedInView.tsx & NavBarLoggedOutView.tsx
- Components representing the navigation bar's view based on the user's authentication status.

### PublicRecipesComp

#### PublicRecipe.tsx
- Represents an individual public recipe.

#### PublicRecipesView.tsx
- Displays a list of public recipes.

#### CommentSection.tsx
- Represents the comment section associated with a public recipe.

#### SearchResultsPage.tsx
- Displays the search results for recipes.

### Recipe.tsx
- Represents an individual recipe, possibly used in various views.

### RecipeImgDetailedDialog.tsx & RecipeNoImgDetailedDialog.tsx
- Dialogs that provide detailed views of recipes, with and without images respectively.

### RecipesPageLoggedInView.tsx & RecipesPageLoggedOutView.tsx
- Views for the recipes page based on the user's authentication status.

### form

#### FileInputField.tsx & TextInputField.tsx
- Form input components for file and text inputs respectively.

