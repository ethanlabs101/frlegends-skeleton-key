import axios from "axios";

const DATABASE_URL = "https://raw.githubusercontent.com/ethanlabs101/FRLegends-Asset-Database/main/database.json";

export async function fetchDatabase() {
    const response = await axios.get(DATABASE_URL);
    return response.data;
}
