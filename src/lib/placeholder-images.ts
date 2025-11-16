
import images from './placeholder-images.json';

type PlaceHolderImage = {
    key: string;
    src: string;
    alt: string;
    hint: string;
};

export const PlaceHolderImages: PlaceHolderImage[] = images;
