import {Button, Text} from "monday-ui-react-core";
import {useMondayContext} from "../context/MondayContext";
import {TextType} from "monday-ui-react-core/src/components/Text/TextConstants";

export default function NotSubscribedView() {
    const {monday} = useMondayContext();

    return (
        <div className={'flex justify-center items-center h-screen'}>
            <div className={'space-y-4'}>
                <Text type={'TextType.TEXT1'}>Subscription required to continue</Text>
                <div className={'flex justify-center'}>
                    <Button
                        size={'large'}
                        onClick={async () => await monday.execute('openPlanSelection', {isInPlanSelection: false})
                        }
                    >
                        See Plans
                    </Button>
                </div>
            </div>
        </div>
    )
}