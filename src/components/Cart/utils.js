export const formatNumber = number => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
}

export const isBrowser = () => typeof window !== "undefined"

export const setGenericLocalStorage = (key, value) => {
    if (isBrowser()) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }
}

export const getGenericLocalStorage = (key) => {
    return ((isBrowser() && window.localStorage.getItem(key)) ? JSON.parse(window.localStorage.getItem(key)) : []);
}