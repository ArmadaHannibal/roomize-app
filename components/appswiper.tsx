// App.tsx ou un autre fichier parent
import { FeaturedProvider } from './contentHotel'; // Assurez-vous que le chemin est correct
import { ListeHotelHome } from './listehotelhome'; // Assurez-vous que le chemin est correct

export const AppSwiperHotelHome = () => {
    return (
        <FeaturedProvider>
            <ListeHotelHome />
        </FeaturedProvider>
    );
};
