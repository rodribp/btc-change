const DOMAIN = 'https://legend.lnbits.com/';

const API_URL = DOMAIN + 'api/v1/';

const ADMIN_KEY = '82d58622242448b3a89af0edbce40d19';
const INVOICE_KEY = 'e296c489b8cc42cdad5d26d9f6481500';
const WALLET_ID = 'e3bf70b0743a4adab9fa8045bddfa421';
const USER_ID = '827252d16a7d405e8e8b98d064c4df78';

const USER_MANAGER_URL = DOMAIN + 'usermanager/api/v1/'
const LNURLP_URL = DOMAIN + 'lnurlp/api/v1/links';
const LNURLW_URL = DOMAIN + 'withdraw/api/v1/';

const apiRequestGet = async (url, key, action) => {
    let options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': key
        }
    }

    const response = await fetch(url + action, options);
    const json = await response.json();

    if (json.error) {
        console.log(json.error);
    }

    return json;
}

const apiRequestPost = async (url, key, action, body) => {
    let options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': key
        },
        body: JSON.stringify(body)
    }

    const response = await fetch(url + action, options);
    const json = await response.json();

    if (json.error) {
        console.log(json.error);
    }

    return json;
}

//structure to create user
const createBody = (username, walletname, email, password) => {
    let body = {
        'admin_id': USER_ID,
        'user_name': username,
        'wallet_name': walletname,
        'email': email,
        'password': password
    }
    return body;
}


const getLastUsrData = async () => {
    let data = await apiRequestGet(USER_MANAGER_URL, ADMIN_KEY, 'wallets');
    let json = '';

    for (var i = 0; i < data.length; i++) {
        if (i == data.length - 1) {
            json = {
                user: data[i].user,
                inkey: data[i].inkey,
                adminkey: data[i].adminkey,
                id: data[i].id
            }
            
        }
    }

    return json;
}

//function to get data from an specific usr id
const getDataFromUser = async (user) => {
    let data = await apiRequestGet(USER_MANAGER_URL, ADMIN_KEY, 'wallets');
    let json = '';

    for (var i = 0; i < data.length; i++) {
        if (data[i].user == user) {
            json = {
                admin: data[i].admin,
                adminkey: data[i].adminkey,
                id: data[i].id,
                inkey: data[i].inkey,
                name: data[i].name,
                user: data[i].user
            }
        }
    }

    return json;
}

const getTransactions = async (key) => {
    const response = await apiRequestGet(API_URL, key, 'payments');

    return response;
}


//function to get data from an specific usr id
const verifyUser = async (user) => {
    let data = await apiRequestGet(USER_MANAGER_URL, ADMIN_KEY, 'wallets');

    return data;
}

const createNewUser = async (username, walletname, email, password) => {
    await apiRequestPost(USER_MANAGER_URL, ADMIN_KEY, 'users', createBody(username, walletname, email, password));
    let data = await getLastUsrData();
    await apiRequestPost(USER_MANAGER_URL, ADMIN_KEY, 'extensions?extension=withdraw&userid=' + data.user + '&active=true');
    await apiRequestPost(USER_MANAGER_URL, ADMIN_KEY, 'extensions?extension=lnurlp&userid=' + data.user + '&active=true');
    let lnurlp = await apiRequestPost(LNURLP_URL, data.adminkey, '', {'description': '', 'max': 1000000, 'min': 1, 'zaps': 'false', 'comment_chars': 0});

    data = {
        ...data,
        lnurlp: lnurlp.lnurl
    }

    return data;
}

const createWithdraw = async (key, title, amount) => {
    const response = await apiRequestPost(LNURLW_URL, key, 'links', {title: title, min_withdrawable: amount, max_withdrawable: amount, uses: 1, wait_time: 1, is_unique: true});

    return response;
}

const getBalance = async (key) => {
    const response = await apiRequestGet(API_URL, key, 'wallet');

    return response.balance;
}

const getVouchers = async (invoiceKey) => {
    const response = await apiRequestGet(LNURLW_URL, invoiceKey, 'links');

    return response;
}

export {createNewUser, verifyUser, getLastUsrData, getBalance, createWithdraw, getTransactions, getVouchers }