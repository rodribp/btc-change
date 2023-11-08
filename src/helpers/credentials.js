const USER_ID_SANITY = 'key1';
const USER_ID_LNBITS = 'key2';
const USER = 'key3';
const INVOICE_KEY = 'key4';
const WALLET_ID = 'key5';
const ADMIN_KEY = 'key6';
const LNURLP = 'key7';

const getLnurlp = () => {
    return localStorage.getItem(LNURLP);
}

const getData = () => {
    return {sanityId: localStorage.getItem(USER_ID_SANITY),
            lnbitsId: localStorage.getItem(USER_ID_LNBITS),
            user: localStorage.getItem(USER),
            invoiceKey: localStorage.getItem(INVOICE_KEY),
            walletId: localStorage.getItem(WALLET_ID),
            adminKey: localStorage.getItem(ADMIN_KEY)};
}

const login = (userIdSanity, userIdLnbits, user, invoiceKey, walletId, adminKey, lnurlp) => {
    localStorage.setItem(USER_ID_SANITY, userIdSanity);
    localStorage.setItem(USER_ID_LNBITS, userIdLnbits);
    localStorage.setItem(USER, user);
    localStorage.setItem(INVOICE_KEY, invoiceKey);
    localStorage.setItem(WALLET_ID, walletId);
    localStorage.setItem(ADMIN_KEY, adminKey);
    localStorage.setItem(LNURLP, lnurlp);
}

const logOut = () => {
    localStorage.removeItem(USER_ID_SANITY);
    localStorage.removeItem(USER_ID_LNBITS);
    localStorage.removeItem(USER);
    localStorage.removeItem(INVOICE_KEY);
    localStorage.removeItem(WALLET_ID);
    localStorage.removeItem(ADMIN_KEY);
    localStorage.removeItem(LNURLP);
}

const isLoggedIn = () => {
    return getData().sanityId;
}

export {login, logOut, getData, isLoggedIn, getLnurlp}
