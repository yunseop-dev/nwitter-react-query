import localforage from 'localforage';
import { useQuery } from "@tanstack/react-query";
import useLocalStorage from '../useLocalStorage';

localforage.config({
    driver: localforage.INDEXEDDB,
    name: 'firebaseLocalStorageDb',
    version: 1,
    storeName: 'firebaseLocalStorage'
})

export default function useAccessTokenFromIndexedDb() {
    const [token, setToken] = useLocalStorage<string | null>('idToken', null);
    return useQuery<string | null>(
        ['idToken'],
        async () => {
            const tokenFromIndexedDb = await localforage
                .getItem<string | null>(`firebase:authUser:${process.env.REACT_APP_API_KEY}:[DEFAULT]`)
                .then((data: any) => {
                    if (!data) return null;
                    return data.value.stsTokenManager.accessToken
                })
            setToken(tokenFromIndexedDb);
            return token ?? tokenFromIndexedDb;
        }, {
        initialData: token
    })
}
