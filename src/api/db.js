import { createClient } from "@sanity/client";
import { hashPassword, verifyPassword } from "../helpers/security";
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

const userSchema = async (user, name, password, invoice_key, wallet_id, admin_key, user_id, lnurlp) => {
    let hash = await hashPassword(password);
    return {
        _type: 'stores',
        user: user,
        name: name,
        password: hash,
        invoice_key: invoice_key,
        wallet_id: wallet_id,
        admin_key: admin_key,
        user_id: user_id,
        lnurlp: lnurlp
    }
}

const changeSchema = (id_lnurl, link_lnurl, date, amount_sats, amount_usd, store) => {
    return {
        _type: 'changes',
        id_lnurl: id_lnurl,
        link_lnurl: link_lnurl,
        date: date,
        amount_sats: amount_sats,
        amount_usd: amount_usd,
        status: true,
        store: {
            _type: 'reference',
            _ref: store
        }
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

const verifyCredentials = async(user, password) => {
    try {
        const query = `*[_type == 'stores' && user == $user ] { _id, user, password, invoice_key, wallet_id, admin_key, user_id, lnurlp }`;
        const response = await client.fetch(query, { user });

        if (!response) {
            return;
        }

        const isPassword = await verifyPassword(password, response[0].password);

        return isPassword ? response[0] : false;
    } catch (error) {
        console.error("Error fetching credentials", error.message);
    }
}

const getVoucherByUid = async (uid) => {
    try {
        const query = `*[_type == 'changes' && id_lnurl == $uid] {_id, link_lnurl, date, amount_sats, amount_usd, status}`;
        const response = await client.fetch(query, { uid });

        if (!response) {
            return;
        }

        return response;
    } catch (error) {
        console.error("Error fetching Voucher", error.message);
    }
}

const getAllVouchersByStore = async (id) => {
    try {
        const query = `*[_type == 'changes' && store._ref == $id] | order(status desc) {_id, id_lnurl, amount_usd, date, status}`;
        const response = await client.fetch(query, { id });

        if (!response) {
            return;
        }

        return response;
    } catch (error) {
        console.error("Error fetching vouchers", error.message);
    }
}

const updateStatusVoucher = async (id) => {
    try {
        const result = client.patch(id).set({status: false}).commit();
        return result;
    } catch (error) {
        console.error("error patching", error.message);
    }
}

export {    userSchema,
            insertSanity,
            checkUniqueUser,
            verifyCredentials,
            changeSchema,
            getVoucherByUid,
            getAllVouchersByStore,
            updateStatusVoucher }