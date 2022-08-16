import { useHistory } from "react-router-dom";

export default function useNweetHistory() {
    const history = useHistory();

    return {
        moveToHomePage: () => history.push('/'),
        replaceWithSignInPage: () => history.replace('/signin', { origin: history.location })
    }
}
