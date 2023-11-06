import { createClient } from "@sanity/client";
import { hashPassword } from "../helpers/security";
const PROJECT_ID = 'oob058kw';
const KEY = 'skDEcDYSJo1PM0ee3JYwPBwNuxHz0JWftgjjOuXnWVIiXaTF4xWdr4qda5wigtrlZNecUdwJbam7D5ZxpiAVzjsxlEbHM8kOfE6u45ETiUiSlvbKsCFGuS0inntGbmXs4NqZWBKSD6D22vzEi79j2P3DHd4eMZ4EsMG5t8ARqlJL41OMPvL0';
const DATASET = 'production';

const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    useCdn: false,
    token: KEY,
    apiVersion: '2021-08-31',
    ignoreBrowserTokenWarning: true
});

const userSchema = async (user, name, password, invoice_key, wallet_id, admin_key, user_id) => {
    let hash = await hashPassword(password);
    return {
        _type: 'stores',
        user: user,
        name: name,
        password: hash,
        invoice_key: invoice_key,
        wallet_id: wallet_id,
        admin_key: admin_key,
        user_id: user_id
    }
}

const insertSanity = async (data) => {
    try {
        const response = await client.create(data);
        return response;
    } catch (error) {
        console.error('error inserting data: ', error.message)
    }
}

const checkUniqueUser = async (user) => {
    try {
        const query = `*[_type == 'stores' && user == $user ] { _id }`;
        const response = await client.fetch(query, { user });

        return response.length;
    } catch (error) {
        console.error("Error fetching stores", error.message);
    }
}

export {    userSchema,
            insertSanity,
            checkUniqueUser }