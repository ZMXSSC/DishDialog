import React, {useState, useEffect} from 'react';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import * as RecipesApi from "../network/recipes_api";
import {Recipe} from "../models/recipe";
import L from 'leaflet';
import foodImage from '../utils/food.png';
import RecipeImgDetailedDialog from '../components/RecipeImgDetailedDialog'
import RecipeNoImgDetailedDialog from '../components/RecipeNoImgDetailedDialog';
import {formatDate} from "../utils/formatDate";

const foodIcon = L.icon({
    iconUrl: foodImage,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const DiscoverPage = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        async function loadRecipes() {
            const publicRecipes = await RecipesApi.fetchPublicRecipes()
            setRecipes(publicRecipes);
        }

        loadRecipes();
    }, []);
 
    const onPopupClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
    };

    const onDismiss = () => {
        setSelectedRecipe(null);
    };

    return (
        <>
            <MapContainer style={{height: "88vh", width: "100%"}} center={[37.8277754, -122.2662917]} zoom={13}
                          scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {recipes.map((recipe, idx) =>
                    recipe.latitude !== undefined && recipe.longitude !== undefined ? (
                        <Marker
                            key={idx}
                            position={[recipe.latitude, recipe.longitude]}
                            icon={foodIcon}
                        >
                            <Popup>
                                <div onClick={() => onPopupClick(recipe)}>{recipe.title}</div>
                            </Popup>
                        </Marker>
                    ) : null
                )}
            </MapContainer>
            {selectedRecipe && selectedRecipe.hasImage ? (
                <RecipeImgDetailedDialog
                    recipe={selectedRecipe}
                    onDismiss={onDismiss}
                    createdAtString={"Created: " + formatDate(selectedRecipe.createdAt)}
                    updatedAtString={"Updated: " + formatDate(selectedRecipe.updatedAt)}
                    isPublic={selectedRecipe.isPublic}
                />
            ) : (
                selectedRecipe && (
                    <RecipeNoImgDetailedDialog
                        recipe={selectedRecipe}
                        onDismiss={onDismiss}
                        createdAtString={"Created: " + formatDate(selectedRecipe.createdAt)}
                        updatedAtString={"Updated: " + formatDate(selectedRecipe.updatedAt)}
                        isPublic={selectedRecipe.isPublic}
                    />
                )
            )}
        </>
    );
}

export default DiscoverPage;
