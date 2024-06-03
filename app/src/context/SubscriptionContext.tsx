import {createContext, useEffect, useState} from "react";
import {useMondayContext} from "./MondayContext";
import {Text} from "monday-ui-react-core";
import NotSubscribedView from "../components/NotSubscribedView";

interface SubscriptionContextData {

}

const SubscriptionContext = createContext<SubscriptionContextData>({});

export const useSubscriptionContext = () => {
    return SubscriptionContext;
}

export const SubscriptionProvider = ({children}) => {
    const {isLoaded, context, sessionToken, monday} = useMondayContext();
    const [hasSubscription, setHasSubscription] = useState<boolean>(false);

    useEffect(() => {
        async function checkSubscription() {
            const subscriptions = await monday.api(getSubscriptionQuery)
            if (subscriptions.data.app_subscription.length === 0) {
                setHasSubscription(false)
            }

        }

        checkSubscription()
    }, []);

    return (
        <SubscriptionContext.Provider value={{}}>
            {!hasSubscription ? (
                <NotSubscribedView/>
            ) : children}
        </SubscriptionContext.Provider>
    );
};

const getSubscriptionQuery = `
    query {
        app_subscription {
            is_trial
            days_left
            plan_id  
        }
    }
`;