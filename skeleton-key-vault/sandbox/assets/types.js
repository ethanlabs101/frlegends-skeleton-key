export const ASSET_TYPES = {
    LIVERY: ["livery", "car_livery"],
    FULL_CAR: ["full_car", "car"],
    PACK: ["pack"]
};

export function getAssetTypeName(type) {
    if(ASSET_TYPES.LIVERY.includes(type)) {
        return "Livery";
    }
    if(ASSET_TYPES.FULL_CAR.includes(type)) {
        return "Full Car";
    }
    if(ASSET_TYPES.PACK.includes(type)) {
        return "Pack";
    }
    return "Unknown";
}
